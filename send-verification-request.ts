import type { SendVerificationRequestParams } from "next-auth/providers/email";
import nodemailer from "nodemailer";

export async function sendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url } = params;

  // Transform the raw callback URL into the /verify URL used by the app
  // Example: https://dr.wnode.one/api/auth/callback/email?token=...
  // becomes: https://dr.wnode.one/verify?callbackUrl=...
  const verifyUrl = url.replace("/api/auth/callback/email", "/verify");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 465),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    to: identifier,
    from: process.env.SMTP_FROM,
    subject: "Sign in to Wnode Data Room",
    text: `Click the link below to sign in:\n\n${verifyUrl}\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <p>Click the button below to sign in:</p>
      <p><a href="${verifyUrl}" style="display:inline-block;padding:10px 16px;background:#000;color:#fff;text-decoration:none;border-radius:4px;">Sign in</a></p>
      <p>Or copy and paste this URL into your browser:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    `,
  });
}
