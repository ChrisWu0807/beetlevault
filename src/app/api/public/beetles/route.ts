import { NextRequest } from 'next/server'
import { publicBeetleQuerySchema } from '@/lib/validators'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = publicBeetleQuerySchema.parse({
      q: searchParams.get('q'),
      species: searchParams.get('species'),
      forSale: searchParams.get('forSale'),
      sort: searchParams.get('sort'),
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
    })

    const where: any = {
      isPublished: true,
    }

    // 關鍵字搜尋
    if (query.q) {
      where.OR = [
        { species: { contains: query.q } },
        { lineage: { contains: query.q } },
        { notes: { contains: query.q } },
      ]
    }

    // 品種篩選
    if (query.species) {
      where.species = { contains: query.species }
    }

    // 可購買篩選
    if (query.forSale === 'true') {
      where.isForSale = true
    } else if (query.forSale === 'false') {
      where.isForSale = false
    }

    // 排序
    let orderBy: any = { createdAt: 'desc' }
    if (query.sort === 'createdAt_asc') {
      orderBy = { createdAt: 'asc' }
    } else if (query.sort === 'species_asc') {
      orderBy = { species: 'asc' }
    }

    const beetles = await prisma.beetle.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy,
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    })

    const total = await prisma.beetle.count({ where })

    return Response.json({
      beetles,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: '查詢參數格式錯誤' } },
        { status: 400 }
      )
    }

    console.error('Get public beetles error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}
