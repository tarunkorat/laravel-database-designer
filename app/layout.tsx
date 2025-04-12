import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Migrator Pro - The Laravel Migration Tool',
  description: 'Laravel Migration Designer',
  generator: 'Tarun Korat',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
