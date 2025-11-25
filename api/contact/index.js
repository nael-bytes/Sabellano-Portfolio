const sgMail = require('@sendgrid/mail');

const SENDGRID_API_KEY = process.env.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 || '';
const TO_EMAIL = process.env.CONTACT_TO_EMAIL || 'tsabellano04@gmail.com';
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || 'tsabellano13@gmail.com';

if (SENDGRID_API_KEY) sgMail.setApiKey(SENDGRID_API_KEY);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if SendGrid is configured
    if (!SENDGRID_API_KEY) {
        console.error('SENDGRID_API_KEY not configured');
        return res.status(500).json({ 
            message: 'Email service not configured. Please contact the administrator.',
            error: 'SENDGRID_API_KEY not configured'
        });
    }

    const msg = {
        to: TO_EMAIL,
        from: FROM_EMAIL,
        subject: `Portfolio Contact: ${subject}`,
        replyTo: email, // Allow replies to go to the sender
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
        
        // Handle specific SendGrid errors
        if (error.response && error.response.body) {
            const sendgridError = error.response.body.errors?.[0];
            if (sendgridError) {
                if (sendgridError.message.includes('unauthorized')) {
                    return res.status(401).json({ 
                        message: 'Email service authentication failed. Please contact the administrator.',
                        error: 'SendGrid authentication failed'
                    });
                }
                if (sendgridError.message.includes('from address')) {
                    return res.status(400).json({ 
                        message: 'Email service configuration error. Please contact the administrator.',
                        error: 'From address not verified'
                    });
                }
            }
        }
        
        return res.status(500).json({ 
            message: 'Error sending email. Please try again later.',
            error: error.message
        });
    }
}
