import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import NavBar from '@/components/NavBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BeetleVault - 甲蟲庫',
  description: '甲蟲玩家的紀錄與展示平台',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>
        <NavBar />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  )
}
