const header = document.querySelector("[data-header]");

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

const reveals = document.querySelectorAll(".reveal");

reveals.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  reveals.forEach((element) => observer.observe(element));
} else {
  reveals.forEach((element) => element.classList.add("is-visible"));
}

document.querySelectorAll("[data-accordion]").forEach((accordion) => {
  accordion.addEventListener("toggle", (event) => {
    const activeItem = event.target;

    if (!(activeItem instanceof HTMLDetailsElement) || !activeItem.open) {
      return;
    }

    accordion.querySelectorAll("details").forEach((item) => {
      if (item !== activeItem) {
        item.removeAttribute("open");
      }
    });
  }, true);
});

const buildVimeoUrl = (source) => {
  const url = new URL(source);
  const params = {
    autoplay: "1",
    byline: "0",
    dnt: "1",
    muted: "1",
    playsinline: "1",
    portrait: "0",
    title: "0",
  };

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  return url.toString();
};

const loadReel = (frame) => {
  if (frame.vimeoPlayer || frame.classList.contains("is-loading")) {
    return frame.vimeoPlayer;
  }

  const source = frame.dataset.videoSrc;
  const title = frame.dataset.videoTitle || "Peak Automations reel";

  if (!source) {
    return null;
  }

  frame.classList.add("is-loading");

  const iframe = document.createElement("iframe");
  iframe.src = buildVimeoUrl(source);
  iframe.title = title;
  iframe.loading = "lazy";
  iframe.allow = "autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";

  frame.append(iframe);
  frame.classList.add("is-loaded");

  if (window.Vimeo?.Player) {
    frame.vimeoPlayer = new window.Vimeo.Player(iframe);
    frame.vimeoPlayer.ready().then(() => {
      frame.vimeoPlayer.setMuted(true);
      frame.vimeoPlayer.play().catch(() => {});
    });
  }

  return frame.vimeoPlayer;
};

const playReel = (frame) => {
  const player = loadReel(frame);
  player?.play?.().catch(() => {});
};

const pauseReel = (frame) => {
  frame.vimeoPlayer?.pause?.().catch(() => {});
};

document.querySelectorAll(".reel-frame[data-video-src]").forEach((frame) => {
  const button = frame.querySelector(".reel-cover");

  button?.addEventListener("click", () => {
    playReel(frame);
  });
});

if ("IntersectionObserver" in window) {
  const reelObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const frame = entry.target;

        if (entry.isIntersecting) {
          playReel(frame);
        } else {
          pauseReel(frame);
        }
      });
    },
    {
      rootMargin: "-18% 0px -18% 0px",
      threshold: 0.42,
    }
  );

  document.querySelectorAll(".reel-frame[data-video-src]").forEach((frame) => {
    reelObserver.observe(frame);
  });
}

const stickyCta = document.querySelector(".sticky-cta");

if (stickyCta && "IntersectionObserver" in window) {
  const heroSection = document.querySelector(".hero");
  const bookingSection = document.querySelector("#plan");
  const hideZones = [heroSection, bookingSection].filter(Boolean);

  if (hideZones.length) {
    const visibleInZones = new WeakSet();

    const stickyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleInZones.add(entry.target);
          } else {
            visibleInZones.delete(entry.target);
          }
        });

        const shouldHide = hideZones.some((zone) => visibleInZones.has(zone));
        stickyCta.classList.toggle("is-hidden", shouldHide);
      },
      { threshold: 0.2 }
    );

    hideZones.forEach((zone) => stickyObserver.observe(zone));
  }
}

/* =========================================================
   Intake flow: modal, stepped questions, progressive save
   ========================================================= */
