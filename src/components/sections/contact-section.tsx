"use client";

import { FormEvent, useEffect, useRef, useState, type SVGProps } from "react";
import { Mic, MicOff, Paperclip, Send, Trash2 } from "lucide-react";
import LaserFlow from "@/components/animations/LaserFlow";
import Magnet from "@/components/animations/Magnet";
import GlideSelect from "@/components/animations/GlideSelect";
import { SiGmail, SiInstagram, SiWhatsapp } from "@icons-pack/react-simple-icons";
import "@/styles/sections/contact-section.css";

declare global {
  interface Window {
    grecaptcha?: {
      render?: (element: HTMLElement, options: { sitekey: string; callback: (token: string) => void; "expired-callback": () => void }) => number;
      reset?: (widgetId?: number) => void;
    };
  }
}
const LinkedInIcon = (props: SVGProps<SVGSVGElement>) => <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.026-3.037-1.852-3.037-1.853 0-2.137 1.445-2.137 2.94v5.666H9.35V8.998h3.414v1.561h.046c.475-.9 1.637-1.85 3.37-1.85 3.604 0 4.267 2.37 4.267 5.456v6.287ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM3.56 20.452h3.554V8.998H3.56v11.454Z" /></svg>;

const SOCIALS = [
  { label: "WhatsApp", value: "08999038796", href: "https://wa.me/628999038796", icon: SiWhatsapp },
  { label: "Gmail", value: "ibrahimusyaffa@gmail.com", href: "mailto:ibrahimusyaffa@gmail.com", icon: SiGmail },
  { label: "LinkedIn", value: "muhammadibrahimmusyaffa", href: "https://www.linkedin.com/in/muhammadibrahimmusyaffa", icon: LinkedInIcon },
  { label: "Instagram", value: "@ibrahimusyaffa", href: "https://www.instagram.com/ibrahimusyaffa?obrf=MWsxZHBnbHhuOXE3Ng==", icon: SiInstagram },
];

type LiveInfo = { time: string; date: string; weather: string; humidity: string; condition: string; icon: string; location: string; status: string };
type Attachment = { file: File; url: string; kind: "file" | "voice" };

const attachmentExtension = (file: File) => {
  const extension = file.name.split(".").pop()?.toLowerCase() || "file";
  return extension === "jpeg" ? "jpg" : extension;
};

const attachmentLabel = (file: File, index: number, allAttachments: Attachment[]) => {
  const extension = attachmentExtension(file);
  const occurrence = allAttachments
    .slice(0, index + 1)
    .filter((attachment) => attachmentExtension(attachment.file) === extension).length;
  const number = ["one", "two", "three", "four", "five"][occurrence - 1] || String(occurrence);
  return `file ${extension} ${number}`;
};

