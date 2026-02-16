import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple local auth check
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    
    // Allow public routes
    const publicRoutes = ['/', '/login', '/api'];
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    
    if (isPublicRoute) {
        return NextResponse.next();
    }
    
    // Check for auth cookie
    const authCookie = request.cookies.get('apex_auth');
    
    // For protected routes, check auth
    if (!authCookie) {
        // Redirect to login for protected routes
        const loginUrl = new URL('/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        '/(api|trpc)(.*)',
    ],
};
