// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
// import { jwtVerify } from 'jose'

// Define base protected routes
const protectedRoutes = {
    admin: '/admin',
    carer: '/carer',
    superadmin: '/superadmin'
}

// Function to get user role (mocked from cookies/localStorage/etc.)
function getUserRole(request: NextRequest): string | null {
    // Example: Extract role from cookie
    //   const role = 'admin'
    const role = request.cookies.get('role')?.value
    // const role = JSON.parse(localStorage.getItem('authDetails') || '')?.data?.user_type
    return role || null
}

// const checkTokenExpiry = (request: NextRequest) => {
//     const accessToken = request.cookies.get('accessToken')?.value
// }

// async function verifyToken(token: string): Promise<boolean> {
//     try {
//         const secret = new TextEncoder().encode(process.env.JWT_SECRET)
//         await jwtVerify(token, secret)
//         return true
//     } catch (e) {
//         return false
//     }
// }

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const role = getUserRole(request)

    // Only protect the 3 specific routes
    const isProtectedRoute = pathname.startsWith('/admin') || 
                           pathname.startsWith('/carer') || 
                           pathname.startsWith('/superadmin')

    // If not a protected route, allow access
    if (!isProtectedRoute) {
        return NextResponse.next()
    }

    // Allow public access to login pages
    if (
        pathname === '/admin/login' ||
        pathname === '/carer/login' ||
        pathname === '/superadmin/login'
    ) {
        return NextResponse.next()
    }

    // If no role, redirect to appropriate login page
    if (!role) {
        if (pathname.startsWith('/admin')) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        } else if (pathname.startsWith('/carer')) {
            return NextResponse.redirect(new URL('/carer/login', request.url))
        } else if (pathname.startsWith('/superadmin')) {
            return NextResponse.redirect(new URL('/superadmin/login', request.url))
        }
    }

    // Check if the path matches the user's role base route
    const allowedBasePath = protectedRoutes[role as keyof typeof protectedRoutes]

    if (!allowedBasePath || !pathname.startsWith(allowedBasePath)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
    }

    return NextResponse.next()
}


export const config = {
    matcher: ['/admin/:path*', '/carer/:path*', '/superadmin/:path*'],
}