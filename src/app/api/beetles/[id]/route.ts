import { NextRequest } from 'next/server'
import { beetleSchema } from '@/lib/validators'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: '請先登入' } },
        { status: 401 }
      )
    }

    const beetle = await prisma.beetle.findUnique({
      where: { id: params.id },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    if (!beetle) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: '找不到此甲蟲紀錄' } },
        { status: 404 }
      )
    }

    if (beetle.ownerId !== user.id) {
      return Response.json(
        { error: { code: 'FORBIDDEN', message: '無權限存取此紀錄' } },
        { status: 403 }
      )
    }

    return Response.json({ beetle })
  } catch (error) {
    console.error('Get beetle error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: '請先登入' } },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = beetleSchema.parse(body)

    // 檢查甲蟲是否存在且屬於當前用戶
    const existingBeetle = await prisma.beetle.findUnique({
      where: { id: params.id },
    })

    if (!existingBeetle) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: '找不到此甲蟲紀錄' } },
        { status: 404 }
      )
    }

    if (existingBeetle.ownerId !== user.id) {
      return Response.json(
        { error: { code: 'FORBIDDEN', message: '無權限修改此紀錄' } },
        { status: 403 }
      )
    }

    const beetle = await prisma.beetle.update({
      where: { id: params.id },
      data: {
        ...data,
        imageUrl: data.imageUrl || null,
      },
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    })

    return Response.json({ beetle })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: '輸入資料格式錯誤' } },
        { status: 400 }
      )
    }

    console.error('Update beetle error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: '請先登入' } },
        { status: 401 }
      )
    }

    // 檢查甲蟲是否存在且屬於當前用戶
    const existingBeetle = await prisma.beetle.findUnique({
      where: { id: params.id },
    })

    if (!existingBeetle) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: '找不到此甲蟲紀錄' } },
        { status: 404 }
      )
    }

    if (existingBeetle.ownerId !== user.id) {
      return Response.json(
        { error: { code: 'FORBIDDEN', message: '無權限刪除此紀錄' } },
        { status: 403 }
      )
    }

    await prisma.beetle.delete({
      where: { id: params.id },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error('Delete beetle error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}
