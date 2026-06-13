const axios = require('axios');

const BREVO_API_KEY = process.env.BREVO_API_KEY || process.env.SENDINBLUE_API_KEY || process.env.BREVO_KEY;
const SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || process.env.ZOHO_EMAIL_USER || 'info@tofarcargo.com';
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

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const invalidEmails = recipients.filter(email => !emailRegex.test(email));
  
  if (invalidEmails.length > 0) {
    console.error(`[EMAIL ERROR] Invalid email format(s): ${invalidEmails.join(', ')}`);
    const error = new Error(`Invalid email format(s): ${invalidEmails.join(', ')}`);
    error.code = 'INVALID_EMAIL_FORMAT';
    throw error;
  }

  if (recipients.length === 0) {
    console.error('[EMAIL ERROR] No valid recipients provided');
    const error = new Error('No valid recipients provided');
    error.code = 'NO_RECIPIENTS';
    throw error;
  }

  console.log(`[EMAIL] Sending email to: ${recipients.join(', ')} | Subject: ${subject}`);

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

    try {
      const resp = await axios.post(url, payload, config);
      console.log(`[EMAIL SUCCESS] Email sent to ${recipients.join(', ')}`);
      return resp.data;
    } catch (err) {
      console.error(`[EMAIL FAILED] Error sending email to ${recipients.join(', ')}:`, err.message);
      // Enhance error with Brevo response body when available
      if (err.response && err.response.data) {
        const e = new Error(`Brevo API error: ${JSON.stringify(err.response.data)}`);
        e.code = err.code || 'BREVO_ERROR';
        e.response = err.response.data;
        throw e;
      }
      throw err;
    }
  };

  module.exports = sendMail;
