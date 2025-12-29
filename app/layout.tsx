import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "holiday is offline",
  description: "holiday is offline",
  icons: {
    icon: '/delmar.ico',
  },
  openGraph: {
    title: "holiday is offline",
    description: "holiday is offline",
    images: [
      {
        url: '/h.png',
        width: 1200,
        height: 1200,
        alt: 'holiday',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "holiday is offline",
    description: "holiday is offline",
    images: ['/h.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
