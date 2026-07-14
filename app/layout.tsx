import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'

import "@stream-io/video-react-sdk/dist/css/styles.css";
import 'react-datepicker/dist/react-datepicker.css'

import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "voom",
  description: "Video Calling app",
  icons: {
    icon: '/icons/logo.svg'
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: '/icons/yoom-logo.svg',
          socialButtonsVariant: 'iconButton'
        },
        variables: {
          colorText: '#fff',
          colorPrimary: "#0E78F9",
          colorBackground: '#1c1f2e',
          colorInputBackground: '#252a41',
          colorInputText: '#fff'
        }
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-darks-2`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
