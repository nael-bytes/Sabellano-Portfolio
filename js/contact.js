document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formMessage');
  const submit = document.getElementById('submitButton');
  if (!form || !status || !submit) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.style.display = 'block';
    status.className = 'alert mt-3 alert-info';
    status.textContent = 'Sending...';
    submit.disabled = true;

    const payload = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      subject: document.getElementById('subject').value.trim(),
      message: document.getElementById('message').value.trim()
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const ok = res.ok;
      const data = await res.json().catch(() => ({}));
      if (!ok) throw new Error(data.error || 'Sorry, there was a problem sending your message.');
      status.className = 'alert mt-3 alert-success';
      status.textContent = 'Message sent! I will get back to you soon.';
      form.reset();
    } catch (err) {
      status.className = 'alert mt-3 alert-danger';
      status.textContent = err.message || 'Sorry, there was a problem sending your message.';
    } finally {
      submit.disabled = false;
    }
  });
});


