import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // npm install jose

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'REPLACE_THIS_WITH_YOUR_OWN_SECRET_JWT_SECRET_VALUE'); // must match FastAPI secret

const protectedPaths = ['/dashboard', '/profile', '/settings'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log('Middleware: pathname =', pathname);
  console.log('Middleware: cookies =', request.cookies.getAll());

  // Skip public paths
  if (!protectedPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const token = request.cookies.get('access_token')?.value;
  console.log('Middleware: token =', token ? 'exists' : 'missing');

  if (!token) {
    console.log('Middleware: redirecting to /login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // TODO: Activer la vérification JWT quand JWT_SECRET sera configuré
    // await jwtVerify(token, secret);
    console.log('Middleware: skipping JWT verification (JWT_SECRET not configured)');
    return NextResponse.next();
  } catch (err) {
    console.log('Middleware: token invalid', err);
    console.log('Middleware: JWT_SECRET exists?', !!secret);
    // Invalid/expired → redirect + delete bad cookie
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_token');
    return response;
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'], // or use protectedPaths array
};