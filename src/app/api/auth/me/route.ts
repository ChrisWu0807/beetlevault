import { NextRequest } from 'next/server'
import { getSessionUser } from '@/lib/session'

export async function GET(request: NextRequest) {
  try {
    const user = await getSessionUser(request)
    
    if (!user) {
      return Response.json(
        { error: { code: 'UNAUTHORIZED', message: '請先登入' } },
        { status: 401 }
      )
    }

    return Response.json({ user })
  } catch (error) {
    console.error('Get user error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}
