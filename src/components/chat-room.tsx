"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { ArrowLeft, Check, MessageCircle, Reply, Send, Shield, Trash2, X } from "lucide-react";
import googleLogo from "@/foto/Google.png";
import { isSupabaseConfigured, supabase } from "@/lib/supabase/client";
import "./chat-room.css";

type ChatMessage = {
  id: string;
  created_at: string;
  user_id: string | null;
  display_name: string;
  content: string;
  is_host: boolean;
  reply_to: string | null;
  provider: "github" | "google" | "host";
};

type ChatReaction = {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
};

type MessageWithReactions = ChatMessage & { reactions: ChatReaction[] };

const emojis = ["❤️", "😂", "👍"] as const;

async function loadChat(client: NonNullable<typeof supabase>): Promise<MessageWithReactions[]> {
  const [messagesResult, reactionsResult] = await Promise.all([
    client.from("chat_messages").select("id, created_at, user_id, display_name, content, is_host, reply_to, provider").order("created_at", { ascending: true }).limit(100),
    client.from("chat_reactions").select("id, message_id, user_id, emoji"),
  ]);

  if (messagesResult.error) throw messagesResult.error;
  if (reactionsResult.error) throw reactionsResult.error;
  const reactions = (reactionsResult.data ?? []) as ChatReaction[];
  return ((messagesResult.data ?? []) as ChatMessage[]).map((message) => ({
    ...message,
    reactions: reactions.filter((reaction) => reaction.message_id === message.id),
  }));
}

