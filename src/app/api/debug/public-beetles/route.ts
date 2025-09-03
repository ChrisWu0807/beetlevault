import { NextRequest } from 'next/server'
import { publicBeetleQuerySchema } from '@/lib/validators'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('Debug: Starting public beetles query...')
    
    const { searchParams } = new URL(request.url)
    console.log('Debug: Search params:', Object.fromEntries(searchParams.entries()))
    
    const query = publicBeetleQuerySchema.parse({
      q: searchParams.get('q'),
      species: searchParams.get('species'),
      forSale: searchParams.get('forSale'),
      sort: searchParams.get('sort'),
      page: searchParams.get('page'),
      pageSize: searchParams.get('pageSize'),
      stage: searchParams.get('stage'),
      larvaStage: searchParams.get('larvaStage'),
      gender: searchParams.get('gender'),
      category: searchParams.get('category'),
      emergedFrom: searchParams.get('emergedFrom'),
      emergedTo: searchParams.get('emergedTo'),
    })
    
    console.log('Debug: Parsed query:', query)

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

    // 階段篩選
    if (query.stage) {
      where.stage = query.stage
    }

    // 幼蟲階段篩選
    if (query.larvaStage) {
      where.larvaStage = query.larvaStage
    }

    // 性別篩選
    if (query.gender) {
      where.gender = query.gender
    }

    // 物種分類篩選
    if (query.category) {
      where.category = query.category
    }

    // 羽化日期範圍篩選
    if (query.emergedFrom || query.emergedTo) {
      where.emergedAt = {}
      if (query.emergedFrom) {
        where.emergedAt.gte = new Date(query.emergedFrom)
      }
      if (query.emergedTo) {
        where.emergedAt.lte = new Date(query.emergedTo)
      }
    }

    console.log('Debug: Final where clause:', JSON.stringify(where, null, 2))

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

    console.log('Debug: Found beetles:', beetles.length, 'Total:', total)

    return Response.json({
      query,
      where,
      beetles,
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        total,
        totalPages: Math.ceil(total / query.pageSize),
      },
    })
  } catch (error) {
    console.error('Debug public beetles error:', error)
    return Response.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
