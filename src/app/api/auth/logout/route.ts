import { clearSession } from '@/lib/session'

export async function POST() {
  try {
    const response = clearSession()
    response.headers.set('Content-Type', 'application/json')
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: response.headers,
    })
  } catch (error) {
    console.error('Logout error:', error)
    return Response.json(
      { error: { code: 'INTERNAL_ERROR', message: '伺服器錯誤' } },
      { status: 500 }
    )
  }
}
