import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Basic Auth Middleware for staging/demo protection
// Disable by removing BASIC_AUTH_USER and BASIC_AUTH_PASSWORD env vars

export function middleware(request: NextRequest) {
  const basicAuthUser = process.env.BASIC_AUTH_USER;
  const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD;

  // Skip auth if credentials not configured (e.g., in production)
  if (!basicAuthUser || !basicAuthPassword) {
    return NextResponse.next();
  }

  // Skip auth for health check and version endpoints (needed for monitoring)
  if (
    request.nextUrl.pathname === '/api/health' ||
    request.nextUrl.pathname === '/api/version'
  ) {
    return NextResponse.next();
  }

  // Check for Authorization header
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const authValue = authHeader.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    if (user === basicAuthUser && pwd === basicAuthPassword) {
      return NextResponse.next();
    }
  }

  // Return 401 with WWW-Authenticate header to trigger browser auth dialog
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Staging Area"',
    },
  });
}

// Apply to all routes except static files and API health endpoints
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
};
