import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import QueryProvider from '../providers/QueryProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DApp Discovery Platform',
  description: 'Explore and discover decentralized applications across multiple blockchain networks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
