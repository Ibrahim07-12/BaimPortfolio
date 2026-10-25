import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const HOST_SESSION_COOKIE = "portfolio-host-session";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 12;

function safeEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function signExpiry(expiry: string, secret: string) {
  return createHmac("sha256", secret).update(`portfolio-host:${expiry}`).digest("base64url");
}

export function verifyHostPasscode(passcode: string) {
  const expected = process.env.HOST_CHAT_PASSWORD;
  return Boolean(expected && safeEqual(passcode, expected));
}

export function createHostSessionToken() {
  const secret = process.env.HOST_CHAT_SECRET;
  if (!secret) throw new Error("HOST_CHAT_SECRET is not configured.");

  const expiry = String(Math.floor(Date.now() / 1000) + SESSION_LIFETIME_SECONDS);
  return `${expiry}.${signExpiry(expiry, secret)}`;
}

export function isValidHostSession(token: string | undefined) {
  const secret = process.env.HOST_CHAT_SECRET;
  if (!token || !secret) return false;

  const [expiry, signature] = token.split(".");
  if (!expiry || !signature || Number(expiry) <= Math.floor(Date.now() / 1000)) return false;

  return safeEqual(signature, signExpiry(expiry, secret));
}

export const hostSessionMaxAge = SESSION_LIFETIME_SECONDS;