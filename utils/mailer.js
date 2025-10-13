const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || process.env.BREVO_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || process.env.ZOHO_EMAIL_USER || 'no-reply@yourdomain.com';
const SENDER_NAME = process.env.BREVO_SENDER_NAME || 'Tofar Logistics Agency';

if (!BREVO_API_KEY) {
  console.warn('BREVO_API_KEY not set. Emails will fail unless a valid key is provided in environment.');
}

/**
 * sendMail - send an email using Brevo (Sendinblue) transactional API
 * @param {string} to - recipient email or comma separated list
 * @param {string} subject - email subject
 * @param {string} html - html body
 */
const sendMail = async (to, subject, html) => {
  if (!BREVO_API_KEY) {
    throw new Error('BREVO_API_KEY not configured in environment');
  }

  const recipients = Array.isArray(to) ? to : String(to).split(',').map(s => s.trim()).filter(Boolean);

  const payload = {
    sender: { name: SENDER_NAME, email: SENDER_EMAIL },
    to: recipients.map(email => ({ email })),
    subject,
    htmlContent: html
  };

  const config = {
    headers: {
      'api-key': BREVO_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  const url = 'https://api.brevo.com/v3/smtp/email';

    const resp = await axios.post(url, payload, config);
    return resp.data;
  };

  module.exports = sendMail;
