'use client'

import { useState } from 'react'

interface PublishToggleProps {
  beetleId: string
  isPublished: boolean
  onToggle: (beetleId: string, isPublished: boolean) => void
}

export default function PublishToggle({ beetleId, isPublished, onToggle }: PublishToggleProps) {
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await onToggle(beetleId, !isPublished)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
        isPublished
          ? 'bg-green-100 text-green-800 hover:bg-green-200'
          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
      } disabled:opacity-50`}
    >
      {loading ? (
        <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
      ) : (
        <>
          <span className={`w-2 h-2 rounded-full mr-1 ${
            isPublished ? 'bg-green-500' : 'bg-gray-400'
          }`}></span>
          {isPublished ? '已上架' : '未上架'}
        </>
      )}
    </button>
  )
}
