import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Public routes that don't need auth
    if (
        pathname === '/' ||
        pathname.startsWith('/landing') ||
        pathname.startsWith('/api/')
    ) {
        return NextResponse.next();
    }

    // Check for auth token in cookies
    const token = request.cookies.get('auth-token')?.value;

    // Protected routes require auth
    if (pathname.startsWith('/dashboard') && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Auth route exceptions (logout & oauth callback)
    if (pathname.startsWith('/auth/logout') || pathname.startsWith('/auth/callback')) {
        return NextResponse.next();
    }

    // Auth routes redirect to dashboard if already authenticated
    if (pathname.startsWith('/auth') && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next/.*|favicon.ico|images/.*|assets/.*|fonts/.*).*)'],
};
