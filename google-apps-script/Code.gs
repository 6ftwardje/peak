/**
 * Peak Automations — intake CRM sink (Google Apps Script, bound to the "Intakes" sheet).
 *
 * Receives JSON from the Netlify function, upserts one row per intake_id, and is safe
 * against out-of-order writes (seq guard), concurrent writes (LockService), and
 * spreadsheet formula injection (sanitize_).
 *
 * SETUP: see GOOGLE_SHEETS_SETUP.md. Replace TOKEN below, run setupSheet() once,
 * then Deploy → Web app (Execute as: me, Access: Anyone).
 */

// 1) Replace with a long random secret; it must match the ?token=... in GOOGLE_SHEETS_WEBHOOK_URL.
var TOKEN = 'REPLACE_WITH_A_LONG_RANDOM_TOKEN';

var SHEET_NAME = 'Intakes';

var COLUMNS = [
  'updated_at', 'created_at', 'intake_id', 'last_seq', 'status', 'follow_up_status',
  'consent', 'source', 'step', 'emailed',
  'name', 'email', 'phone', 'company', 'website', 'role', 'business',
  'team_size', 'time_loss', 'tools', 'ai_experience', 'timeline', 'budget',
];

// Answer keys that the front-end sends inside payload.answers.
var ANSWER_FIELDS = [
  'name', 'email', 'phone', 'company', 'website', 'role', 'business',
  'team_size', 'time_loss', 'tools', 'ai_experience', 'timeline', 'budget',
];

// Statuses that must always apply, regardless of seq ordering.
var TERMINAL = ['new', 'calendly_opened', 'follow_up_requested', 'appointment_booked'];

function col_(name) { return COLUMNS.indexOf(name); }

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return jsonOut_({ ok: true, service: 'peak-intake' });
}

function doPost(e) {
  try {
    if (!e || !e.parameter || e.parameter.token !== TOKEN) {
      return jsonOut_({ ok: false, reason: 'bad_token' });
    }
    var payload = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (payload.consent !== true) return jsonOut_({ ok: false, reason: 'no_consent' });

    var id = String(payload.intake_id || '').trim();
    if (!id) return jsonOut_({ ok: false, reason: 'no_id' });

    var seq = Number(payload.seq) || 0;
    var status = String(payload.status || 'draft');
    var isTerminal = TERMINAL.indexOf(status) !== -1;
    var answers = payload.answers || {};

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = getSheet_();
      var idCol = col_('intake_id') + 1;
      var finder = sheet.getRange(1, idCol, sheet.getMaxRows(), 1)
        .createTextFinder(id).matchEntireCell(true);
      var cell = finder.findNext();

      // New intake → append a row (drafts stay visible as abandoned rows).
      if (!cell) {
        // If it lands straight as "new", that is the first (and only) email trigger.
        var firstNewOnAppend = status === 'new';
        sheet.appendRow(buildNewRow_(payload, id, seq, status, answers, firstNewOnAppend));
        return jsonOut_({ ok: true, stored_seq: seq, status: status, first_new: firstNewOnAppend });
      }

      var rowIndex = cell.getRow();
      var range = sheet.getRange(rowIndex, 1, 1, COLUMNS.length);
      var values = range.getValues()[0];
      var lastSeq = Number(values[col_('last_seq')]) || 0;

      // Ordering: seq alone decides. Terminal statuses always apply.
      if (seq <= lastSeq && !isTerminal) {
        return jsonOut_({ ok: true, stored_seq: lastSeq, status: values[col_('status')] });
      }

      // Merge: overlay only provided answers; never blank an existing cell.
      ANSWER_FIELDS.forEach(function (f) {
        if (answers[f] != null && String(answers[f]).length) {
          values[col_(f)] = sanitize_(answers[f]);
        }
      });
      values[col_('updated_at')] = new Date();
      values[col_('last_seq')] = Math.max(seq, lastSeq);
      values[col_('status')] = status;
      values[col_('consent')] = true;
      if (payload.source) values[col_('source')] = sanitize_(payload.source);
      if (payload.step) values[col_('step')] = Number(payload.step) || values[col_('step')];
      if (status === 'follow_up_requested') values[col_('follow_up_status')] = 'requested';

      // Email trigger: only the first time this intake reaches "new".
      var firstNew = false;
      if (status === 'new' && !values[col_('emailed')]) {
        values[col_('emailed')] = new Date();
        firstNew = true;
      }

      range.setValues([values]);
      return jsonOut_({ ok: true, stored_seq: Math.max(seq, lastSeq), status: status, first_new: firstNew });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return jsonOut_({ ok: false, reason: 'exception', detail: String(err) });
  }
}

function buildNewRow_(payload, id, seq, status, answers, emailed) {
  var now = new Date();
  return COLUMNS.map(function (c) {
    switch (c) {
      case 'updated_at': return now;
      case 'created_at': return now;
      case 'intake_id': return id;
      case 'last_seq': return seq;
      case 'status': return status;
      case 'follow_up_status': return status === 'follow_up_requested' ? 'requested' : '';
      case 'consent': return true;
      case 'source': return sanitize_(payload.source || '');
      case 'step': return Number(payload.step) || 1;
      case 'emailed': return emailed ? now : '';
      default: return answers[c] != null ? sanitize_(answers[c]) : '';
    }
  });
}

// Neutralise spreadsheet formula injection + cap length.
function sanitize_(v) {
  var s = String(v);
  if (s.length > 5000) s = s.slice(0, 5000);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Run once from the editor to (re)create the tab + header row. */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  sheet.clear();
  sheet.appendRow(COLUMNS);
  sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  sheet.setFrozenRows(1);
  // Reinforce injection safety: force the user-text columns to plain-text format.
  var start = col_('source') + 1;
  sheet.getRange(2, start, sheet.getMaxRows() - 1, COLUMNS.length - start + 1).setNumberFormat('@');
  return 'Intakes sheet ready with ' + COLUMNS.length + ' columns.';
}
