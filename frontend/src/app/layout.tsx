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
  title: "1522 - The Pub",
  description: "Book tickets for exclusive events at 1522",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${chonburi.variable} ${spaceMono.variable} antialiased min-h-screen relative`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