export default function ContactSection() {
  const captchaRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const captchaWidget = useRef<number | undefined>(undefined);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const [captchaToken, setCaptchaToken] = useState("");
  const [recording, setRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState<Attachment | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contactCardRef = useRef<HTMLDivElement>(null);
  const [fileFilter, setFileFilter] = useState("png");
  const [isSending, setIsSending] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const [live, setLive] = useState<LiveInfo>({ time: "--:--:--", date: "Loading date", weather: "--\u00b0C", humidity: "--", condition: "Loading weather", icon: "\uD83C\uDF24\uFE0F", location: "Locating...", status: "CONNECTING" });
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !captchaRef.current) return;
    const renderCaptcha = () => {
      if (
        window.grecaptcha
        && typeof window.grecaptcha.render === "function"
        && captchaRef.current
        && captchaWidget.current === undefined
      ) {
        captchaWidget.current = window.grecaptcha.render(captchaRef.current, {
          sitekey: siteKey,
          callback: setCaptchaToken,
          "expired-callback": () => setCaptchaToken(""),
        });
      }
    };
    const existing = document.querySelector<HTMLScriptElement>('script[src*="recaptcha/api.js"]');
    const script = existing ?? document.createElement("script");
    if (!existing) {
      script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", renderCaptcha, { once: true });
    const retry = window.setInterval(() => {
      renderCaptcha();
      if (captchaWidget.current !== undefined) window.clearInterval(retry);
    }, 250);
    return () => window.clearInterval(retry);
  }, [siteKey]);

  useEffect(() => {
    let cancelled = false;
    const updateClock = (timeZone: string) => {
      const now = new Date();
      setLive((current) => ({
        ...current,
        time: new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone }).format(now),
        date: new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "short", year: "numeric", timeZone }).format(now),
      }));
    };
    const loadLiveData = async (latitude: number, longitude: number) => {
      try {
        const [weatherResponse, locationResponse] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code`),
          fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`),
        ]);
        if (!weatherResponse.ok || !locationResponse.ok) throw new Error("Live data request failed");
        const weather = await weatherResponse.json();
        const location = await locationResponse.json();
        if (cancelled) return;
        const current = weather.current;
        const place = location.address?.city || location.address?.town || location.address?.village || "Unknown location";
        updateClock(Intl.DateTimeFormat().resolvedOptions().timeZone);
        const weatherCode = Number(current.weather_code);
        const condition = weatherCode === 0 ? "Clear sky" : weatherCode < 4 ? "Partly cloudy" : weatherCode < 60 ? "Cloudy" : weatherCode < 80 ? "Rain showers" : "Rain / storm";
        const icon = weatherCode === 0 ? "\u2600\uFE0F" : weatherCode < 4 ? "\uD83C\uDF24\uFE0F" : weatherCode < 60 ? "\u2601\uFE0F" : weatherCode < 80 ? "\uD83C\uDF26\uFE0F" : "\uD83C\uDF27\uFE0F";
        setLive((value) => ({
          ...value,
          weather: `${Math.round(current.temperature_2m)}\u00b0C`,
          humidity: `${current.relative_humidity_2m}%`,
          condition,
          icon,
          location: place,
          status: "LIVE DATA",
        }));
      } catch {
        if (!cancelled) setLive((value) => ({ ...value, weather: "Unavailable", location: "Location unavailable", status: "OFFLINE" }));
      }
    };
    const onLocationError = () => {
      setLive((value) => ({ ...value, location: "Permission denied", status: "OFFLINE" }));
    };
    const contactSection = document.getElementById("contact");
    let locationRequested = false;
    const requestLocation = () => {
      if (locationRequested) return;
      locationRequested = true;
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => void loadLiveData(coords.latitude, coords.longitude),
        onLocationError,
        { enableHighAccuracy: false, timeout: 8000 },
      );
    };
    const locationObserver: IntersectionObserver | null = contactSection
      ? new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) {
            requestLocation();
            locationObserver?.disconnect();
          }
        }, { rootMargin: "600px 0px" })
      : null;
    if (locationObserver && contactSection) locationObserver.observe(contactSection);
    const interval = window.setInterval(() => updateClock(Intl.DateTimeFormat().resolvedOptions().timeZone), 1000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
      locationObserver?.disconnect();
    };
  }, []);

  const toggleRecording = async () => {
    if (recording && mediaRecorder.current) {
      mediaRecorder.current.stop();
      setRecording(false);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || !("MediaRecorder" in window)) {
      setFormStatus("Voice note is not supported in this browser.");
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setFormStatus("Microphone permission was not granted.");
      return;
    }
    chunks.current = [];
    const mimeType = MediaRecorder.isTypeSupported("audio/webm")
      ? "audio/webm"
      : MediaRecorder.isTypeSupported("audio/ogg")
        ? "audio/ogg"
        : "";
    const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    recorder.ondataavailable = (event) => chunks.current.push(event.data);
    recorder.onstop = () => {
      const recordedType = recorder.mimeType.split(";")[0] || "audio/webm";
      const extension = recordedType === "audio/ogg" ? "ogg" : "webm";
      const file = new File([new Blob(chunks.current, { type: recordedType })], `voice-note-${Date.now()}.${extension}`, { type: recordedType });
      setVoiceNote((previous) => {
        if (previous) URL.revokeObjectURL(previous.url);
        return { file, url: URL.createObjectURL(file), kind: "voice" };
      });
      stream.getTracks().forEach((track) => track.stop());
    };
    mediaRecorder.current = recorder;
    recorder.start();
    setRecording(true);
  };

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []).filter((file) => ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "application/pdf"].includes(file.type));
    setAttachments((current) => [...current, ...selected.map((file) => ({ file, url: URL.createObjectURL(file), kind: "file" as const }))]);
    event.target.value = "";
  };

  const removeAttachment = (attachment: Attachment) => {
    URL.revokeObjectURL(attachment.url);
    setAttachments((current) => current.filter((item) => item !== attachment));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!captchaToken) {
      setFormStatus(siteKey ? "Please complete the reCAPTCHA first." : "reCAPTCHA is not configured yet.");
      return;
    }
    setIsSending(true);
    setFormStatus("");
    const form = event.currentTarget;
    const data = new FormData(form);
    data.append("captchaToken", captchaToken);
    attachments.forEach(({ file }) => data.append("attachments", file));
    if (voiceNote) data.append("voiceNote", voiceNote.file);
    try {
      const response = await fetch("/api/contact", { method: "POST", body: data });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Email delivery failed.");
      setFormStatus("Message sent successfully.");
      formRef.current?.reset();
      attachments.forEach((item) => URL.revokeObjectURL(item.url));
      setAttachments([]);
      if (voiceNote) URL.revokeObjectURL(voiceNote.url);
      setVoiceNote(null);
      if (captchaWidget.current !== undefined) window.grecaptcha?.reset?.(captchaWidget.current);
    } catch (error) {
      setFormStatus(error instanceof Error ? error.message : "Email delivery failed.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <footer className="portfolio-contact contact-section" id="contact">
      <div className="contact-laser-bridge" aria-hidden="true">
        <LaserFlow
          surfaceRef={contactCardRef}
          beamPosition={0.6}
          color="#3847ff"
          intensity={1.8}
          flare={1.5}
          spread={1.5}
          spill={1}
          fog={0.2}
          dust={1.6}
          beamWidth={1.5}
          streaks={1.5}
          dots={1}
          pulse={1.5}
          speed={1.5}
          seed={3}
          mouseInteraction={false}
          intro
        />
      </div>
      <div className="contact-layout">
        <div className="contact-intro">
          <h2>Let&apos;s Connect</h2>
          <p>Ready to collaborate? Reach out and let&apos;s build something amazing together.</p>
          <div className="contact-socials">
            {SOCIALS.map((social) => {
              const SocialIcon = social.icon;
              return <a className="contact-social-button" href={social.href} key={social.label} target="_blank" rel="noreferrer" aria-label={social.label}><SocialIcon aria-hidden="true" /></a>;
            })}
          </div>
        </div>
        <div className="contact-form-card" ref={contactCardRef}>
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="contact-form-grid">
              <label>Your name<input name="name" placeholder="Syaffa" required disabled={!captchaToken} /></label>
              <label>Your email<input name="email" type="email" placeholder="Syaffahim@example.com" required disabled={!captchaToken} /></label>
            </div>
            <label>Subject<input name="subject" placeholder="Let&apos;s work together" required disabled={!captchaToken} /></label>
            <label>Message
              <div className="contact-message-box">
                {(voiceNote || attachments.length > 0) && <div className="contact-attachments">
                  {voiceNote && <div className="contact-attachment voice-attachment"><Mic aria-hidden="true" /><audio controls src={voiceNote.url} /><button type="button" onClick={() => { URL.revokeObjectURL(voiceNote.url); setVoiceNote(null); }} aria-label="Remove voice note"><Trash2 aria-hidden="true" /></button></div>}
                  {attachments.map((attachment, index) => <div className="contact-attachment" key={`${attachment.file.name}-${attachment.file.lastModified}`}><Paperclip aria-hidden="true" /><span>{attachmentLabel(attachment.file, index, attachments)}</span><button type="button" onClick={() => removeAttachment(attachment)} aria-label={`Remove ${attachmentLabel(attachment.file, index, attachments)}`}><Trash2 aria-hidden="true" /></button></div>)}
                </div>}
                <textarea name="message" placeholder="Tell me about your idea..." required disabled={!captchaToken} />
                <div className="contact-message-tools">
                <button className={`voice-note-button ${recording ? "is-recording" : ""}`} type="button" onClick={toggleRecording} aria-label={recording ? "Stop voice note recording" : "Record voice note"} disabled={!captchaToken}>
                  {recording ? <MicOff aria-hidden="true" /> : <Mic aria-hidden="true" />}
                  {recording && <i className="voice-pill"><b /><b /><b /></i>}
                </button>
                <GlideSelect
                  value={fileFilter}
                  options={[
                    { value: "png", label: "PNG" },
                    { value: "jpg", label: "JPG" },
                    { value: "webp", label: "WebP" },
                    { value: "svg", label: "SVG" },
                    { value: "pdf", label: "PDF" },
                  ]}
                  onChange={(value) => {
                    setFileFilter(value);
                    window.setTimeout(() => fileInputRef.current?.click(), 0);
                  }}
                  accentColor="var(--accent)"
                  surfaceColor="var(--surface)"
                  highlightColor="var(--muted)"
                  textColor="var(--foreground)"
                  ariaLabel="Attach files"
                  disabled={!captchaToken}
                  className="contact-file-select"
                />
                <input ref={fileInputRef} className="contact-file-input" type="file" multiple accept={`.${fileFilter}`} onChange={handleFiles} />
              </div>
              </div>
            </label>
            <div className="contact-captcha">
              {siteKey ? <div ref={captchaRef} /> : <p>reCAPTCHA requires <code>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code>.</p>}
            </div>
            <div className="contact-form-actions">
              <Magnet padding={40} magnetStrength={2.5}><button className="contact-submit" type="submit" disabled={isSending}><Send aria-hidden="true" /> {isSending ? "Sending..." : "Send message"}</button></Magnet>
            </div>
            {formStatus && <p className="contact-form-status" role="status">{formStatus}</p>}
          </form>
        </div>
      </div>
      <div className="contact-live-grid">
        <div><span>LOCAL TIME</span><strong>{live.time}</strong><small>{live.date}</small></div>
        <div><span>WEATHER</span><strong className="contact-weather-value"><em aria-hidden="true">{live.icon}</em>{live.weather}</strong><small>{live.condition} · Humidity {live.humidity}</small></div>
        <div><span>LOCATION</span><strong>{live.location}</strong></div>
        <div><span>STATUS</span><strong className="contact-live-status"><i />{live.status}</strong></div>
      </div>
      <div className="contact-copyright">{"\u00a9"} 2026 Muhammad Ibrahim Musyaffa. All Rights Reserved.</div>
    </footer>
  );
}
