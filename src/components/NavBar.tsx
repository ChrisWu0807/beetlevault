'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name?: string
}

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-beetle-600">
              BeetleVault
            </Link>
            <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-beetle-600">
            BeetleVault
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/browse" className="text-gray-600 hover:text-beetle-600">
              瀏覽收藏
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="text-gray-600 hover:text-beetle-600">
                  我的收藏室
                </Link>
                <span className="text-sm text-gray-500">
                  {user.name || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-beetle-600"
                >
                  登出
                </button>
              </>
            ) : (
              <>
                <Link href="/sign-in" className="text-gray-600 hover:text-beetle-600">
                  登入
                </Link>
                <Link href="/sign-up" className="btn-primary">
                  註冊
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
