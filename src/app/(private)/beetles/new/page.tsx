'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BeetleForm from '@/components/BeetleForm'
import { BeetleInput } from '@/lib/validators'

export default function NewBeetlePage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 檢查登入狀態
    fetch('/api/auth/me')
      .then(response => {
        if (!response.ok) {
          router.push('/sign-in')
        }
      })
      .catch(() => {
        router.push('/sign-in')
      })
  }, [router])

  const handleSubmit = async (data: BeetleInput) => {
    setLoading(true)
    try {
      const response = await fetch('/api/beetles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        const result = await response.json()
        alert(result.error?.message || '建立失敗')
      }
    } catch (error) {
      console.error('Failed to create beetle:', error)
      alert('建立失敗')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            新增甲蟲紀錄
          </h1>
          <p className="text-gray-600 mt-1">
            記錄你的甲蟲收藏詳細資訊
          </p>
        </div>

        <div className="card p-6">
          <BeetleForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  )
}
