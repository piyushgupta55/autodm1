import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoDM | Turn Instagram comments into conversations",
  description: "Automatically send direct messages when someone comments on your posts. Convert engagement into real conversations instantly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-background-primary text-text-body`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
