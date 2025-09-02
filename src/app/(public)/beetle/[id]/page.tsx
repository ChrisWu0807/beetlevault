'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

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

export default function BeetleDetailPage() {
  const [beetle, setBeetle] = useState<Beetle | null>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    fetchBeetle()
  }, [params.id])

  const fetchBeetle = async () => {
    try {
      const response = await fetch(`/api/public/beetles/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setBeetle(data.beetle)
      } else if (response.status === 404) {
        router.push('/browse')
      } else {
        console.error('Failed to fetch beetle')
      }
    } catch (error) {
      console.error('Failed to fetch beetle:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
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
          <p className="text-gray-600 mb-6">
            此甲蟲可能尚未上架或已被移除
          </p>
          <Link href="/browse" className="btn-primary">
            瀏覽其他收藏
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/browse" className="text-beetle-600 hover:text-beetle-700">
            ← 返回瀏覽
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {(beetle.imageUrl || beetle.imageData) && (
            <div className="space-y-4">
              <Image
                src={beetle.imageData || beetle.imageUrl || ''}
                alt={beetle.species}
                width={500}
                height={400}
                className="rounded-lg object-cover w-full"
              />
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {beetle.species}
              </h1>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {beetle.category === 'rhinoceros' ? '兜蟲' : '鍬形蟲'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {beetle.stage === 'larva' ? `幼蟲 ${beetle.larvaStage || ''}` : `成蟲 ${beetle.gender === 'male' ? '公' : beetle.gender === 'female' ? '母' : ''}`}
                </span>
                {beetle.isPublished && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    已上架
                  </span>
                )}
                {beetle.isForSale && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    可購買
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {beetle.lineage && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">血統</h3>
                  <p className="text-gray-900">{beetle.lineage}</p>
                </div>
              )}

              {beetle.emergedAt && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">羽化日期</h3>
                  <p className="text-gray-900">{formatDate(beetle.emergedAt)}</p>
                </div>
              )}

              {beetle.isForSale && beetle.price && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">價格</h3>
                  <p className="text-2xl font-bold text-beetle-600">
                    NT$ {beetle.price.toLocaleString()}
                  </p>
                </div>
              )}

              {beetle.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-1">備註</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{beetle.notes}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">擁有者</h3>
                <p className="text-gray-900">
                  {beetle.owner.name || beetle.owner.email}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">建立時間</h3>
                <p className="text-gray-900">{formatDate(beetle.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
