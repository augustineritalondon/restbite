import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { session } } = await supabase.auth.getSession()
      
      // If the user already has a role set, they aren't new, redirect them correctly.
      const role = session?.user?.user_metadata?.role
      if (role) {
        if (role === 'buyer') return NextResponse.redirect(`${origin}/supermarkets`)
        if (role === 'seller') return NextResponse.redirect(`${origin}/seller/dashboard`)
        if (role === 'restaurant') return NextResponse.redirect(`${origin}/restaurant/dashboard`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with some instructions
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
