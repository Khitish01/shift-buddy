// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const protectedRoutes = {
    admin: ['/admin', '/admin/dashboard'],
    staff: ['/staff', '/staff/dashboard'],
    superadmin: ['/superadmin'],
}

// Function to get user role (mocked from cookies/localStorage/etc.)
function getUserRole(request: NextRequest): string | null {
    // Example: Extract role from cookie
      const role = request.cookies.get('role')?.value
    // const role = JSON.parse(localStorage.getItem('authDetails') || '')?.data?.user_type
    return role || null
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const role = getUserRole(request)

    // Skip checks for static files, API, etc.
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next()
    }

    // If no role, redirect to login
    if (!role) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    // Check if the path is allowed for the user's role
    const allowedPaths = protectedRoutes[role as keyof typeof protectedRoutes] || []

    const isAllowed = allowedPaths.some(path => pathname.startsWith(path))

    if (!isAllowed) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return NextResponse.next()
}


export const config = {
    matcher: ['/admin/:path*', '/staff/:path*', '/superadmin/:path*'],
}