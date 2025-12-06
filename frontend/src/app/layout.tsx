import type { Metadata } from "next";
import { Chonburi, Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const chonburi = Chonburi({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-chonburi",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "An Audio Affair - Premium Live Music Events",
  description: "Book tickets for exclusive live music events by An Audio Affair",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "An Audio Affair",
    description: "Premium live music events and experiences",
    siteName: "An Audio Affair",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${chonburi.variable} ${spaceMono.variable} antialiased min-h-screen relative`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

