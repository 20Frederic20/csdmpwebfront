import { NextRequest, NextResponse } from 'next/server';

const protectedPaths = ['/dashboard', '/profile', '/settings'];
const authApiPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/refresh', '/api/auth/me'];
const authPages = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;

  // Ne pas intercepter les routes API d'authentification
  const isAuthApiPath = authApiPaths.some(p => pathname.startsWith(p));
  if (isAuthApiPath) {
    return NextResponse.next();
  }

  // Ne pas intercepter les pages d'authentification (login/register)
  const isAuthPage = authPages.some(p => pathname === p || pathname.startsWith(p + '/'));
  if (isAuthPage) {
    return NextResponse.next();
  }

  // Ajouter le token d'accès dans l'en-tête Authorization pour les autres requêtes API
  if (pathname.startsWith('/api/')) {
    const requestHeaders = new Headers(request.headers);
    if (accessToken) {
      requestHeaders.set('Authorization', `Bearer ${accessToken}`);
    }

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Vérifier si le chemin est protégé
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

  // Si chemin protégé et pas de token -> redirect vers login
  if (isProtectedPath && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard',
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/api/:path*',
    // Exclure les routes statiques et next
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};