import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import SiteFooter from '@/components/SiteFooter'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FORMA Atlas - High-Throughput 4D MRI Platform',
  description: 'Four-dimensional Organoid Resonance Mapping Atlas - The largest longitudinal MRI dataset of human brain organoids',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}

