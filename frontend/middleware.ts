import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // For server-side, we can't access localStorage, so we'll only check cookies
  // In a real app, you might store the token in cookies as well
  const token = request.cookies.get('authToken')?.value || null;

  // Define protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If user is trying to access a protected route without a token, redirect to signin
  if (isProtectedRoute && !token) {
    // Allow the request to continue but let client-side handle the redirect
    // This prevents server-side hanging
    return NextResponse.next();
  }

  // If user is signed in and tries to access auth pages, redirect to dashboard
  const authRoutes = ['/signin', '/signup'];
  const isAuthRoute = authRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (token && isAuthRoute) {
    // Allow the request to continue but let client-side handle the redirect
    return NextResponse.next();
  }

  return NextResponse.next();
}

// Specify the paths the middleware should run for
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};