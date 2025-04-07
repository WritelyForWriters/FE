import { NextRequest, NextResponse } from 'next/server'

// 로그인 전 허용 경로
const ALLOWED_BEFORE_LOGIN_PATHS = ['/login', '/join', '/change-password', '/find-password']

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value
  const { pathname } = request.nextUrl

  if (isLoggedIn && ALLOWED_BEFORE_LOGIN_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}
