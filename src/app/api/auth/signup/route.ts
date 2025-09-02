import { NextRequest } from 'next/server'
import { signUpSchema } from '@/lib/validators'
import { createUser, getUserByEmail } from '@/lib/auth'
import { createSession } from '@/lib/session'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = signUpSchema.parse(body)

    // 檢查用戶是否已存在
    const existingUser = await getUserByEmail(email)
    if (existingUser) {
      return Response.json(
        { error: { code: 'USER_EXISTS', message: '此電子郵件已被註冊' } },
        { status: 400 }
      )
    }

    // 建立新用戶
    const user = await createUser(email, password, name)

    // 建立 session
    const response = createSession(user.id)
    response.headers.set('Content-Type', 'application/json')
    
    return new Response(JSON.stringify({ user }), {
      status: 201,
      headers: response.headers,
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return Response.json(
        { error: { code: 'VALIDATION_ERROR', message: '輸入資料格式錯誤' } },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}
