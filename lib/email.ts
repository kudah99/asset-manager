import nodemailer from "nodemailer";

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  // Check if email is configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPassword) {
    console.warn("⚠️  Email not configured. SMTP settings missing. Email will not be sent.");
    return { success: false, error: "Email not configured" };
  }

  try {
    // Create transporter for Gmail SMTP
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    // Send email
    const info = await transporter.sendMail({
      from: `"Asset Manager" <${smtpFrom}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function createUserCredentialsEmail(email: string, password: string, loginUrl: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #20b2aa;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 5px 5px;
        }
        .credentials {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
          border-left: 4px solid #20b2aa;
        }
        .credential-item {
          margin: 10px 0;
        }
        .label {
          font-weight: bold;
          color: #666;
        }
        .value {
          font-family: monospace;
          background-color: #f5f5f5;
          padding: 5px 10px;
          border-radius: 3px;
          display: inline-block;
          margin-left: 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #20b2aa;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 30px;
        }
        .warning {
          background-color: #fff3cd;
          border: 1px solid #ffc107;
          padding: 15px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to Asset Manager</h1>
      </div>
      <div class="content">
        <p>Hello,</p>
        <p>Your account has been created successfully. Below are your login credentials:</p>
        
        <div class="credentials">
          <div class="credential-item">
            <span class="label">Email:</span>
            <span class="value">${email}</span>
          </div>
          <div class="credential-item">
            <span class="label">Password:</span>
            <span class="value">${password}</span>
          </div>
        </div>

        <div class="warning">
          <strong>⚠️ Security Notice:</strong> Please change your password after your first login for security purposes.
        </div>

        <p>You can now login to the Asset Manager system:</p>
        <a href="${loginUrl}" class="button">Login to Asset Manager</a>

        <p>If you have any questions or need assistance, please contact your administrator.</p>
      </div>
      <div class="footer">
        <p>This is an automated message from Asset Manager. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;

  return html;
}

