import { NextRequest } from 'next/server'
import { signInSchema } from '@/lib/validators'
import { getUserByEmail, verifyPassword } from '@/lib/auth'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = signInSchema.parse(body)

    // 查找用戶
    const user = await getUserByEmail(email)
    if (!user) {
      return Response.json(
        { error: { code: 'INVALID_CREDENTIALS', message: '電子郵件或密碼錯誤' } },
        { status: 401 }
      )
    }

    // 驗證密碼
    const isValidPassword = await verifyPassword(password, user.passwordHash)
    if (!isValidPassword) {
      return Response.json(
        { error: { code: 'INVALID_CREDENTIALS', message: '電子郵件或密碼錯誤' } },
        { status: 401 }
      )
    }

    // 建立 session
    const response = createSession(user.id)
    
    // 直接返回帶有 cookie 的響應
    return new Response(JSON.stringify({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': response.headers.get('Set-Cookie') || '',
      },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: '輸入資料格式錯誤' } },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}
