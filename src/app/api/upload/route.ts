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

    // 生成檔案名稱
    const fileExtension = file.name.split('.').pop()
    const fileName = `${randomUUID()}.${fileExtension}`
    
    // 確保上傳目錄存在
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // 目錄可能已存在，忽略錯誤
    }

    // 儲存檔案
    const filePath = join(uploadDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    await writeFile(filePath, buffer)

    const imageUrl = `/uploads/${fileName}`

    return Response.json({ imageUrl })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '上傳失敗' } },
      { status: 500 }
    )
  }
}
