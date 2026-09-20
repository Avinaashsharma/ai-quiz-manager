const { BrevoClient } = require('@getbrevo/brevo');

/**
 * Send OTP email via Brevo v6 transactional email API.
 * No SMTP — uses HTTPS API, works on Render free tier.
 *
 * Required env: BREVO_API_KEY, BREVO_SENDER_EMAIL, BREVO_SENDER_NAME
 */
const sendOtpEmail = async (toEmail, toName, otp) => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured');
  }

  const senderEmail = process.env.BREVO_SENDER_EMAIL || 'noreply@quizmanager.com';
  const senderName = process.env.BREVO_SENDER_NAME || 'AI Quiz Manager';

  const brevo = new BrevoClient({ apiKey });

  try {
    await brevo.transactionalEmails.sendTransacEmail({
      subject: `Your Verification Code: ${otp}`,
      sender: { name: senderName, email: senderEmail },
      to: [{ email: toEmail, name: toName || toEmail }],
      htmlContent: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #1e1b4b; border-radius: 16px; color: #ffffff;">
          <h1 style="text-align: center; font-size: 24px; margin-bottom: 8px;">AI Quiz Manager</h1>
          <p style="text-align: center; color: #a78bfa; font-size: 14px; margin-bottom: 24px;">Email Verification</p>
          <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="color: #c4b5fd; font-size: 14px; margin-bottom: 12px;">Your verification code is:</p>
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #a78bfa; font-family: monospace;">${otp}</div>
          </div>
          <p style="text-align: center; color: #94a3b8; font-size: 12px;">This code expires in <strong>10 minutes</strong>.</p>
          <p style="text-align: center; color: #94a3b8; font-size: 12px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    });
    console.log(`[Email] OTP sent to ${toEmail}`);
  } catch (err) {
    console.error(`[Email] Failed to send OTP to ${toEmail}:`, err.message || err);
    throw new Error('Failed to send verification email. Please try again.');
  }
};

module.exports = { sendOtpEmail };
