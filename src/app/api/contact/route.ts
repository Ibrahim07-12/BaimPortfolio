import { NextResponse } from "next/server";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_TOTAL_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml", "application/pdf", "audio/webm", "audio/ogg", "audio/mp4"]);
const isAllowedType = (type: string) => ALLOWED_TYPES.has(type.split(";")[0].trim().toLowerCase());

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

export async function POST(request: Request) {
  const form = await request.formData();
  const captchaToken = String(form.get("captchaToken") ?? "");
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!secret || !resendKey) return jsonError("Contact delivery is not configured.", 503);
  if (!captchaToken) return jsonError("Please complete the reCAPTCHA first.");

  const captchaBody = new URLSearchParams({ secret, response: captchaToken });
  const captchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    body: captchaBody,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  const captchaResult = await captchaResponse.json() as { success?: boolean };
  if (!captchaResponse.ok || !captchaResult.success) return jsonError("reCAPTCHA verification failed.", 403);

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const subject = String(form.get("subject") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();
  if (!name || !email || !subject || !message) return jsonError("Please complete all required fields.");

  const attachments: { filename: string; content: string }[] = [];
  let totalSize = 0;
  for (const value of form.getAll("attachments")) {
    if (!(value instanceof File) || value.size === 0) continue;
    if (!isAllowedType(value.type)) return jsonError(`Unsupported attachment type: ${value.name}`);
    if (value.size > MAX_FILE_SIZE) return jsonError(`Attachment is too large: ${value.name}`);
    totalSize += value.size;
    if (totalSize > MAX_TOTAL_SIZE) return jsonError("The total attachment size is too large.");
    attachments.push({
      filename: value.name,
      content: Buffer.from(await value.arrayBuffer()).toString("base64"),
    });
  }

  const voiceNote = form.get("voiceNote");
  if (voiceNote instanceof File && voiceNote.size > 0) {
    if (!isAllowedType(voiceNote.type)) return jsonError("Unsupported voice note format.");
    if (voiceNote.size > MAX_FILE_SIZE || totalSize + voiceNote.size > MAX_TOTAL_SIZE) return jsonError("Voice note is too large.");
    attachments.push({
      filename: voiceNote.name || "voice-note.webm",
      content: Buffer.from(await voiceNote.arrayBuffer()).toString("base64"),
    });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: ["ibrahimusyaffa@gmail.com"],
      reply_to: email,
      subject: `[Portfolio] ${subject}`,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>`,
      attachments,
    }),
  });
  if (!response.ok) return jsonError("Email delivery failed. Please try again later.", 502);
  return NextResponse.json({ ok: true });
}
