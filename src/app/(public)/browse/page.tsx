'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import BeetleCard from '@/components/BeetleCard'
import SearchBar from '@/components/SearchBar'

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

export default function BrowsePage() {
  const [beetles, setBeetles] = useState<Beetle[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  })
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchBeetles()
  }, [searchParams])

  const fetchBeetles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams(searchParams.toString())
      const response = await fetch(`/api/public/beetles?${params.toString()}`)
      
      if (response.ok) {
        const data = await response.json()
        setBeetles(data.beetles)
        setPagination(data.pagination)
      } else {
        console.error('Failed to fetch beetles')
      }
    } catch (error) {
      console.error('Failed to fetch beetles:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          公開收藏瀏覽
        </h1>
        <p className="text-gray-600 mt-1">
          探索其他玩家的甲蟲收藏
        </p>
      </div>

      <SearchBar />

      {beetles.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            沒有找到符合條件的甲蟲
          </h3>
          <p className="text-gray-600">
            試試調整搜尋條件或瀏覽所有收藏
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              找到 {pagination.total} 筆紀錄，第 {pagination.page} 頁，共 {pagination.totalPages} 頁
            </p>
          </div>
          
          <div className="space-y-6">
            {beetles.map(beetle => (
              <BeetleCard
                key={beetle.id}
                beetle={beetle}
                showOwner={true}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex gap-2">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => {
                      const params = new URLSearchParams(searchParams.toString())
                      params.set('page', page.toString())
                      window.location.href = `/browse?${params.toString()}`
                    }}
                    className={`px-3 py-2 rounded ${
                      page === pagination.page
                        ? 'bg-beetle-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
