import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wall Calendar',
  description: 'A beautiful wall calendar with seasonal themes',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}