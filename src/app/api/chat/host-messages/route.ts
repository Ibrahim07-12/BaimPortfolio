import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { HOST_SESSION_COOKIE, isValidHostSession } from "@/lib/host-session";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  if (!isValidHostSession(cookieStore.get(HOST_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Sesi host tidak valid." }, { status: 401 });
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content || content.length > 1000) {
    return NextResponse.json({ error: "Pesan harus berisi 1-1000 karakter." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase server belum dikonfigurasi." }, { status: 503 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await admin
    .from("chat_messages")
    .insert({
      content,
      display_name: process.env.HOST_DISPLAY_NAME || "Ibrahim (Host)",
      is_host: true,
      provider: "host",
      reply_to: typeof body?.replyTo === "string" ? body.replyTo : null,
      user_id: null,
    })
    .select("id, created_at, display_name, content, is_host, reply_to, user_id, provider")
    .single();

  if (error) return NextResponse.json({ error: "Pesan gagal dikirim." }, { status: 500 });
  return NextResponse.json({ message: data }, { status: 201 });
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  if (!isValidHostSession(cookieStore.get(HOST_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "Sesi host tidak valid." }, { status: 401 });
  }

  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Permintaan tidak valid." }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (typeof body?.messageId !== "string") {
    return NextResponse.json({ error: "Pesan tidak valid." }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: "Supabase server belum dikonfigurasi." }, { status: 503 });
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error } = await admin.from("chat_messages").delete().eq("id", body.messageId);
  if (error) return NextResponse.json({ error: "Pesan gagal dihapus." }, { status: 500 });
  return NextResponse.json({ deleted: true });
}