function displayName(user: User) {
  const metadata = user.user_metadata;
  return metadata.full_name || metadata.name || user.email?.split("@")[0] || "Guest";
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function authProvider(user: User): "github" | "google" {
  const provider = user.app_metadata.provider ?? user.identities?.[0]?.provider;
  return provider === "google" ? "google" : "github";
}

export default function ChatRoom() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [hostFormOpen, setHostFormOpen] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [messages, setMessages] = useState<MessageWithReactions[]>([]);
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const knownMessageIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    function openRoom() {
      setIsOpen(true);
    }

    window.addEventListener("portfolio:open-chat", openRoom);
    return () => window.removeEventListener("portfolio:open-chat", openRoom);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    let active = true;

    async function refreshMessages() {
      try {
        const nextMessages = await loadChat(supabase!);
        if (active) {
          const previousIds = knownMessageIds.current;
          if (previousIds) {
            const newMessage = nextMessages.find((message) => !previousIds.has(message.id));
            if (newMessage) {
              window.dispatchEvent(new CustomEvent("portfolio:chat-message", {
                detail: { sender: newMessage.display_name, message: newMessage.content },
              }));
            }
          }
          knownMessageIds.current = new Set(nextMessages.map((message) => message.id));
          setMessages(nextMessages);
        }
        if (active) setErrorMessage("");
      } catch (error) {
        const databaseError = error as { code?: string; message?: string };
        const errorText = databaseError.message ?? "";
        const migrationNeeded = databaseError.code === "42703"
          || databaseError.code === "PGRST204"
          || /column .*provider|provider.*schema cache/i.test(errorText);

        if (active && migrationNeeded) {
          setErrorMessage("Database chat perlu diperbarui. Jalankan supabase/chat-provider-migration.sql di SQL Editor Supabase.");
        } else if (active) {
          setErrorMessage("Pesan belum dapat dimuat. Periksa koneksi dan kebijakan database Supabase.");
        }
        if (process.env.NODE_ENV === "development") console.error("Supabase chat load failed:", error);
      } finally {
        if (active) setIsLoading(false);
      }
    }

    void supabase.auth.getUser().then(({ data }) => {
      if (active) setUser(data.user);
    });
    void fetch("/api/chat/host-session").then((response) => response.json()).then((data: { isHost?: boolean }) => {
      if (active) setIsHost(Boolean(data.isHost));
    });
    void refreshMessages();

    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setUser(session?.user ?? null);
    });
    const channel = supabase
      .channel("portfolio-chat-room")
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_messages" }, () => void refreshMessages())
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_reactions" }, () => void refreshMessages())
      .subscribe();

    return () => {
      active = false;
      authListener.data.subscription.unsubscribe();
      void supabase?.removeChannel(channel);
    };
  }, []);

  async function signIn(provider: "github" | "google") {
    if (!supabase) return;
    setErrorMessage("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) setErrorMessage(error.message);
  }

  async function unlockHost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    const response = await fetch("/api/chat/host-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passcode }),
    });
    const result = await response.json() as { error?: string; isHost?: boolean };
    if (!response.ok) {
      setErrorMessage(result.error ?? "Akses host gagal dibuka.");
      return;
    }
    setIsHost(Boolean(result.isHost));
    setPasscode("");
    setHostFormOpen(false);
  }

  async function signOut() {
    if (isHost) {
      await fetch("/api/chat/host-session", { method: "DELETE" });
      setIsHost(false);
      return;
    }
    await supabase?.auth.signOut();
    setUser(null);
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = draft.trim();
    if (!content || (!user && !isHost) || isSending) return;

    setIsSending(true);
    setErrorMessage("");
    try {
      if (isHost) {
        const response = await fetch("/api/chat/host-messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, replyTo: replyTo?.id }),
        });
        const result = await response.json() as { error?: string };
        if (!response.ok) throw new Error(result.error ?? "Pesan gagal dikirim.");
      } else if (supabase && user) {
        const { error } = await supabase.from("chat_messages").insert({
          content,
          display_name: displayName(user),
          is_host: false,
          provider: authProvider(user),
          reply_to: replyTo?.id ?? null,
          user_id: user.id,
        });
        if (error) throw error;
      }
      setDraft("");
      setReplyTo(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Pesan gagal dikirim.");
    } finally {
      setIsSending(false);
    }
  }

  async function toggleReaction(message: ChatMessage, emoji: string) {
    if (!supabase || !user) {
      setErrorMessage("Login diperlukan untuk memberi reaksi.");
      return;
    }
    const current = messages.find((item) => item.id === message.id)?.reactions.find((reaction) => reaction.user_id === user.id && reaction.emoji === emoji);
    if (current) {
      await supabase.from("chat_reactions").delete().eq("id", current.id);
    } else {
      await supabase.from("chat_reactions").insert({ message_id: message.id, user_id: user.id, emoji });
    }
    setReactionPickerFor(null);
  }

  async function deleteMessage(messageId: string) {
    if (!isHost || !window.confirm("Hapus pesan ini dari room chat?")) return;
    const response = await fetch("/api/chat/host-messages", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId }),
    });
    if (!response.ok) {
      const result = await response.json() as { error?: string };
      setErrorMessage(result.error ?? "Pesan gagal dihapus.");
      return;
    }
    setMessages((current) => current.filter((message) => message.id !== messageId));
  }

  const messagesById = new Map(messages.map((message) => [message.id, message]));

  return (
    <>
      {isOpen && <button className="chat-backdrop" type="button" aria-label="Tutup room chat" onClick={() => setIsOpen(false)} />}
      <aside className={`chat-drawer${isOpen ? " chat-drawer-open" : ""}`} aria-label="Room chat" aria-hidden={!isOpen} inert={!isOpen}>
        <header className="chat-header">
          <div className="chat-brand-icon"><MessageCircle aria-hidden="true" /></div>
          <div className="chat-header-copy">
            <strong>Room Chat</strong>
            <span><i /> {isSupabaseConfigured ? "LIVE" : "Belum dikonfigurasi"}</span>
          </div>
          {(user || isHost) && <button className="chat-header-action" type="button" onClick={() => void signOut()} aria-label="Keluar"><ArrowLeft /></button>}
          <button className="chat-close" type="button" onClick={() => setIsOpen(false)} aria-label="Tutup room chat"><X /></button>
        </header>

        <div className="chat-thread" aria-live="polite">
          {!isSupabaseConfigured ? (
            <div className="chat-empty-state">
              <Shield aria-hidden="true" />
              <strong>Room chat sedang disiapkan</strong>
              <p>Tambahkan konfigurasi Supabase dan OAuth sesuai panduan di README untuk mengaktifkan chat realtime.</p>
            </div>
          ) : isLoading ? (
            <p className="chat-status">Memuat percakapan...</p>
          ) : messages.length === 0 ? (
            <div className="chat-empty-state">
              <MessageCircle aria-hidden="true" />
              <strong>Mulai percakapan</strong>
              <p>Jadilah yang pertama menyapa di room ini.</p>
            </div>
          ) : (
            messages.map((message) => {
              const replyMessage = message.reply_to ? messagesById.get(message.reply_to) : null;
              const reactionCounts = message.reactions.reduce<Record<string, number>>((counts, reaction) => {
                counts[reaction.emoji] = (counts[reaction.emoji] ?? 0) + 1;
                return counts;
              }, {});
              return (
                <article className={`chat-message${message.is_host ? " chat-message-host" : ""}`} key={message.id}>
                  {!message.is_host && <div className="chat-avatar">{initials(message.display_name)}</div>}
                  <div className="chat-message-body">
                    <div className="chat-message-meta">
                      <strong>{message.display_name}</strong>
                      {!message.is_host && (
                        message.provider === "google"
                          ? <Image className="chat-provider-icon chat-provider-google" src={googleLogo} alt="Google" title="Login dengan Google" />
                          : <SiGithub className="chat-provider-icon chat-provider-github" title="Login dengan GitHub" />
                      )}
                      {message.is_host && <span className="host-badge">Web Owner</span>}
                    </div>
                    <div className="chat-bubble-wrap">
                      <button
                        className="chat-bubble"
                        type="button"
                        aria-label="Tampilkan pilihan reaksi"
                        aria-expanded={reactionPickerFor === message.id}
                        onClick={() => setReactionPickerFor(reactionPickerFor === message.id ? null : message.id)}
                      >
                        {replyMessage && <blockquote><b>{replyMessage.display_name}</b><span>{replyMessage.content}</span></blockquote>}
                        <span>{message.content}</span>
                      </button>
                      {reactionPickerFor === message.id && (
                        <div className="chat-reaction-picker" role="group" aria-label="Pilih reaksi">
                          {emojis.map((emoji) => (
                            <button type="button" key={emoji} onClick={() => void toggleReaction(message, emoji)} aria-label={`Beri reaksi ${emoji}`}>
                              {emoji}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="chat-message-tools">
                      <time dateTime={message.created_at}>{formatTime(message.created_at)}</time>
                      <button type="button" onClick={() => setReplyTo(message)}><Reply aria-hidden="true" /> Balas</button>
                      {Object.entries(reactionCounts).map(([emoji, count]) => <span className="chat-reaction-count" key={emoji}>{emoji} {count}</span>)}
                      {isHost && <button type="button" className="chat-delete-message" onClick={() => void deleteMessage(message.id)} aria-label="Hapus pesan"><Trash2 aria-hidden="true" /> Hapus</button>}
                    </div>
                  </div>
                  {message.is_host && <div className="chat-avatar chat-avatar-host">IM</div>}
                </article>
              );
            })
          )}
        </div>

        {errorMessage && <p className="chat-error" role="status">{errorMessage}</p>}

        {user || isHost ? (
          <footer className="chat-compose-area">
            {replyTo && <div className="chat-replying"><span>Membalas <b>{replyTo.display_name}</b>: {replyTo.content}</span><button type="button" onClick={() => setReplyTo(null)} aria-label="Batalkan balasan"><X /></button></div>}
            <form className="chat-compose" onSubmit={(event) => void sendMessage(event)}>
              <input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={1000} placeholder="Tulis pesan..." aria-label="Tulis pesan" />
              <button type="submit" disabled={!draft.trim() || isSending} aria-label="Kirim pesan"><Send /></button>
            </form>
            <p className="chat-session-label">{isHost ? "Kamu masuk sebagai host" : `Masuk sebagai ${displayName(user!)}`}</p>
          </footer>
        ) : (
          <footer className="chat-login-area">
            <div className="chat-login-title"><Shield aria-hidden="true" /><strong>Masuk untuk Menulis Pesan</strong></div>
            <button className="chat-oauth chat-oauth-github" type="button" onClick={() => void signIn("github")} disabled={!isSupabaseConfigured}><SiGithub aria-hidden="true" /> GitHub</button>
            <button className="chat-oauth chat-oauth-google" type="button" onClick={() => void signIn("google")} disabled={!isSupabaseConfigured}><Image src={googleLogo} alt="" aria-hidden="true" /> Google</button>
            <button className="chat-host-link" type="button" onClick={() => setHostFormOpen(!hostFormOpen)}>
              {hostFormOpen ? "Tutup akses host" : "Host? Masuk dengan passcode"}
            </button>
            {hostFormOpen && (
              <form className="chat-host-form" onSubmit={(event) => void unlockHost(event)}>
                <input type="password" value={passcode} onChange={(event) => setPasscode(event.target.value)} autoComplete="current-password" placeholder="Passcode host" aria-label="Passcode host" />
                <button type="submit" disabled={!passcode}><Check aria-hidden="true" /> Masuk</button>
              </form>
            )}
            <p className="chat-login-note">Login dengan GitHub atau Google diperlukan untuk menulis pesan.</p>
          </footer>
        )}
      </aside>
    </>
  );
}