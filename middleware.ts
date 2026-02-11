import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/dashboard', '/profile', '/settings'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip public paths
  if (!protectedPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/profile/:path*', '/settings/:path*'],
};