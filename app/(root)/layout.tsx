import React, { ReactNode } from 'react'
import StreamVideoProvider from '@/providers/StreamClientProvider'
import { Metadata } from 'next';



export const metadata: Metadata = {
  title: "voom",
  description: "Video Calling app",
  icons: {
    icon: '/icons/logo.svg'
  },
};


export default function RootLayout({children}: {children: ReactNode}) {
  return (
    <main>
        <StreamVideoProvider>
            {children}
        </StreamVideoProvider>
    </main>
  )
}
