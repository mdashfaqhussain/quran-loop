import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quran Loop Player — Mishary Alafasy",
  description: "Memorize Quran one ayat at a time with Mishary Rashid Alafasy's recitation on loop.",
  keywords: ["Quran", "memorization", "Mishary Alafasy", "hafiz", "loop player"],
  openGraph: {
    title: "Quran Loop Player",
    description: "Memorize Quran one ayat at a time with Mishary Rashid Alafasy",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
