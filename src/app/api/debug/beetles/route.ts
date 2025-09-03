import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    console.log('Debug: Starting beetle query...')
    
    // 簡單查詢所有甲蟲
    const allBeetles = await prisma.beetle.findMany({
      select: {
        id: true,
        species: true,
        isPublished: true,
        stage: true,
        category: true,
        createdAt: true,
      }
    })
    
    console.log('Debug: Found beetles:', allBeetles.length)
    
    // 查詢已上架的甲蟲
    const publishedBeetles = await prisma.beetle.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
        species: true,
        isPublished: true,
        stage: true,
        category: true,
        createdAt: true,
      }
    })
    
    console.log('Debug: Found published beetles:', publishedBeetles.length)
    
    return Response.json({
      total: allBeetles.length,
      published: publishedBeetles.length,
      allBeetles,
      publishedBeetles,
    })
  } catch (error) {
    console.error('Debug error:', error)
    return Response.json(
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
