import "./globals.css";
import type { Metadata } from "next";
import { Gloria_Hallelujah } from "next/font/google";
import HydroBackground from "../components/backgrounds/HydroBackground";
import ClientFabsWrapper from "../components/backgrounds/ClientFabsWrapper";

const gloria = Gloria_Hallelujah({ 
  weight: "400",
  subsets: ["latin"],
  variable: "--font-gloria"
});

export const metadata: Metadata = {
  title: "From Me to You",
  description: "Proposal Website",
  icons: {
    icon: [{ url: "/favicon.ico", type: "image/x-icon", sizes: "any" }],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${gloria.variable} font-gloria relative z-10`}>
        <HydroBackground />
        <ClientFabsWrapper />
        {children}
      </body>
    </html>
  );
}
