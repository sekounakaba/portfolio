import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sekouna KABA — Full-Stack Developer | Data Engineer | AI Engineer",
  description: "Portfolio of Sekouna KABA — 11+ years building innovative solutions in full-stack development, data engineering, AI, and business intelligence at DataSphere Innovation.",
  keywords: ["Sekouna KABA", "Full-Stack Developer", "Data Engineer", "AI Engineer", "Data Architect", "DataSphere Innovation", "Portfolio"],
  authors: [{ name: "Sekouna KABA" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Sekouna KABA — Portfolio",
    description: "Full-Stack Developer | Data Engineer | AI Engineer | Data Architect",
    siteName: "Sekouna KABA Portfolio",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
