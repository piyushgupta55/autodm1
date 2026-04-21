import type { Metadata } from 'next'
import './globals.css'
import LayoutClient from '@/components/LayoutClient'

export const metadata: Metadata = {
  title: 'AutoDM | Turn Instagram comments into conversations',
  description: 'Automatically send direct messages when someone comments on your posts. Convert engagement into real conversations instantly.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  )
}
