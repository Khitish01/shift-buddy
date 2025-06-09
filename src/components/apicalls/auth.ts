// app/api/set-role-cookie/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function login(request: Request) {
    const body = await request.json()
    const role = body.role // e.g., 'admin'

    // ✅ Get cookies store (do NOT use await)
    const cookieStore = await cookies()

    // ✅ Set the cookie
    cookieStore.set('role', role, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    })

    return NextResponse.json({ success: true })
}