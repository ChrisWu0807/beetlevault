import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const beetle = await prisma.beetle.findUnique({
      where: { 
        id: params.id,
        isPublished: true, // 只回傳已上架的甲蟲
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

    if (!beetle) {
      return Response.json(
        { error: { code: 'NOT_FOUND', message: '找不到此甲蟲紀錄或尚未上架' } },
        { status: 404 }
      )
    }

    return Response.json({ beetle })
  } catch (error) {
    console.error('Get public beetle error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}
