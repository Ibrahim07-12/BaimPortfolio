# Portofolio Muhammad Ibrahim Musyaffa

Portofolio pribadi dengan Next.js App Router, TypeScript, dan Tailwind CSS.

## Menjalankan proyek

```sh
npm install
npm run dev
```

Buka `http://localhost:3000` di browser. Perintah `npm run lint` dan `npm run build` tersedia untuk pemeriksaan kode dan production build.

## Struktur utama

- `src/app`: route, metadata, dan style global.
- `src/components`: komponen navigasi, Particle Text, Scroll Velocity, dan room chat.
- `src/components/sections`: home, info rail, about, education/skills, pengalaman kerja/organisasi, projects, achievements, certifications, dan contact.
- `public`: aset statis seperti foto profil.
- `supabase/chat-schema.sql`: tabel, realtime publication, dan kebijakan akses chat.

Info rail di bawah hero menunjukkan lokasi dan tanggal lokal perangkat. Tombol **SCROLL DOWN** menjalankan gulir bertahap ke bagian Contact; tekan lagi untuk berhenti.

## Menyiapkan room chat

1. Buat proyek Supabase, lalu salin `.env.example` menjadi `.env.local`.
2. Isi URL dan anon key dari **Project Settings → API**. Isi `SUPABASE_SERVICE_ROLE_KEY` hanya di `.env.local` atau secret manager deployment; jangan pernah mengawali namanya dengan `NEXT_PUBLIC_`.
3. Untuk room baru, jalankan isi `supabase/chat-schema.sql` satu kali melalui **SQL Editor** Supabase. Jika schema chat sudah pernah dijalankan, jalankan `supabase/chat-provider-migration.sql` agar provider OAuth tercatat dan tervalidasi.
4. Aktifkan provider GitHub dan Google di **Authentication → Providers**. Masukkan OAuth client ID/secret dari masing-masing provider.
5. Di **Authentication → URL Configuration**, tambahkan `http://localhost:3000/auth/callback` sebagai redirect URL. Tambahkan URL domain production yang sama setelah deploy.
6. Pada konfigurasi OAuth GitHub dan Google, gunakan callback Supabase `https://<project-ref>.supabase.co/auth/v1/callback`.
7. Isi `HOST_CHAT_PASSWORD` dengan passphrase acak yang panjang dan `HOST_CHAT_SECRET` dengan secret acak yang berbeda. Keduanya hanya disimpan di `.env.local` atau secret manager.

Audiens login menggunakan GitHub/Google untuk menulis, membalas, dan bereaksi. Host tidak memakai OAuth: buka ikon chat, pilih **Host? Masuk dengan passcode**, lalu gunakan `HOST_CHAT_PASSWORD`. Server mengeluarkan cookie HTTP-only 12 jam dan membuat pesan host memakai service-role key. Jangan membagikan passcode; rotasi nilainya jika pernah bocor.

Jika konfigurasi Supabase belum lengkap, ikon chat tetap membuka panel setup dan tombol OAuth tidak aktif. Setelah mengisi `.env.local`, restart dev server.

## Deploy ke Vercel

### 1. Persiapan repository

1. Pastikan project sudah berada di repository GitHub.
2. Jangan commit `.env.local`, API key, service-role key, passcode host, atau secret lainnya.
3. Jalankan pemeriksaan lokal:

   ```sh
   npm install
   npm run lint
   npm run build
   ```

### 2. Import project ke Vercel

1. Buka dashboard Vercel, pilih **Add New → Project**, lalu import repository GitHub.
2. Framework akan terdeteksi sebagai **Next.js**.
3. Gunakan pengaturan default:
   - Build command: `npm run build`
   - Install command: `npm install`
   - Output directory: default Next.js
