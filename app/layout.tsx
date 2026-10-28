import type { Metadata } from 'next'
import { connection } from 'next/server'
import { fontVariables } from '@/lib/fonts'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'Cysters In Action', template: '%s · Cysters In Action' },
  description:
    'Support for people living with PMOS through health information, community and collective action.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // proxy.ts sets a per-request CSP nonce, and Next only applies it to the
  // scripts it injects during server rendering. Without this, pages are
  // prerendered at build time with no nonce and the browser blocks every script.
  await connection()
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
