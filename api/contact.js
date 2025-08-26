const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || '';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || TO_EMAIL;

if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  if (!SENDGRID_API_KEY) return res.status(500).json({ error: 'SENDGRID_API_KEY not configured' });
  if (!TO_EMAIL || !FROM_EMAIL) return res.status(500).json({ error: 'CONTACT_TO_EMAIL/CONTACT_FROM_EMAIL not configured' });

  const safe = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const html = `
    <div style="font-family:Inter,Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#111;">
      <h2>New Portfolio Contact</h2>
      <p><strong>Name:</strong> ${safe(name)}</p>
      <p><strong>Email:</strong> ${safe(email)}</p>
      <p><strong>Subject:</strong> ${safe(subject)}</p>
      <p><strong>Message:</strong><br/>${safe(message).replace(/\n/g,'<br/>')}</p>
    </div>`;

  const text = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`;

  const msg = {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    subject: `Portfolio Contact: ${subject}`,
    replyTo: email,
    text,
    html
  };

  try {
    await sgMail.send(msg);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('SendGrid error', error?.response?.body || error?.message || error);
    return res.status(500).json({ 
      error: 'Failed to send email',
      details: error?.response?.body || error?.message || error
    });
  }
};
