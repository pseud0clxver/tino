import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import HydroBackground from "../components/backgrounds/HydroBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "From Me to You",
  description: "Coming June 1st, 2026",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative z-10`}>
        <HydroBackground />
        {children}
      </body>
    </html>
  );
}
