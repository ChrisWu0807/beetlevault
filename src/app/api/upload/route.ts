import { NextRequest } from 'next/server'
import { getSessionUser } from '@/lib/session'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: '請先登入' } },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: '請選擇檔案' } },
        { status: 400 }
      )
    }

    // 檢查檔案類型
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: '只支援 JPG、PNG、WebP 格式' } },
        { status: 400 }
      )
    }

    // 檢查檔案大小 (3MB)
    const maxSize = 3 * 1024 * 1024
    if (file.size > maxSize) {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: '檔案大小不能超過 3MB' } },
        { status: 400 }
      )
    }

    // 將檔案轉為 Base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    
    // 生成資料 URL
    const imageData = `data:${file.type};base64,${base64Data}`

    return Response.json({ imageData })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '上傳失敗' } },
      { status: 500 }
    )
  }
}
