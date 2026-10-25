import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muhammad Ibrahim Musyaffa — Portofolio",
  description: "Portofolio pribadi Muhammad Ibrahim Musyaffa.",
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