(() => {
  const overlay = document.getElementById("intake");
  const form = document.getElementById("intake-form");
  if (!overlay || !form) return;

  // ---- Config ----
  const SAVE_ENDPOINT = "/.netlify/functions/intake"; // secure proxy → Google Sheets
  const CALENDLY_URL = "https://calendly.com/maxim-peak-automations/30min"; // change the Calendly link here
  const STORAGE_KEY = "peak_intake_v1";
  const CONTACT_EMAIL = "maxim@peak-automations.com";
  // Answer fields collected from the form (honeypot + consent handled separately)
  const ANSWER_FIELDS = [
    "name", "email", "phone", "company", "website", "role", "business",
    "team_size", "time_loss", "tools", "ai_experience", "timeline", "budget", "source",
  ];

  // ---- Copy, per language ----
  // One script serves index.html (en) and index-nl.html (nl); the page declares which
  // through <html lang>. Only the messages the script writes at runtime live here, the
  // rest of the copy sits in the HTML. Note that the radio VALUES stay English in both
  // pages on purpose, so the Google Sheets history keeps one vocabulary.
  const COPY = {
    en: {
      saveFailed: "Couldn't save that step. It's fine, you can keep going.",
      consent: "Please tick the consent box so I can follow up.",
      required: "This field is needed to continue.",
      badEmail: "That email doesn't look right.",
      pickOne: "Please pick one to continue.",
      step: (n, of) => `Step ${n} of ${of}`,
      send: "Send intake",
      sending: "Sending...",
      next: "Next",
      unconfirmed: (mail) =>
        `I couldn't fully confirm your submission. You can still book below, or email me at <a href="mailto:${mail}">${mail}</a>.`,
      followUp: "Got it. I'll reach out to you personally. Talk soon.",
      starterName: "Please add your name to continue.",
      starterEmail: "Please add a valid email to continue.",
    },
    nl: {
      saveFailed: "Die stap kon ik niet bewaren. Geen probleem, je kan gewoon verder.",
      consent: "Vink het toestemmingsvakje aan zodat ik kan opvolgen.",
      required: "Dit veld is nodig om verder te gaan.",
      badEmail: "Dat e-mailadres klopt niet helemaal.",
      pickOne: "Kies er één om verder te gaan.",
      step: (n, of) => `Stap ${n} van ${of}`,
      send: "Intake versturen",
      sending: "Versturen...",
      next: "Volgende",
      unconfirmed: (mail) =>
        `Ik kon je verzending niet volledig bevestigen. Je kan hieronder nog altijd boeken, of me mailen op <a href="mailto:${mail}">${mail}</a>.`,
      followUp: "Genoteerd. Ik neem zelf contact op. Tot binnenkort.",
      starterName: "Vul je naam in om verder te gaan.",
      starterEmail: "Vul een geldig e-mailadres in om verder te gaan.",
    },
  };
  const t = COPY[(document.documentElement.lang || "en").slice(0, 2)] || COPY.en;

  // ---- Elements ----
  const steps = Array.from(overlay.querySelectorAll(".intake-step"));
  const total = steps.length;
  const progressFill = document.getElementById("intake-progress-fill");
  const progressLabel = document.getElementById("intake-progress-label");
  const errorEl = document.getElementById("intake-error");
  const statusEl = form.querySelector(".form-status");
  const prevBtn = document.getElementById("intake-prev");
  const nextBtn = document.getElementById("intake-next");
  const endScreen = document.getElementById("intake-end");
  const bookBtn = document.getElementById("intake-book");
  const followupBtn = document.getElementById("intake-followup");
  const endNote = document.getElementById("intake-end-note");
  const honeypot = form.querySelector('input[name="company_website"]');

  // ---- State ----
  let current = 0;
  let lastFocused = null;
  const store = loadStore();

  // ---- Persistence ----
  function loadStore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) { /* private mode / blocked → in-memory only */ }
    return { intake_id: null, seq: 0, step: 0, status: "", answers: {}, completed: false };
  }
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (e) { /* ignore */ }
  }
  function resetStore() {
    Object.assign(store, { intake_id: null, seq: 0, step: 0, status: "", answers: {}, completed: false });
    persist();
  }

  // ---- IDs + sequence ----
  function makeId() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    // RFC4122-ish fallback for old browsers / non-secure contexts
    const b = new Uint8Array(16);
    (window.crypto || {}).getRandomValues ? crypto.getRandomValues(b) : b.forEach((_, i) => (b[i] = Math.floor(Math.random() * 256)));
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = [...b].map((x) => x.toString(16).padStart(2, "0"));
    return `${h[0]}${h[1]}${h[2]}${h[3]}-${h[4]}${h[5]}-${h[6]}${h[7]}-${h[8]}${h[9]}-${h[10]}${h[11]}${h[12]}${h[13]}${h[14]}${h[15]}`;
  }
  function intakeId() {
    if (!store.intake_id) { store.intake_id = makeId(); persist(); }
    return store.intake_id;
  }
  function nextSeq() {
    store.seq = Math.max((store.seq || 0) + 1, Date.now());
    persist();
    return store.seq;
  }

  // ---- Answer collection / prefill ----
  function collectAnswers() {
    const answers = {};
    ANSWER_FIELDS.forEach((name) => {
      const field = form.elements[name];
      if (!field) return;
      const value = (field.value || "").trim();
      if (value) answers[name] = value;
    });
    return answers;
  }
  function prefill() {
    const a = store.answers || {};
    ANSWER_FIELDS.forEach((name) => {
      const field = form.elements[name];
      if (!field || a[name] == null) return;
      if (field instanceof RadioNodeList || (field.length && field[0] && field[0].type === "radio")) {
        Array.from(field).forEach((r) => { r.checked = r.value === a[name]; });
      } else if (field.type !== "checkbox") {
        field.value = a[name];
      }
    });
  }
  function referrerHost() {
    try { return document.referrer ? new URL(document.referrer).hostname : ""; } catch (e) { return ""; }
  }

  // ---- Save (single-flight, coalescing) ----
  let inFlight = false;
  let pending = null;

  function buildPayload(status) {
    const consent = !!(form.elements["consent"] && form.elements["consent"].checked);
    const answers = consent ? collectAnswers() : {}; // never send PII before consent
    store.answers = answers;
    store.status = status;
    store.step = current + 1;
    persist();
    return {
      intake_id: intakeId(),
      seq: nextSeq(),
      step: current + 1,
      status,
      consent,
      answers,
      source: answers.source || referrerHost() || "direct",
      hp: honeypot ? honeypot.value : "",
      meta: { page: location.pathname },
    };
  }

  async function postSave(payload) {
    // NOTE: no `keepalive: true` here. keepalive is for page-unload beacons; in some
    // browsers (Safari/WebKit) the response body of a keepalive fetch is unreliable to
    // read, which made the final save look failed even though it succeeded server-side.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(SAVE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const data = await res.json().catch(() => ({}));
      return { ok: res.ok && data.ok === true };
    } catch (e) {
      return { ok: false };
    } finally {
      clearTimeout(timer);
    }
  }

  function queueDraftSave() {
    const payload = buildPayload("draft");
    if (inFlight) { pending = payload; return; }
    runDraft(payload);
  }
  async function runDraft(payload) {
    inFlight = true;
    const { ok } = await postSave(payload);
    if (!ok) setStatus(t.saveFailed, "error");
    else clearStatus();
    inFlight = false;
    if (pending) { const p = pending; pending = null; runDraft(p); }
  }

  // ---- Status + error helpers ----
  function setStatus(message, state) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.hidden = false;
    statusEl.dataset.state = state;
  }
  function clearStatus() { if (statusEl) statusEl.hidden = true; }
  function showError(message) { if (errorEl) { errorEl.textContent = message; errorEl.hidden = false; } }
  function clearError() { if (errorEl) errorEl.hidden = true; }

  // ---- Validation ----
  function validateStep(stepEl) {
    clearError();
    stepEl.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));

    // consent checkbox
    const consent = stepEl.querySelector('input[name="consent"]');
    if (consent && !consent.checked) { showError(t.consent); return false; }

    // required text / email inputs + textareas
    const fields = stepEl.querySelectorAll("input[required], textarea[required]");
    for (const field of fields) {
      if (field.type === "checkbox") continue;
      if (!field.value.trim()) { field.classList.add("is-invalid"); field.focus(); showError(t.required); return false; }
      if (field.type === "email" && !field.checkValidity()) { field.classList.add("is-invalid"); field.focus(); showError(t.badEmail); return false; }
    }

    // required single-choice group
    const group = stepEl.querySelector(".intake-options[data-required]");
    if (group) {
      const name = group.querySelector("input[type=radio]")?.name;
      if (name && !form.elements[name].value) { showError(t.pickOne); return false; }
    }
    return true;
  }

  // ---- Step rendering ----
  function render() {
    steps.forEach((s, i) => { s.hidden = i !== current; });
    if (progressFill) progressFill.style.width = `${((current + 1) / total) * 100}%`;
    if (progressLabel) progressLabel.textContent = t.step(current + 1, total);
    prevBtn.hidden = current === 0;
    nextBtn.textContent = current === total - 1 ? t.send : t.next;
    clearError();
    const firstField = steps[current].querySelector("input, textarea, select");
    window.requestAnimationFrame(() => firstField && firstField.focus());
  }

  function goTo(index) { current = Math.max(0, Math.min(total - 1, index)); render(); }

  async function handleNext() {
    if (honeypot && honeypot.value) return; // bot
    if (!validateStep(steps[current])) return;

    if (current < total - 1) {
      queueDraftSave();        // background, non-blocking
      goTo(current + 1);
      return;
    }

    // Final step: block until the complete intake is confirmed saved
    nextBtn.disabled = true;
    nextBtn.textContent = t.sending;
    setStatus("", "ok");
    clearStatus();

    let result = await postSave(buildPayload("new"));
    if (!result.ok) result = await postSave(buildPayload("new")); // one retry

    nextBtn.disabled = false;
    nextBtn.textContent = t.send;

    if (result.ok) {
      store.completed = true; persist();
      showEnd(true);
    } else {
      // Don't hard-block booking; let them through with a flagged fallback
      showEnd(false);
    }
  }

  // ---- End screen + Calendly ----
  function showEnd(confirmed) {
    form.hidden = true;
    document.getElementById("intake-progress").hidden = true;
    endScreen.hidden = false;
    if (!confirmed && endNote) {
      endNote.innerHTML = t.unconfirmed(CONTACT_EMAIL);
      endNote.hidden = false;
    }
    window.requestAnimationFrame(() => bookBtn && bookBtn.focus());
  }

  function calendlyUrl() {
    const a = store.answers || {};
    const url = new URL(CALENDLY_URL);
    if (a.name) url.searchParams.set("name", a.name);
    if (a.email) url.searchParams.set("email", a.email);
    return url.toString();
  }

  bookBtn?.addEventListener("click", () => {
    current = total - 1;
    postSave(buildPayload("calendly_opened")); // fire-and-forget status update
    window.open(calendlyUrl(), "_blank", "noopener");
  });

  followupBtn?.addEventListener("click", () => {
    current = total - 1;
    postSave(buildPayload("follow_up_requested"));
    endScreen.querySelector(".intake-end-actions").hidden = true;
    if (endNote) {
      endNote.textContent = t.followUp;
      endNote.hidden = false;
    }
  });

  // ---- Open / close ----
  function open() {
    lastFocused = document.activeElement;
    // Fresh start after a completed intake; otherwise resume the draft
    if (store.completed) resetStore();
    prefill();
    form.hidden = false;
    document.getElementById("intake-progress").hidden = false;
    endScreen.hidden = true;
    const resumeAt = store.status && store.status !== "" ? Math.min((store.step || 1) - 1, total - 1) : 0;
    goTo(store.intake_id ? resumeAt : 0);
    overlay.hidden = false;
    document.body.classList.add("intake-open");
    dismissNudge();
  }
  function close() {
    overlay.hidden = true;
    document.body.classList.remove("intake-open");
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  // Focus trap
  overlay.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { close(); return; }
    if (event.key !== "Tab") return;
    const focusables = overlay.querySelectorAll('button:not([hidden]), a[href], input:not([type=hidden]), textarea, select, [tabindex]:not([tabindex="-1"])');
    const visible = Array.from(focusables).filter((el) => el.offsetParent !== null);
    if (!visible.length) return;
    const first = visible[0];
    const last = visible[visible.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  document.querySelectorAll("[data-open-intake]").forEach((trigger) => {
    trigger.addEventListener("click", (event) => { event.preventDefault(); open(); });
  });

  // Inline starter form (#contact): capture the basics, then open the modal prefilled.
  const starter = document.getElementById("intake-starter");
  if (starter) {
    const starterStatus = starter.querySelector(".form-status");
    const setStarterStatus = (msg, state) => {
      if (!starterStatus) return;
      starterStatus.textContent = msg;
      starterStatus.hidden = false;
      starterStatus.dataset.state = state;
    };
    starter.addEventListener("submit", (event) => {
      event.preventDefault();
      const nameField = starter.elements["name"];
      const emailField = starter.elements["email"];
      const name = (nameField.value || "").trim();
      if (!name) { setStarterStatus(t.starterName, "error"); nameField.focus(); return; }
      if (!emailField.value.trim() || !emailField.checkValidity()) {
        setStarterStatus(t.starterEmail, "error"); emailField.focus(); return;
      }
      if (starterStatus) starterStatus.hidden = true;

      // Start fresh if a previous intake was completed, then seed the early answers.
      if (store.completed) resetStore();
      const merged = Object.assign({}, store.answers || {});
      ["name", "email", "company", "time_loss"].forEach((f) => {
        const field = starter.elements[f];
        const v = field ? (field.value || "").trim() : "";
        if (v) merged[f] = v;
      });
      store.answers = merged;
      persist();
      open(); // open() prefills from store.answers and lands on step 1 (consent)
    });
  }

  overlay.querySelector(".intake-close")?.addEventListener("click", close);
  overlay.addEventListener("click", (event) => { if (event.target === overlay) close(); });
  nextBtn.addEventListener("click", handleNext);
  prevBtn.addEventListener("click", () => goTo(current - 1));
  form.addEventListener("submit", (event) => { event.preventDefault(); handleNext(); });
  form.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") { event.preventDefault(); handleNext(); }
  });

  // ---- Bottom-right nudge ----
  const nudge = document.getElementById("intake-nudge");
  function dismissNudge() {
    if (!nudge) return;
    nudge.hidden = true;
    try { sessionStorage.setItem("intakeNudgeDismissed", "1"); } catch (e) { /* ignore */ }
  }
  if (nudge) {
    let dismissed = false;
    try { dismissed = sessionStorage.getItem("intakeNudgeDismissed") === "1"; } catch (e) { /* ignore */ }
    nudge.querySelector(".intake-nudge-close")?.addEventListener("click", dismissNudge);
    if (!dismissed) {
      const showNudge = () => {
        if (!overlay.hidden) return;
        nudge.hidden = false;
        nudge.classList.add("is-visible");
        window.removeEventListener("scroll", onScroll);
      };
      const onScroll = () => { if (window.scrollY > window.innerHeight * 0.6) showNudge(); };
      window.addEventListener("scroll", onScroll, { passive: true });
      window.setTimeout(showNudge, 12000);
    }
  }
})();

