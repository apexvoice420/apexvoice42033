import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes that require authentication
const protectedPaths = ['/dashboard', '/workflows']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Check if trying to access protected route
    const isProtected = protectedPaths.some(path => pathname.startsWith(path))

    if (isProtected) {
        // Check for auth token in cookies
        const authToken = request.cookies.get('apex_auth')?.value

        if (!authToken) {
            // Redirect to login
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('redirect', pathname)
            return NextResponse.redirect(loginUrl)
        }

        try {
            // Decode and validate token
            const decoded = Buffer.from(authToken, 'base64').toString()
            const auth = JSON.parse(decoded)

            // Check if token is expired (24 hour expiry)
            if (auth.expires && Date.now() > auth.expires) {
                const loginUrl = new URL('/login', request.url)
                loginUrl.searchParams.set('redirect', pathname)
                return NextResponse.redirect(loginUrl)
            }
        } catch {
            // Invalid token - redirect to login
            const loginUrl = new URL('/login', request.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         * - api routes
         */
        '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
    ],
}
