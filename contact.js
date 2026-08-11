/* ==========================================================================
   Contact form — inline validation + FormSubmit AJAX, with a mailto fallback.
   ========================================================================== */
(() => {
  'use strict';

  const form = document.getElementById('contactForm');
  const formMsg = document.getElementById('formMsg');
  if (!form || !formMsg) return;

  const ENDPOINT = 'https://formsubmit.co/ajax/roshnistephen4@gmail.com';
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const fields = {
    name: {
      el: form.elements.name,
      validate: (v) => (v.length >= 2 ? '' : 'Please enter your name.')
    },
    email: {
      el: form.elements.email,
      validate: (v) => (EMAIL_RE.test(v) ? '' : 'Please enter a valid email address.')
    },
    message: {
      el: form.elements.message,
      validate: (v) => (v.length >= 10 ? '' : 'Please tell me a little more (10+ characters).')
    }
  };

  let msgTimer = null;

  const showMessage = (text, type) => {
    clearTimeout(msgTimer);
    formMsg.textContent = text;
    formMsg.className = `form__msg is-visible ${type === 'error' ? 'is-err' : 'is-ok'}`;
    msgTimer = setTimeout(() => { formMsg.className = 'form__msg'; }, 8000);
  };

  const setFieldError = (key, error) => {
    const { el } = fields[key];
    const wrap = el.closest('.field');
    const note = form.querySelector(`[data-error-for="${key}"]`);

    if (wrap) wrap.classList.toggle('has-error', Boolean(error));
    el.setAttribute('aria-invalid', error ? 'true' : 'false');
    if (note) note.textContent = error;
  };

  const validateField = (key) => {
    const error = fields[key].validate(fields[key].el.value.trim());
    setFieldError(key, error);
    return !error;
  };

  // Validate on blur, then live-clear the error once the user fixes it.
  Object.keys(fields).forEach((key) => {
    const { el } = fields[key];
    el.addEventListener('blur', () => validateField(key));
    el.addEventListener('input', () => {
      if (el.closest('.field')?.classList.contains('has-error')) validateField(key);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const keys = Object.keys(fields);
    const valid = keys.map(validateField).every(Boolean);

    if (!valid) {
      const firstBad = keys.find((k) => fields[k].el.getAttribute('aria-invalid') === 'true');
      if (firstBad) fields[firstBad].el.focus();
      showMessage('Please fix the highlighted fields.', 'error');
      return;
    }

    const name = fields.name.el.value.trim();
    const email = fields.email.el.value.trim();
    const message = fields.message.el.value.trim();

    const submitBtn = form.querySelector('button[type="submit"]');
    const label = submitBtn?.querySelector('.btn__label');
    const originalLabel = label?.textContent ?? '';

    submitBtn?.setAttribute('aria-busy', 'true');
    submitBtn.disabled = true;
    if (label) label.textContent = 'Sending…';

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: `Portfolio enquiry from ${name}`
        })
      });

      if (!response.ok) throw new Error(`Request failed with status ${response.status}`);

      showMessage("Thank you! Your message is on its way — I'll reply soon. 🎉", 'success');
      form.reset();
      Object.keys(fields).forEach((key) => setFieldError(key, ''));
    } catch (error) {
      // Network or service failure: hand the message off to the user's mail client.
      const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
      const body = encodeURIComponent(`${message}\n\n---\nFrom: ${name}\nEmail: ${email}`);
      showMessage("Couldn't reach the mail service — opening your email app instead.", 'error');
      window.location.href = `mailto:roshnistephen4@gmail.com?subject=${subject}&body=${body}`;
    } finally {
      submitBtn?.removeAttribute('aria-busy');
      submitBtn.disabled = false;
      if (label) label.textContent = originalLabel;
    }
  });
})();
