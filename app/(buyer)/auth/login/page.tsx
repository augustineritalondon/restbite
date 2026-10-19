'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

// Inner component that uses useSearchParams — must be inside <Suspense>
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextParam = searchParams?.get('next') || '/profile/orders'

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@restbite.app',
      password: 'password123',
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setError('root', { message: error.message })
      return
    }

    // Get the user to check their role
    const { data: { user } } = await supabase.auth.getUser()
    const role = user?.user_metadata?.role as string | undefined

    if (role === 'restaurant') {
      router.push('/restaurant/dashboard')
    } else if (role === 'seller') {
      router.push('/seller/dashboard')
    } else if (role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      // Buyer — use the ?next= param or fallback to profile
      router.push(nextParam)
    }
    router.refresh()
  }

  const urlError = searchParams?.get('error_description') || searchParams?.get('error')
  const errorMessage = errors.root?.message || (urlError === 'auth_callback_failed' ? 'Authentication failed or session link expired. Please try again.' : urlError)

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError('root', { message: error.message })
    }
  }

  return (
    <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-2xl text-center">
      <div className="w-16 h-16 bg-[rgba(200,241,53,0.1)] rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
        <ShieldCheck size={32} style={{ color: 'var(--brand)' }} className="-rotate-3" />
      </div>

      <h1 className="text-2xl font-black text-foreground mb-2">Welcome Back</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Sign in to access your orders, pickup codes, and complete your checkout.
      </p>

      {errorMessage && (
        <div className="bg-[var(--urgency)]/10 text-[var(--urgency)] text-sm p-3 rounded-xl mb-6 font-medium text-center">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6 text-left" noValidate>
        <div>
          <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              className={`w-full bg-surface border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-colors ${
                errors.email ? 'border-[var(--urgency)] focus:border-[var(--urgency)]' : 'border-border focus:border-[var(--brand)]'
              }`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-[var(--urgency)] mt-1 ml-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="password"
              placeholder="••••••••"
              {...register('password')}
              className={`w-full bg-surface border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none transition-colors ${
                errors.password ? 'border-[var(--urgency)] focus:border-[var(--urgency)]' : 'border-border focus:border-[var(--brand)]'
              }`}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-[var(--urgency)] mt-1 ml-1">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-black transition-all hover:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ background: 'var(--brand)', color: 'var(--background)' }}
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Sign In <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-bold border border-border hover:bg-surface transition-colors mb-6"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Google
      </button>

      <p className="text-xs text-muted-foreground">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-foreground font-bold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <Suspense fallback={
        <div className="w-12 h-12 border-2 border-[var(--brand)] border-t-transparent rounded-full animate-spin" />
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
