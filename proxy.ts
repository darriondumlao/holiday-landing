/**
 * Next.js 16 Proxy
 *
 * Redirects all traffic to holidaybrand.co
 */

import { NextResponse, NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  return NextResponse.redirect('https://holidaybrand.co', 301)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
