import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login']
const PROTECTED_PATHS_REGEX = /^\/(?!api|_next\/static|_next\/image|favicon\.ico|Image|songs)/

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const isPublicPath = PUBLIC_PATHS.includes(path)

    // Early return for static assets and API routes
    if (!PROTECTED_PATHS_REGEX.test(path)) {
        return NextResponse.next()
    }

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    })

    // Handle public paths
    if (isPublicPath) {
        return token 
            ? NextResponse.redirect(new URL('/dashboard', request.url))
            : NextResponse.next()
    }

    // Handle protected paths
    if (!token) {
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('callbackUrl', path)
        return NextResponse.redirect(redirectUrl)
    }

    return NextResponse.next()
}

export const config = {
    matcher: [PROTECTED_PATHS_REGEX.source]
}