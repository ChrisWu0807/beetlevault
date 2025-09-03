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
    control,
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
      stage: initialData?.stage || 'adult',
      larvaStage: initialData?.larvaStage || undefined,
      gender: initialData?.gender || undefined,
      category: initialData?.category || 'rhinoceros',
      size: initialData?.size || '',
      generation: initialData?.generation || undefined,
      feedingDate: initialData?.feedingDate ? (typeof initialData.feedingDate === 'string' ? initialData.feedingDate.split('T')[0] : initialData.feedingDate.toISOString().split('T')[0]) : undefined,
      weight: initialData?.weight || undefined,
      records: initialData?.records || [],
    },
  })

  const isForSale = watch('isForSale')
  const stage = watch('stage')
  const [records, setRecords] = useState(initialData?.records || [])

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
        console.log('圖片上傳成功')
      } else {
        console.error('上傳失敗:', result.error?.message)
        alert(result.error?.message || '上傳失敗')
        // 清空檔案輸入
        event.target.value = ''
      }
    } catch (error) {
      console.error('上傳錯誤:', error)
      alert('上傳失敗')
      // 清空檔案輸入
      event.target.value = ''
    } finally {
      setUploading(false)
    }
  }

  // 紀錄檔處理函數
  const addRecord = () => {
    setRecords([...records, { stage: undefined, date: '', weight: undefined }])
  }

  const removeRecord = (index: number) => {
    setRecords(records.filter((_, i) => i !== index))
  }

  const updateRecord = (index: number, field: string, value: any) => {
    const newRecords = [...records]
    newRecords[index] = { ...newRecords[index], [field]: value }
    setRecords(newRecords)
  }

  const handleFormSubmit = (data: any) => {
    // 修正日期格式
    if (data.emergedAt && data.emergedAt.trim() !== '') {
      data.emergedAt = new Date(data.emergedAt).toISOString()
    } else {
      data.emergedAt = null
    }

    // 修正開吃日期格式
    if (data.feedingDate && data.feedingDate.trim() !== '') {
      data.feedingDate = new Date(data.feedingDate).toISOString()
    } else {
      data.feedingDate = null
    }

    // 添加紀錄檔資料
    data.records = records

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
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          物種分類 *
        </label>
        <select
          {...register('category')}
          className="input-field mt-1"
        >
          <option value="rhinoceros">兜蟲</option>
          <option value="stag">鍬形蟲</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="stage" className="block text-sm font-medium text-gray-700">
          階段 *
        </label>
        <select
          {...register('stage')}
          className="input-field mt-1"
        >
          <option value="adult">成蟲</option>
          <option value="larva">幼蟲</option>
          <option value="egg">卵期</option>
        </select>
        {errors.stage && (
          <p className="mt-1 text-sm text-red-600">{errors.stage.message}</p>
        )}
      </div>

      {stage === 'larva' && (
        <div>
          <label htmlFor="larvaStage" className="block text-sm font-medium text-gray-700">
            幼蟲階段 *
          </label>
          <select
            {...register('larvaStage')}
            className="input-field mt-1"
          >
            <option value="">請選擇階段</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="unknown">不明</option>
          </select>
          {errors.larvaStage && (
            <p className="mt-1 text-sm text-red-600">{errors.larvaStage.message}</p>
          )}
        </div>
      )}

      {stage === 'adult' && (
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            性別 *
          </label>
          <select
            {...register('gender')}
            className="input-field mt-1"
          >
            <option value="">請選擇性別</option>
            <option value="male">公</option>
            <option value="female">母</option>
          </select>
          {errors.gender && (
            <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
          )}
        </div>
      )}

      {/* 成蟲專用欄位 */}
      {stage === 'adult' && (
        <>
          <div>
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              尺寸（選填）
            </label>
            <input
              {...register('size')}
              type="text"
              className="input-field mt-1"
              placeholder="例如：86mm 或 all size"
            />
            {errors.size && (
              <p className="mt-1 text-sm text-red-600">{errors.size.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="generation" className="block text-sm font-medium text-gray-700">
              累代（選填）
            </label>
            <select
              {...register('generation')}
              className="input-field mt-1"
            >
              <option value="">請選擇累代</option>
              <option value="cbf1">CBF1</option>
              <option value="cbf2">CBF2</option>
              <option value="cbf3">CBF3</option>
              <option value="cbf4">CBF4</option>
              <option value="cbf5">CBF5</option>
              <option value="cbf5+">CBF5+</option>
              <option value="wd1">WD1</option>
              <option value="wd2">WD2</option>
              <option value="unknown">不明</option>
            </select>
            {errors.generation && (
              <p className="mt-1 text-sm text-red-600">{errors.generation.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="feedingDate" className="block text-sm font-medium text-gray-700">
              開吃日期（選填）
            </label>
            <input
              {...register('feedingDate')}
              type="date"
              className="input-field mt-1"
            />
            {errors.feedingDate && (
              <p className="mt-1 text-sm text-red-600">{errors.feedingDate.message}</p>
            )}
          </div>
        </>
      )}

      {/* 幼蟲專用欄位 */}
      {stage === 'larva' && (
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
            重量（選填）
          </label>
          <input
            {...register('weight', { valueAsNumber: true })}
            type="number"
            step="0.1"
            className="input-field mt-1"
            placeholder="重量 (g)"
          />
          {errors.weight && (
            <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
          )}
        </div>
      )}

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

      {/* 羽化日期 - 只有成蟲和卵期顯示 */}
      {(stage === 'adult' || stage === 'egg') && (
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
      )}

      {/* 幼蟲紀錄檔 */}
      {stage === 'larva' && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              紀錄檔（選填）
            </label>
            <button
              type="button"
              onClick={addRecord}
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              新增紀錄
            </button>
          </div>
          
          {records.map((record, index) => (
            <div key={index} className="grid grid-cols-3 gap-2 mb-2">
              <select
                value={record.stage || ''}
                onChange={(e) => updateRecord(index, 'stage', e.target.value)}
                className="input-field"
              >
                <option value="">階段</option>
                <option value="egg">卵</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
              </select>
              
              <input
                type="date"
                value={record.date ? (typeof record.date === 'string' ? record.date : record.date.toISOString().split('T')[0]) : ''}
                onChange={(e) => updateRecord(index, 'date', e.target.value)}
                className="input-field"
                placeholder="日期"
              />
              
              <div className="flex gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={record.weight || ''}
                  onChange={(e) => updateRecord(index, 'weight', parseFloat(e.target.value) || undefined)}
                  className="input-field flex-1"
                  placeholder="重量(g)"
                />
                <button
                  type="button"
                  onClick={() => removeRecord(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
