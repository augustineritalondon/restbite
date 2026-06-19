import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session — do NOT add any logic between createServerClient and getUser
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // --- Route protection ---
  // Dashboard routes require authentication
  const dashboardPaths = ['/seller', '/restaurant', '/admin']
  const isDashboardRoute = dashboardPaths.some((path) =>
    pathname.startsWith(path)
  )

  // Auth routes
  const isAuthRoute =
    pathname.startsWith('/auth/login') ||
    pathname.startsWith('/auth/register') ||
    pathname.startsWith('/auth/forgot-password')

  // Redirect unauthenticated users away from protected routes
  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Role-based guard — read role from user metadata
  if (user && isDashboardRoute) {
    const role = user.user_metadata?.role as string | undefined

    const roleMap: Record<string, string> = {
      seller: '/seller',
      restaurant: '/restaurant',
      admin: '/admin',
    }

    // Check if user is trying to access a route for a different role
    for (const [roleKey, rolePath] of Object.entries(roleMap)) {
      if (pathname.startsWith(rolePath) && role !== roleKey && role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }
  }

  // Redirect authenticated users away from auth pages to appropriate dashboard
  if (user && isAuthRoute) {
    const role = user.user_metadata?.role as string | undefined
    const url = request.nextUrl.clone()

    if (role === 'seller') url.pathname = '/seller/dashboard'
    else if (role === 'restaurant') url.pathname = '/restaurant/dashboard'
    else if (role === 'admin') url.pathname = '/admin/dashboard'
    else url.pathname = '/'

    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
