import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

// 需要認證的路徑
const protectedPaths = [
  '/dashboard',
  '/profile',
  '/admin',
]

// 不需要認證的路徑
const publicPaths = [
  '/login',
  '/api/auth/login',
  '/api/auth/register',
]

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 檢查是否是公開路徑
  if (publicPaths.some(p => path.startsWith(p))) {
    return NextResponse.next()
  }

  // 檢查是否是受保護路徑
  if (protectedPaths.some(p => path.startsWith(p))) {
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
      // 基本的 JWT 驗證
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
      const { payload } = await jwtVerify(token, secret)
      
      if (!payload) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      // 檢查管理員路徑
      if (path.startsWith('/admin') && payload.role !== 'store_owner' && payload.role !== 'vendor') {
        return NextResponse.redirect(new URL('/', request.url))
      }

      return NextResponse.next()
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有請求路徑，除了：
     * - _next/static (靜態文件)
     * - _next/image (圖片優化)
     * - favicon.ico (瀏覽器圖標)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 