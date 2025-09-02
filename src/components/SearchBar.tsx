'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [species, setSpecies] = useState(searchParams.get('species') || '')
  const [forSale, setForSale] = useState(searchParams.get('forSale') || '')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    
    if (query) params.set('q', query)
    if (species) params.set('species', species)
    if (forSale) params.set('forSale', forSale)
    
    router.push(`/browse?${params.toString()}`)
  }

  const clearFilters = () => {
    setQuery('')
    setSpecies('')
    setForSale('')
    router.push('/browse')
  }

  return (
    <div className="card p-6 mb-6">
      <form onSubmit={handleSearch} className="space-y-4">
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