4. Sebelum deploy pertama, buka **Project Settings → Environment Variables**.
5. Tambahkan semua variable berikut. Gunakan environment **Production** dan **Preview** bila keduanya ingin aktif:

   ```text
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   HOST_CHAT_PASSWORD
   HOST_CHAT_SECRET
   HOST_DISPLAY_NAME
   NEXT_PUBLIC_RECAPTCHA_SITE_KEY
   RECAPTCHA_SECRET_KEY
   RESEND_API_KEY
   RESEND_FROM_EMAIL
   ```

   `SUPABASE_SERVICE_ROLE_KEY`, `HOST_CHAT_PASSWORD`, `HOST_CHAT_SECRET`,
   `RECAPTCHA_SECRET_KEY`, dan `RESEND_API_KEY` harus tetap menjadi variable
   server-only. Jangan mengubahnya menjadi `NEXT_PUBLIC_*`.

6. Klik **Deploy**. Setelah deployment selesai, simpan domain production Vercel,
   misalnya `https://nama-project.vercel.app`.

### 3. Konfigurasi Supabase untuk domain Vercel

Ya, konfigurasi URL perlu ditambahkan untuk domain hosting. Project Supabase
tetap bisa dipakai; yang berubah adalah URL redirect dan allowed origin.

1. Buka **Supabase → Authentication → URL Configuration**.
2. Isi **Site URL** dengan domain production Vercel:

   ```text
   https://nama-project.vercel.app
   ```

3. Tambahkan redirect URL:

   ```text
   https://nama-project.vercel.app/auth/callback
   http://localhost:3000/auth/callback
   ```

4. Buka **Authentication → Providers → GitHub** dan **Google**. Provider tidak
   perlu diganti, tetapi callback URL pada masing-masing OAuth provider harus
   tetap memakai callback Supabase:

   ```text
   https://<project-ref>.supabase.co/auth/v1/callback
   ```

5. Di GitHub OAuth App, tambahkan domain Vercel pada **Homepage URL** dan
   pastikan **Authorization callback URL** sama dengan callback Supabase di atas.
6. Di Google Cloud Console, tambahkan domain Vercel pada **Authorized
   JavaScript origins** bila diperlukan dan callback Supabase pada **Authorized
   redirect URIs**.

Dengan demikian, akun GitHub/Google dan data chat tetap memakai project Supabase
yang sama; tidak perlu membuat project Supabase baru hanya karena pindah hosting.

### 4. Konfigurasi reCAPTCHA

Ya, domain Vercel harus ditambahkan ke konfigurasi reCAPTCHA.

1. Buka Google reCAPTCHA Admin Console.
2. Edit key yang dipakai contact form.
3. Tambahkan domain tanpa protocol dan tanpa path, misalnya:

   ```text
   nama-project.vercel.app
   ```

4. Jika memakai custom domain, tambahkan juga domain custom tersebut.
5. Gunakan site key pada `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` di Vercel.
6. Gunakan secret key pada `RECAPTCHA_SECRET_KEY` di Vercel.
7. Redeploy setelah mengubah environment variable.

Jangan memasukkan `RECAPTCHA_SECRET_KEY` ke kode client atau variable
`NEXT_PUBLIC_*`.

### 5. Konfigurasi Resend

`RESEND_API_KEY` dan `RESEND_FROM_EMAIL` juga harus diisi pada environment
Vercel.

1. Buat atau gunakan API key di dashboard Resend.
2. Jika masih menggunakan mode testing, gunakan alamat pengirim yang diizinkan
   Resend, biasanya `onboarding@resend.dev`, dan penerima yang sesuai aturan
   akun testing.
3. Untuk production, verifikasi domain pengirim di **Resend → Domains**.
4. Setelah domain terverifikasi, isi `RESEND_FROM_EMAIL`, misalnya:

   ```text
   Portfolio Contact <noreply@domain-anda.com>
   ```

5. Jangan menaruh API key Resend di variable `NEXT_PUBLIC_*`.
6. Redeploy setelah mengubah variable.

### 6. Checklist setelah hosting

- Buka domain Vercel dan pastikan tidak ada error di browser console.
- Uji login GitHub dan Google dari Chat Room.
- Uji pengiriman pesan baru dan pastikan realtime notification muncul.
- Uji contact form, reCAPTCHA, voice note, dan attachment.
- Periksa log API di **Vercel → Project → Deployments → Functions** jika email
  atau host chat gagal.
- Setelah menambahkan atau mengubah environment variable, lakukan redeploy.
