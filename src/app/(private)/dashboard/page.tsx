'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import BeetleCard from '@/components/BeetleCard'

interface Beetle {
  id: string
  species: string
  lineage?: string
  emergedAt?: string
  notes?: string
  imageUrl?: string
  imageData?: string
  isPublished: boolean
  isForSale: boolean
  price?: number
  stage: string
  larvaStage?: string
  gender?: string
  category: string
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    email: string
    name?: string
  }
}

interface User {
  id: string
  email: string
  name?: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [beetles, setBeetles] = useState<Beetle[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // 檢查用戶登入狀態
      const userResponse = await fetch('/api/auth/me')
      if (!userResponse.ok) {
        router.push('/sign-in')
        return
      }
      const userData = await userResponse.json()
      setUser(userData.user)

      // 獲取甲蟲列表
      const beetlesResponse = await fetch('/api/beetles')
      if (beetlesResponse.ok) {
        const beetlesData = await beetlesResponse.json()
        setBeetles(beetlesData.beetles)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTogglePublish = async (beetleId: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/beetles/${beetleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished }),
      })

      if (response.ok) {
        setBeetles(beetles.map(beetle => 
          beetle.id === beetleId 
            ? { ...beetle, isPublished }
            : beetle
        ))
      } else {
        alert('更新失敗')
      }
    } catch (error) {
      console.error('Failed to toggle publish:', error)
      alert('更新失敗')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            我的收藏室
          </h1>
          <p className="text-gray-600 mt-1">
            歡迎回來，{user?.name || user?.email}
          </p>
        </div>
        <Link href="/beetles/new" className="btn-primary">
          新增甲蟲
        </Link>
      </div>

      {beetles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🪲</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            還沒有甲蟲紀錄
          </h3>
          <p className="text-gray-600 mb-6">
            開始建立你的第一個甲蟲收藏紀錄吧！
          </p>
          <Link href="/beetles/new" className="btn-primary">
            新增第一隻甲蟲
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {beetles.map(beetle => (
            <BeetleCard
              key={beetle.id}
              beetle={beetle}
              onTogglePublish={handleTogglePublish}
            />
          ))}
        </div>
      )}
    </div>
  )
}