/* Mobile hamburger menu */
(() => {
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;
  const closeBtn = document.getElementById("mobile-menu-close");

  const openMenu = () => {
    menu.hidden = false;
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
  };
  const closeMenu = () => {
    menu.hidden = true;
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => { menu.hidden ? openMenu() : closeMenu(); });
  closeBtn?.addEventListener("click", closeMenu);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !menu.hidden) closeMenu();
  });

  // Close the menu when any link or the CTA is tapped (the CTA also opens the intake).
  menu.querySelectorAll("[data-menu-link], [data-open-intake]").forEach((el) => {
    el.addEventListener("click", closeMenu);
  });
})();

/* active anchor-nav highlight */
const navLinks = Array.from(document.querySelectorAll('.site-header nav a[href^="#"]'));
const linkBySection = new Map();
navLinks.forEach((a) => {
  const id = a.getAttribute("href").slice(1);
  const el = id && document.getElementById(id);
  if (el && !a.classList.contains("nav-cta")) linkBySection.set(el, a);
});

if ("IntersectionObserver" in window && linkBySection.size) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) => l.classList.remove("is-active"));
        const link = linkBySection.get(entry.target);
        if (link) link.classList.add("is-active");
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  linkBySection.forEach((_, el) => navObserver.observe(el));
}
