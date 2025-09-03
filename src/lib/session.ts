import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './db'

export interface SessionUser {
  id: string
  email: string
  name?: string | null
}

export async function getSessionUser(request: NextRequest): Promise<SessionUser | null> {
  const sessionId = request.cookies.get('session')?.value
  
  if (!sessionId) {
    return null
  }

  try {
    // 簡化版：直接從 cookie 中解析用戶 ID
    // 在生產環境中，應該使用 JWT 或 Redis 存儲 session
    const userId = sessionId
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    return user
  } catch (error) {
    return null
  }
}

export function createSession(userId: string): NextResponse {
  const response = NextResponse.json({ success: true })
  
  // 簡化版：直接將用戶 ID 存到 cookie
  // 在生產環境中，應該使用 JWT 或 Redis
  response.cookies.set('session', userId, {
    httpOnly: true,
    secure: false, // 暫時設為 false 以解決 Zeabur 部署問題
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/', // 明確設置路徑
  })
  
  return response
}

export function clearSession(): NextResponse {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('session')
  return response
}
