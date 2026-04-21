import type { Metadata } from 'next'
import './globals.css'
import LayoutClient from '@/components/LayoutClient'

export const metadata: Metadata = {
  title: 'InstaAuto - Instagram Automation',
  description: 'Manage Instagram comment-to-DM automation with ease.',
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

