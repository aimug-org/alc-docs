// Progressive enhancement for the /speak/ forms. Without JS each form posts as one plain HTML form.
// With it: a stepper when the form has more than one fieldset[data-step], per-step checks reported in an
// aria-live region, the guardian field only for minors, ?talk=<slug> preselecting a talk, and a fetch submit.
const form = document.querySelector('form[data-speak]');
if (form) {
  const stepsEl = document.getElementById('speak-steps');
  const status = document.getElementById('speak-status');
  const done = document.getElementById('speak-done');
  const sets = [...form.querySelectorAll('fieldset[data-step]')];
  const dots = stepsEl ? [...stepsEl.querySelectorAll('[data-dot]')] : [];
  const back = form.querySelector('[data-back]');
  const next = form.querySelector('[data-next]');
  const send = form.querySelector('[data-send]');
  const minor = document.getElementById('sp-minor');
  const guardian = document.getElementById('sp-guardian');
  const guardianName = document.getElementById('sp-guardian-name');
  let step = 0;

  form.noValidate = true;
  form.elements.t.value = String(Date.now());
  if (stepsEl) stepsEl.hidden = false;
  document.getElementById('sp-today').textContent = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const talk = form.elements.talk;
  const wanted = new URLSearchParams(location.search).get('talk');
  if (talk && wanted && [...talk.options].some((o) => o.value === wanted)) talk.value = wanted;

  const syncMinor = () => { guardian.hidden = !minor.checked; guardianName.required = minor.checked; };
  minor.addEventListener('change', syncMinor);
  syncMinor();

  const show = (n, focus) => {
    step = n;
    sets.forEach((s, i) => { s.hidden = i !== n; });
    dots.forEach((d, i) => {
      if (i === n) d.setAttribute('aria-current', 'step'); else d.removeAttribute('aria-current');
      d.toggleAttribute('data-done', i < n);
    });
    if (back) back.hidden = n === 0;
    if (next) next.hidden = n === sets.length - 1;
    send.hidden = n !== sets.length - 1;
    if (focus) sets[n].querySelector('input, textarea, select').focus();
  };
  const invalidIn = (n) => [...sets[n].elements].find((el) => el.willValidate && !el.checkValidity());
  const report = (el) => {
    const name = (el.labels && el.labels[0] ? el.labels[0].textContent : el.name).trim();
    status.textContent = name + ': ' + el.validationMessage;
    el.focus();
  };

  if (next) next.addEventListener('click', () => {
    const bad = invalidIn(step);
    if (bad) return report(bad);
    status.textContent = '';
    show(step + 1, true);
  });
  if (back) back.addEventListener('click', () => { status.textContent = ''; show(step - 1, true); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    for (let i = 0; i < sets.length; i++) {
      const bad = invalidIn(i);
      if (bad) { show(i); return report(bad); }
    }
    send.disabled = true;
    status.textContent = 'Sending...';
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong (' + res.status + '). Please try again.');
      done.querySelector('[data-email]').textContent = form.elements.email.value;
      done.querySelector('[data-id]').textContent = data.id || '';
      form.hidden = true;
      if (stepsEl) stepsEl.hidden = true;
      done.hidden = false;
      done.focus();
    } catch (err) {
      status.textContent = err instanceof TypeError ? 'Could not reach the server. Check your connection and try again.' : err.message;
    } finally {
      send.disabled = false;
    }
  });

  show(0);
}
