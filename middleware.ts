/**
 * Next.js Middleware for Authentication and Route Protection
 * Runs on the edge before pages load
 */

import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define protected routes
const ADMIN_ROUTES = [
  '/admin',
  '/admin/products',
  '/admin/orders', 
  '/admin/customers',
  '/admin/analytics'
]

const PROTECTED_ROUTES = [
  '/profile',
  '/orders',
  '/wishlist'
]

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()
  const pathname = req.nextUrl.pathname

  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    // Get session
    const { data: { session }, error } = await supabase.auth.getSession()

    console.log('🔍 Middleware check:', {
      pathname,
      hasSession: !!session,
      userEmail: session?.user?.email
    })

    // Check if route requires authentication
    const requiresAuth = PROTECTED_ROUTES.some(route => pathname.startsWith(route))
    const requiresAdmin = ADMIN_ROUTES.some(route => pathname.startsWith(route))

    // If no session and route requires auth, redirect to login
    if ((requiresAuth || requiresAdmin) && !session) {
      console.log('❌ No session, redirecting to login')
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/auth'
      redirectUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // If admin route required, check admin status
    if (requiresAdmin && session) {
      console.log('🔐 Admin route accessed, checking permissions...')
      
      try {
        const { data: adminData, error: adminError } = await supabase
          .from('admin_users')
          .select('role')
          .eq('id', session.user.id)
          .single()

        const isAdmin = adminData?.role === 'admin' || adminData?.role === 'shop_owner'
        
        console.log('👤 Admin check result:', {
          isAdmin,
          role: adminData?.role,
          error: adminError?.message
        })

        if (!isAdmin) {
          console.log('❌ Not admin, redirecting to access denied')
          const redirectUrl = req.nextUrl.clone()
          redirectUrl.pathname = '/access-denied'
          redirectUrl.searchParams.set('reason', 'admin_required')
          return NextResponse.redirect(redirectUrl)
        }
      } catch (adminCheckError) {
        console.error('❌ Error checking admin status:', adminCheckError)
        // If we can't verify admin status, allow through but let component handle it
        console.log('⚠️ Admin check failed, letting component handle auth')
      }
    }

    // If user is logged in and trying to access auth pages, redirect to home
    if (session && pathname.startsWith('/auth')) {
      console.log('✅ Logged in user accessing auth page, redirecting to home')
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
      return NextResponse.redirect(redirectUrl)
    }

    console.log('✅ Access granted')
    return res

  } catch (error) {
    console.error('❌ Middleware error:', error)
    // On error, allow the request to continue but log the issue
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
