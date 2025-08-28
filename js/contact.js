document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formMessage');
  const submit = document.getElementById('submitButton');
  if (!form || !status || !submit) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    status.style.display = 'block';
    status.className = 'alert mt-3 alert-info';
    status.textContent = 'Sending your message...';
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
      
      const data = await res.json();
      
      if (!res.ok) {
        // Handle specific error statuses
        if (res.status === 401) {
          throw new Error('Email service authentication failed. Please contact the administrator.');
        } else if (res.status === 400) {
          throw new Error(data.message || 'Please check your input and try again.');
        } else if (res.status === 500) {
          throw new Error(data.message || 'Server error. Please try again later.');
        } else {
          throw new Error(data.message || 'Sorry, there was a problem sending your message.');
        }
      }
      
      // Success!
      status.className = 'alert mt-3 alert-success';
      status.textContent = data.message || 'Message sent successfully! I will get back to you soon.';
      form.reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        status.style.display = 'none';
      }, 5000);
      
    } catch (err) {
      console.error('Contact form error:', err);
      status.className = 'alert mt-3 alert-danger';
      status.textContent = err.message || 'Sorry, there was a problem sending your message.';
      
      // Hide error message after 8 seconds
      setTimeout(() => {
        status.style.display = 'none';
      }, 8000);
    } finally {
      submit.disabled = false;
    }
  });
});


