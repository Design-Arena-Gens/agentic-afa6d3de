import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SWE Performance Tracker',
  description: 'Track team performance, PR impact, and code metrics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  )
}
