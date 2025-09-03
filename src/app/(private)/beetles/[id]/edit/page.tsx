'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import BeetleForm from '@/components/BeetleForm'
import { BeetleInput } from '@/lib/validators'

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
  size?: string
  generation?: string
  feedingDate?: string
  weight?: number
  records?: any[]
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    email: string
    name?: string
  }
}

export default function EditBeetlePage() {
  const [beetle, setBeetle] = useState<Beetle | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    fetchBeetle()
  }, [params.id])

  const fetchBeetle = async () => {
    try {
      const response = await fetch(`/api/beetles/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setBeetle(data.beetle)
      } else if (response.status === 404) {
        router.push('/dashboard')
      } else if (response.status === 401) {
        router.push('/sign-in')
      } else {
        alert('載入失敗')
      }
    } catch (error) {
      console.error('Failed to fetch beetle:', error)
      alert('載入失敗')
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (data: BeetleInput) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/beetles/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        const result = await response.json()
        alert(result.error?.message || '更新失敗')
      }
    } catch (error) {
      console.error('Failed to update beetle:', error)
      alert('更新失敗')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!beetle) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            找不到此甲蟲紀錄
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            返回收藏室
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            編輯甲蟲紀錄
          </h1>
          <p className="text-gray-600 mt-1">
            更新 {beetle.species} 的資訊
          </p>
        </div>

        <div className="card p-6">
          <BeetleForm
            initialData={{
              species: beetle.species,
              lineage: beetle.lineage || '',
              emergedAt: beetle.emergedAt ? beetle.emergedAt : undefined,
              notes: beetle.notes || '',
              imageUrl: beetle.imageUrl || '',
              imageData: beetle.imageData || '',
              isPublished: beetle.isPublished,
              isForSale: beetle.isForSale,
              price: beetle.price,
              stage: beetle.stage as "adult" | "larva" | "egg",
              larvaStage: beetle.larvaStage as "L1" | "L2" | "L3" | undefined,
              gender: beetle.gender as "male" | "female" | undefined,
              category: beetle.category as "rhinoceros" | "stag",
              size: (beetle as any).size || '',
              generation: (beetle as any).generation,
              feedingDate: (beetle as any).feedingDate,
              weight: (beetle as any).weight,
              records: (beetle as any).records || [],
            }}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}
