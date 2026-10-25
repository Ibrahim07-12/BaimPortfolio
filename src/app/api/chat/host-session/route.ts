import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createHostSessionToken,
  HOST_SESSION_COOKIE,
  hostSessionMaxAge,
  isValidHostSession,
  verifyHostPasscode,
} from "@/lib/host-session";

export async function GET() {
  const cookieStore = await cookies();
  const isHost = isValidHostSession(cookieStore.get(HOST_SESSION_COOKIE)?.value);
  return NextResponse.json({ isHost });
}

export async function POST(request: Request) {
  if (!process.env.HOST_CHAT_PASSWORD || !process.env.HOST_CHAT_SECRET) {
    return NextResponse.json({ error: "Akses host belum dikonfigurasi." }, { status: 503 });
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (typeof body?.passcode !== "string" || !verifyHostPasscode(body.passcode)) {
    return NextResponse.json({ error: "Passcode host salah." }, { status: 401 });
  }

  const response = NextResponse.json({ isHost: true });
  response.cookies.set(HOST_SESSION_COOKIE, createHostSessionToken(), {
    httpOnly: true,
    maxAge: hostSessionMaxAge,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ isHost: false });
  response.cookies.set(HOST_SESSION_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}