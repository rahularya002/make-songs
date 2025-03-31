import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login']

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = PUBLIC_PATHS.includes(path)

    // Skip static assets and API routes
    if (path.startsWith('/api') || path.startsWith('/_next') || path.startsWith('/favicon.ico') || path.startsWith('/Image') || path.startsWith('/songs')) {
        return NextResponse.next()
    }

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    // Redirect authenticated users away from public paths
    if (isPublicPath) {
        return token 
            ? NextResponse.redirect(new URL('/dashboard', request.url))
            : NextResponse.next()
    }

    // Redirect unauthenticated users to login
    if (!token) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('callbackUrl', path)
        return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
}

// Use string-based matcher patterns
export const config = {
    matcher: ['/((?!api|_next|favicon.ico|Image|songs).*)']
}
