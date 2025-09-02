'use client'

import Link from 'next/link'
import Image from 'next/image'
import PublishToggle from './PublishToggle'

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
  createdAt: string
  updatedAt: string
  owner: {
    id: string
    email: string
    name?: string
  }
}

interface BeetleCardProps {
  beetle: Beetle
  showOwner?: boolean
  onTogglePublish?: (beetleId: string, isPublished: boolean) => void
}

export default function BeetleCard({ beetle, showOwner = false, onTogglePublish }: BeetleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-TW')
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row gap-4">
        {(beetle.imageUrl || beetle.imageData) && (
          <div className="flex-shrink-0">
            <Image
              src={beetle.imageData || beetle.imageUrl || ''}
              alt={beetle.species}
              width={200}
              height={150}
              className="rounded-lg object-cover"
            />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {beetle.species}
            </h3>
            {onTogglePublish && (
              <PublishToggle
                beetleId={beetle.id}
                isPublished={beetle.isPublished}
                onToggle={onTogglePublish}
              />
            )}
          </div>
          
          {beetle.lineage && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">血統：</span>
              {beetle.lineage}
            </p>
          )}
          
          {beetle.emergedAt && (
            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">羽化日期：</span>
              {formatDate(beetle.emergedAt)}
            </p>
          )}
          
          {beetle.isForSale && beetle.price && (
            <p className="text-sm text-beetle-600 font-medium mb-2">
              <span className="font-medium">售價：</span>
              NT$ {beetle.price.toLocaleString()}
            </p>
          )}
          
          {beetle.notes && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {beetle.notes}
            </p>
          )}
          
          {showOwner && (
            <p className="text-xs text-gray-500 mb-3">
              擁有者：{beetle.owner.name || beetle.owner.email}
            </p>
          )}
          
          <div className="flex gap-2">
            <Link
              href={`/beetle/${beetle.id}`}
              className="btn-primary text-sm"
            >
              查看詳情
            </Link>
            {!showOwner && (
              <Link
                href={`/beetles/${beetle.id}/edit`}
                className="btn-secondary text-sm"
              >
                編輯
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
