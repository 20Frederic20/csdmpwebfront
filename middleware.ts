import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // npm install jose

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'REPLACE_THIS_WITH_YOUR_OWN_SECRET_JWT_SECRET_VALUE'); // must match FastAPI secret

const protectedPaths = ['/dashboard', '/profile', '/settings'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Skip public paths
  if (!protectedPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    return NextResponse.next();
  } catch (err) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_token');
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'], // or use protectedPaths array
};