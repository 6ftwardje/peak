(() => {
  const form = document.getElementById('wf-form-Formulier');
  if (!form) return;

  const wrapper = form.closest('.w-form');
  const success = wrapper.querySelector('.w-form-done');
  const failure = wrapper.querySelector('.w-form-fail');
  const submit = form.querySelector('[type="submit"]');
  const visibleSubmit = form.querySelector('[ms-code-submit-new]');
  const submitLabel = submit.value;
  let pending = false;

  for (const [message, label] of [[success, 'Bericht verstuurd'], [failure, 'Bericht niet verstuurd']]) {
    message.setAttribute('tabindex', '-1');
    message.setAttribute('role', 'status');
    message.setAttribute('aria-label', label);
  }

  const requiredMessages = {
    Naam: 'Vul je naam in.',
    email: 'Vul je zakelijke e-mailadres in.',
    Context: 'Vertel ons waar je team tegenaan loopt.'
  };

  // Native validation messages follow the page language, even in an English browser.
  form.addEventListener('invalid', (event) => {
    const field = event.target;
    if (typeof field.setCustomValidity !== 'function') return;
    field.setCustomValidity('');
    if (field.validity.valueMissing) {
      field.setCustomValidity(requiredMessages[field.name] || 'Vul dit veld in.');
    } else if (field.type === 'email' && field.validity.typeMismatch) {
      field.setCustomValidity('Vul een geldig e-mailadres in, bijvoorbeeld naam@bedrijf.be.');
    }
  }, true);

  form.addEventListener('input', (event) => {
    event.target.setCustomValidity?.('');
  });

  visibleSubmit?.setAttribute('aria-label', submitLabel);

  // Keep the exported button design, with native browser field validation.
  // Capture before the external Slater click handler to avoid duplicate submits.
  form.addEventListener('click', (event) => {
    if (!event.target.closest('[ms-code-submit-new]')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!pending) form.requestSubmit(submit);
  }, true);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (pending || !form.reportValidity()) return;

    pending = true;
    failure.style.display = 'none';
    success.style.display = 'none';
    form.setAttribute('aria-busy', 'true');
    submit.disabled = true;
    submit.value = submit.getAttribute('data-wait') || 'Even geduld...';
    visibleSubmit?.setAttribute('aria-disabled', 'true');
    visibleSubmit?.setAttribute('aria-label', 'Je bericht wordt verstuurd');

    const body = new URLSearchParams(new FormData(form));
    body.set('form-name', form.getAttribute('name'));

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      if (!response.ok) throw new Error('Bericht versturen mislukt');

      form.style.display = 'none';
      success.style.display = 'block';
      success.focus();
    } catch {
      failure.style.display = 'block';
      failure.focus();
    } finally {
      pending = false;
      form.removeAttribute('aria-busy');
      submit.disabled = false;
      submit.value = submitLabel;
      visibleSubmit?.removeAttribute('aria-disabled');
      visibleSubmit?.setAttribute('aria-label', submitLabel);
    }
  }, true);
})();
