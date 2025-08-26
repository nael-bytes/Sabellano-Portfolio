const sgMail = require('@sendgrid/mail');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: 'tsabellano04@gmail.com', // Replace with your email
        from: 'tsabellano13@gmail.com', // Replace with your SendGrid verified sender
        subject: `Portfolio Contact: ${subject}`,
        text: `
Name: ${name}
Email: ${email}
Subject: ${subject}
Message: ${message}
        `,
        html: `
<strong>Name:</strong> ${name}<br>
<strong>Email:</strong> ${email}<br>
<strong>Subject:</strong> ${subject}<br>
<strong>Message:</strong><br>
${message}
        `
    };

    try {
        await sgMail.send(msg);
        return res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Error sending email' });
    }
}
