import { NextResponse } from 'next/server'

export function middleware() {
  return NextResponse.redirect('https://holidaybrand.co', 301)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
