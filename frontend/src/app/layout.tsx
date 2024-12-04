import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import {AuthProvider} from "@/app/api/auth";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SparkBytes",
  description: "Access extra food from campus events with ease.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Header/>
          <main className="flex-grow">{children}</main>
          <Footer/>
        </AuthProvider>
      </body>
    </html>
  );
}
