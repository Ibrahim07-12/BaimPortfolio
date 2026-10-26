# BaimPortfolio — Website Summary

## 1. Overview

BaimPortfolio adalah website portfolio personal Muhammad Ibrahim Musyaffa. Website ini menampilkan profil, pendidikan, keahlian, pengalaman kerja, pengalaman organisasi, project, pencapaian, sertifikasi, dan kontak dalam bentuk single-page portfolio yang interaktif.

Website menggabungkan layout editorial, animasi scroll, interactive card, image viewer, project preview, realtime chat, dan contact form.

## 2. Struktur Halaman

### Home

- Hero section dengan nama dan foto profile.
- Animasi particle text.
- Scroll velocity text.
- Home information rail.

### About

- Deskripsi profile.
- Kartu profile interaktif dengan efek tilt dan visual holographic.
- Informasi pendidikan dan kemampuan utama.

### Education & Skills

- Riwayat pendidikan.
- Kelompok skill Programming & Web Development.
- Kelompok skill Engineering Software.
- Icon skill dengan efek hover.

### Work Experience

- Pengalaman internship dan pekerjaan.
- Timeline pengalaman.
- Galeri foto interaktif.
- Drag carousel dan image viewer.

### Organizational Experience

- Pengalaman organisasi.
- Informasi role dan periode.
- Galeri dokumentasi kegiatan.
- Efek reveal, parallax, dan image viewer.

### Projects

- Project akademik dan industri.
- Project IoT, embedded system, robotics, web application, dan machine learning.
- Informasi ringkasan, tanggung jawab, tools, foto, video, dan presentation.
- Project media viewer.

### Achievements

- Daftar penghargaan dan kompetisi.
- Sticky scroll presentation.
- Image viewer untuk dokumentasi pencapaian.

### Certifications

- Daftar sertifikasi.
- Gallery sertifikat.
- Preview gambar sertifikat.

### Contact

- Contact form.
- Upload file attachment.
- Voice note recorder.
- Google reCAPTCHA.
- Pengiriman email melalui Resend API.
- Informasi media sosial.
- Informasi waktu, cuaca, dan lokasi.

### Chat Room & Notifications

- Chat room realtime.
- Login GitHub dan Google melalui Supabase OAuth.
- Notification panel.
- Unread message badge.
- Mark all as read.
- Tombol membuka chat room.
- Sinkronisasi pesan melalui event browser dan Supabase Realtime.

## 3. Teknologi yang Digunakan

### Framework dan bahasa

- Next.js 16.4.3
- React 19.3.0
- TypeScript
- Tailwind CSS 4
- CSS

### Animasi dan interaksi

- Framer Motion
- GSAP
- Motion
- Lenis
- CSS keyframe animation
- Intersection Observer API
- Browser Pointer and Drag Events

### UI dan icon

- Lucide React
- Hugeicons
- React Simple Icons
- Base UI
- Class Variance Authority

### Backend dan layanan eksternal

- Supabase Authentication
- Supabase Database
- Supabase Realtime
- GitHub OAuth
- Google OAuth
- Resend API
- Google reCAPTCHA v2
- Open-Meteo API
- OpenStreetMap Nominatim API

### Deployment

- Vercel
- Environment variables melalui Vercel Project Settings

## 4. Struktur Folder Utama

```text
src/
├── ACHIEVEMENTS/       # Asset pencapaian dan sertifikasi pendukung
├── certifications/     # Asset sertifikasi
├── ES/                 # Asset engineering software
├── foto/               # Foto profile
├── Organisasi/         # Asset pengalaman organisasi
├── Projects/           # Asset project
├── PWD/                # Asset programming dan web development
├── WORK/               # Asset pengalaman kerja
├── app/                # App Router, layout, halaman, dan API routes
├── components/
│   ├── animations/     # Komponen animasi dan komponen visual interaktif
│   ├── features/
│   │   ├── chat/       # Chat room dan notification
│   │   └── projects/   # Komponen project
│   ├── sections/       # Komponen setiap section halaman
│   └── ui/             # Komponen UI reusable
└── styles/
    ├── animations/     # CSS komponen animasi
    └── sections/       # CSS setiap section
```

## 5. API Routes Internal

### Contact API

`src/app/api/contact/route.ts`

Memproses contact form, validasi attachment, validasi reCAPTCHA, dan mengirim pesan menggunakan Resend.

### Chat Host Session

`src/app/api/chat/host-session/route.ts`

Mengelola session host untuk kebutuhan chat room.

### Chat Host Messages

`src/app/api/chat/host-messages/route.ts`

Menyediakan akses server-side untuk pesan host chat.

### Project Media

`src/app/api/project-media/route.ts`

Melayani kebutuhan media project tertentu.

### Auth Callback

`src/app/auth/callback/route.ts`

Menangani callback autentikasi OAuth dari Supabase.

## 6. Fitur Utama

- Responsive layout untuk desktop dan mobile.
- Light mode dan dark mode.
- Theme transition berbentuk circular wipe.
- Sticky scroll sections.
- Scroll reveal animation.
- Parallax animation.
- Interactive card tilt.
- Drag image carousel.
- Full-size image viewer.
- Video preview untuk project.
- Presentation preview untuk project.
- Contact form dengan attachment.
- Voice recording.
- reCAPTCHA protection.
- Realtime chat.
- Notification unread state.
- OAuth login.
- Optimasi gambar melalui `next/image`.

## 7. Environment Variables

Environment variables yang digunakan di deployment:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
HOST_CHAT_PASSWORD=
HOST_CHAT_SECRET=
HOST_DISPLAY_NAME=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
```

File `.env.local` tidak boleh di-commit ke repository.

## 8. Deployment Flow

1. Source code disimpan di repository GitHub.
2. Repository dihubungkan ke Vercel.
3. Environment variables ditambahkan pada Vercel.
4. Supabase redirect URL disesuaikan dengan domain Vercel.
5. Domain Vercel ditambahkan ke konfigurasi reCAPTCHA.
6. Domain pengirim Resend diverifikasi.
7. Project di-build dan di-deploy melalui Vercel.
8. Website diuji kembali untuk login, chat, contact form, notification, dan semua media.

## 9. Performance Optimization

Optimasi yang telah diterapkan:

- Foto profile dikonversi ke WebP.
- Foto profile menggunakan `next/image`.
- Ukuran gambar disesuaikan dengan kebutuhan tampilan.
- Foto carousel nonaktif menggunakan lazy loading.
- Asset non-kritis tidak diprioritaskan sebagai resource awal.
- Struktur komponen dipisahkan berdasarkan fungsi.
- CSS dipisahkan berdasarkan animation dan section.
- Security headers dan konfigurasi cache dipertahankan di Next.js.

Nilai Lighthouse dapat berubah berdasarkan perangkat, cache, jaringan, dan konfigurasi throttling. Pengukuran ulang perlu dilakukan setelah deployment terbaru.

## 10. Development Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

Development server berjalan menggunakan Next.js App Router.
