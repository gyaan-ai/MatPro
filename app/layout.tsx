import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { OrganizationProvider } from '@/contexts/OrganizationContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'MatPro.ai - Wrestling Club Management',
  description: 'AI-powered wrestling club management platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <OrganizationProvider>{children}</OrganizationProvider>
      </body>
    </html>
  )
}
