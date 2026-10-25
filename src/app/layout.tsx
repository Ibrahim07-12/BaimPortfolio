import type { Metadata } from "next";
import "./globals.css";
import favicon from "./favicons.png";

export const metadata: Metadata = {
  title: "Muhammad Ibrahim Musyaffa — Portofolio",
  description: "Portofolio pribadi Muhammad Ibrahim Musyaffa.",
  icons: {
    icon: favicon.src,
    shortcut: favicon.src,
    apple: favicon.src,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      data-theme="light"
      className="font-sans"
    >
      <body>{children}</body>
    </html>
  );
}
