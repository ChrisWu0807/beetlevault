'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { beetleSchema, type BeetleInput } from '@/lib/validators'

interface BeetleFormProps {
  initialData?: Partial<BeetleInput>
  onSubmit: (data: BeetleInput) => Promise<void>
  loading?: boolean
}

export default function BeetleForm({ initialData, onSubmit, loading = false }: BeetleFormProps) {
  const [imageData, setImageData] = useState(initialData?.imageData || '')
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BeetleInput>({
    resolver: zodResolver(beetleSchema),
    defaultValues: {
      species: initialData?.species || '',
      lineage: initialData?.lineage || '',
      emergedAt: initialData?.emergedAt ? (typeof initialData.emergedAt === 'string' ? initialData.emergedAt.split('T')[0] : initialData.emergedAt.toISOString().split('T')[0]) : undefined,
      notes: initialData?.notes || '',
      isPublished: initialData?.isPublished || false,
      isForSale: initialData?.isForSale || false,
      price: initialData?.price || undefined,
    },
  })

  const isForSale = watch('isForSale')

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()
      if (response.ok) {
        setImageData(result.imageData)
        setValue('imageData', result.imageData)
      } else {
        alert(result.error?.message || '上傳失敗')
      }
    } catch (error) {
      alert('上傳失敗')
    } finally {
      setUploading(false)
    }
  }

  const handleFormSubmit = (data: any) => {
    // 修正日期格式
    if (data.emergedAt) {
      data.emergedAt = new Date(data.emergedAt).toISOString()
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6">
      <div>
        <label htmlFor="species" className="block text-sm font-medium text-gray-700">
          品種名稱 *
        </label>
        <input
          {...register('species')}
          type="text"
          className="input-field mt-1"
          placeholder="例如：獨角仙、鍬形蟲"
        />
        {errors.species && (
          <p className="mt-1 text-sm text-red-600">{errors.species.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="lineage" className="block text-sm font-medium text-gray-700">
          血統（選填）
        </label>
        <input
          {...register('lineage')}
          type="text"
          className="input-field mt-1"
          placeholder="血統資訊"
        />
        {errors.lineage && (
          <p className="mt-1 text-sm text-red-600">{errors.lineage.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="emergedAt" className="block text-sm font-medium text-gray-700">
          羽化日期（選填）
        </label>
        <input
          {...register('emergedAt')}
          type="date"
          className="input-field mt-1"
        />
        {errors.emergedAt && (
          <p className="mt-1 text-sm text-red-600">{errors.emergedAt.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          備註（選填）
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="input-field mt-1"
          placeholder="其他備註資訊"
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          照片（選填）
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="input-field"
        />
        {uploading && (
          <p className="mt-1 text-sm text-gray-500">上傳中...</p>
        )}
        {imageData && (
          <div className="mt-2">
            <img
              src={imageData}
              alt="預覽"
              className="w-32 h-24 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            {...register('isPublished')}
            type="checkbox"
            id="isPublished"
            className="h-4 w-4 text-beetle-600 focus:ring-beetle-500 border-gray-300 rounded"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
            上架到公開瀏覽
          </label>
        </div>

        <div className="flex items-center">
          <input
            {...register('isForSale')}
            type="checkbox"
            id="isForSale"
            className="h-4 w-4 text-beetle-600 focus:ring-beetle-500 border-gray-300 rounded"
          />
          <label htmlFor="isForSale" className="ml-2 block text-sm text-gray-700">
            開放購買
          </label>
        </div>

        {isForSale && (
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              價格（選填）
            </label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              min="0"
              className="input-field mt-1"
              placeholder="0"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? '儲存中...' : '儲存'}
        </button>
      </div>
    </form>
  )
}
