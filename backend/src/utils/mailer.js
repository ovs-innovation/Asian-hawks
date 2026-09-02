import nodemailer from "nodemailer";

const smtpUser = process.env.SMTP_USER || "rs0043071@gmail.com";
const smtpPass = (process.env.SMTP_PASS || "qvso zivl bsyj rcoc").replace(/\s+/g, "");

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export async function sendOtpEmail(toEmail, otpCode, userName = "User") {
  const mailOptions = {
    from: `"Asian Hawks Manpower" <${smtpUser}>`,
    to: toEmail,
    subject: `Your Login OTP Code - ${otpCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0f5daa; margin: 0; font-size: 24px; font-weight: 800;">Asian Hawks Manpower</h2>
          <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Search &amp; Apply to Jobs across India</p>
        </div>
        <div style="padding: 24px; background-color: #f8fafc; border-radius: 12px; border: 1px solid #cbd5e1; text-align: center;">
          <p style="color: #334155; font-size: 14px; margin-bottom: 12px;">Hello <strong>${userName}</strong>,</p>
          <p style="color: #475569; font-size: 14px; margin-bottom: 16px;">Use the 6-digit OTP code below to log into your Asian Hawks account. This code is valid for 10 minutes.</p>
          <div style="background: #0f5daa; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: 6px; padding: 14px 28px; border-radius: 10px; display: inline-block; margin: 8px 0 16px;">
            ${otpCode}
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 12px;">If you did not request this OTP code, please ignore this email.</p>
        </div>
        <div style="text-align: center; margin-top: 24px; font-size: 11px; color: #94a3b8;">
          &copy; ${new Date().getFullYear()} Asian Hawks Manpower Services Pvt Ltd. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[MAIL] OTP email sent to ${toEmail}: ${info.messageId}`);
    return { ok: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[MAIL ERROR] Failed to send OTP email to ${toEmail}:`, err);
    throw err;
  }
}
