import { NextRequest } from 'next/server'
import { beetleSchema } from '@/lib/validators'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function POST(request: NextRequest) {
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

    const beetle = await prisma.beetle.create({
      data: {
        ...data,
        ownerId: user.id,
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

    return Response.json({ beetle }, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: '輸入資料格式錯誤' } },
        { status: 400 }
      )
    }

    console.error('Create beetle error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    if (!user) {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: '請先登入' } },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    const beetles = await prisma.beetle.findMany({
      where: {
        ownerId: user.id,
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
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    const total = await prisma.beetle.count({
      where: {
        ownerId: user.id,
      },
    })

    return Response.json({
      beetles,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Get beetles error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}
