'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [species, setSpecies] = useState(searchParams.get('species') || '')
  const [forSale, setForSale] = useState(searchParams.get('forSale') || '')
  const [stage, setStage] = useState(searchParams.get('stage') || '')
  const [larvaStage, setLarvaStage] = useState(searchParams.get('larvaStage') || '')
  const [gender, setGender] = useState(searchParams.get('gender') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [emergedFrom, setEmergedFrom] = useState(searchParams.get('emergedFrom') || '')
  const [emergedTo, setEmergedTo] = useState(searchParams.get('emergedTo') || '')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (query) params.set('q', query)
    if (species) params.set('species', species)
    if (forSale) params.set('forSale', forSale)
    if (stage) params.set('stage', stage)
    if (larvaStage) params.set('larvaStage', larvaStage)
    if (gender) params.set('gender', gender)
    if (category) params.set('category', category)
    if (emergedFrom) params.set('emergedFrom', emergedFrom)
    if (emergedTo) params.set('emergedTo', emergedTo)
    
    router.push(`/browse?${params.toString()}`)
  }

  const clearFilters = () => {
    setQuery('')
    setSpecies('')
    setForSale('')
    setStage('')
    setLarvaStage('')
    setGender('')
    setCategory('')
    setEmergedFrom('')
    setEmergedTo('')
    router.push('/browse')
  }

  return (
    <div className="card p-6 mb-6">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* 基本搜尋 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-1">
              關鍵字搜尋
            </label>
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋品種、血統、備註..."
              className="input-field"
            />
          </div>
          
          <div>
            <label htmlFor="species" className="block text-sm font-medium text-gray-700 mb-1">
              品種篩選
            </label>
            <input
              type="text"
              id="species"
              value={species}
              onChange={(e) => setSpecies(e.target.value)}
              placeholder="例如：獨角仙"
              className="input-field"
            />
          </div>
          
          <div>
            <label htmlFor="forSale" className="block text-sm font-medium text-gray-700 mb-1">
              購買狀態
            </label>
            <select
              id="forSale"
              value={forSale}
              onChange={(e) => setForSale(e.target.value)}
              className="input-field"
            >
              <option value="">全部</option>
              <option value="true">可購買</option>
              <option value="false">僅展示</option>
            </select>
          </div>
        </div>

        {/* 進階篩選按鈕 */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-beetle-600 hover:text-beetle-700 font-medium"
          >
            {showAdvanced ? '隱藏進階篩選' : '顯示進階篩選'}
          </button>
        </div>

        {/* 進階篩選 */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  物種分類
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                >
                  <option value="">全部</option>
                  <option value="rhinoceros">兜蟲</option>
                  <option value="stag">鍬形蟲</option>
                </select>
              </div>

              <div>
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-1">
                  階段
                </label>
                <select
                  id="stage"
                  value={stage}
                  onChange={(e) => {
                    setStage(e.target.value)
                    // 清除相關的篩選條件
                    if (e.target.value !== 'larva') setLarvaStage('')
                    if (e.target.value !== 'adult') setGender('')
                  }}
                  className="input-field"
                >
                  <option value="">全部</option>
                  <option value="adult">成蟲</option>
                  <option value="larva">幼蟲</option>
                </select>
              </div>

              {stage === 'larva' && (
                <div>
                  <label htmlFor="larvaStage" className="block text-sm font-medium text-gray-700 mb-1">
                    幼蟲階段
                  </label>
                  <select
                    id="larvaStage"
                    value={larvaStage}
                    onChange={(e) => setLarvaStage(e.target.value)}
                    className="input-field"
                  >
                    <option value="">全部</option>
                    <option value="L1">L1</option>
                    <option value="L2">L2</option>
                    <option value="L3">L3</option>
                  </select>
                </div>
              )}

              {stage === 'adult' && (
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    性別
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="input-field"
                  >
                    <option value="">全部</option>
                    <option value="male">公</option>
                    <option value="female">母</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emergedFrom" className="block text-sm font-medium text-gray-700 mb-1">
                  羽化日期（開始）
                </label>
                <input
                  type="date"
                  id="emergedFrom"
                  value={emergedFrom}
                  onChange={(e) => setEmergedFrom(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label htmlFor="emergedTo" className="block text-sm font-medium text-gray-700 mb-1">
                  羽化日期（結束）
                </label>
                <input
                  type="date"
                  id="emergedTo"
                  value={emergedTo}
                  onChange={(e) => setEmergedTo(e.target.value)}
                  className="input-field"
                />
              </div>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <button type="submit" className="btn-primary">
            搜尋
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="btn-secondary"
          >
            清除篩選
          </button>
        </div>
      </form>
    </div>
  )
}
