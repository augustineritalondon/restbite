'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, User, Phone, ArrowRight, ArrowLeft, ShoppingBag, Store, Utensils } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'

const registerSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(['buyer', 'seller', 'restaurant']),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    defaultValues: {
      role: 'buyer',
    }
  })

  const role = watch('role')

  const nextStep = async () => {
    let isValid = false
    if (step === 1) {
      isValid = await trigger(['email', 'password'])
    } else if (step === 2) {
      isValid = await trigger(['fullName', 'phone'])
    }
    
    if (isValid) setStep((s) => (s + 1) as 1 | 2 | 3)
  }

  const prevStep = () => setStep((s) => (s - 1) as 1 | 2 | 3)

  const handleGoogleSignup = async () => {
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

  const onSubmit = async (data: RegisterFormValues) => {
    const supabase = createClient()
    
    // Determine the correct redirect URL based on role
    let redirectPath = '/onboarding'
    if (data.role === 'seller') redirectPath = '/seller/dashboard'
    if (data.role === 'restaurant') redirectPath = '/restaurant/dashboard'
    
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
        data: {
          full_name: data.fullName,
          phone: data.phone,
          role: data.role,
        }
      }
    })

    if (error) {
      setError('root', { message: error.message })
      return
    }

    // If session is null, it means email confirmation is required
    if (!authData.session) {
      setIsSuccess(true)
      return
    }

    // Since we need location, redirect to onboarding if role is buyer
    if (data.role === 'buyer') {
      router.push('/onboarding')
    } else if (data.role === 'seller') {
      router.push('/seller/dashboard')
    } else {
      router.push('/restaurant/dashboard')
    }
    router.refresh()
  }

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 bg-[rgba(200,241,53,0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail size={32} style={{ color: 'var(--brand)' }} />
          </div>
          <h1 className="text-2xl font-black text-foreground mb-4">Check your email</h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            We've sent a verification link to your email address. Please click the link to activate your account.
          </p>
          <Link 
            href="/auth/login"
            className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-black transition-all hover:brightness-95"
            style={{ background: 'var(--brand)', color: 'var(--background)' }}
          >
            Go to Login <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 shadow-2xl">
        
        {step > 1 && (
          <button 
            type="button" 
            onClick={prevStep}
            className="flex items-center text-xs font-bold text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft size={14} className="mr-1" /> Back
          </button>
        )}

        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-6">
            <div className={`h-1.5 rounded-full flex-1 transition-colors ${step >= 1 ? 'bg-[var(--brand)]' : 'bg-border'}`} />
            <div className={`h-1.5 rounded-full flex-1 transition-colors ${step >= 2 ? 'bg-[var(--brand)]' : 'bg-border'}`} />
            <div className={`h-1.5 rounded-full flex-1 transition-colors ${step >= 3 ? 'bg-[var(--brand)]' : 'bg-border'}`} />
          </div>

          <h1 className="text-2xl font-black text-foreground mb-2">
            {step === 1 && "Create an Account"}
            {step === 2 && "A bit about you"}
            {step === 3 && "How will you use Restbite?"}
          </h1>
          <p className="text-muted-foreground text-sm">
            {step === 1 && "Start saving on fresh food near you."}
            {step === 2 && "Let stores know who's picking up."}
            {step === 3 && "Select your primary role on the platform."}
          </p>
        </div>

        {errors.root && (
          <div className="bg-[var(--urgency)]/10 text-[var(--urgency)] text-sm p-3 rounded-xl mb-6 font-medium text-center">
            {errors.root.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* STEP 1: CREDENTIALS */}
          <div className={step === 1 ? 'block' : 'hidden'}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">Email address</label>
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
                {errors.email && <p className="text-xs text-[var(--urgency)] mt-1 ml-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">Password</label>
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
                {errors.password && <p className="text-xs text-[var(--urgency)] mt-1 ml-1">{errors.password.message}</p>}
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-black transition-all hover:brightness-95"
              style={{ background: 'var(--brand)', color: 'var(--background)' }}
            >
              Continue <ArrowRight size={16} />
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-bold border border-border hover:bg-surface transition-colors mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Sign up with Google
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-foreground font-bold hover:underline">Log in</Link>
            </p>
          </div>

          {/* STEP 2: PROFILE */}
          <div className={step === 2 ? 'block' : 'hidden'}>
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">Full Name (Optional)</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    {...register('fullName')}
                    className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--brand)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="tel"
                    placeholder="08012345678"
                    {...register('phone')}
                    className="w-full bg-surface border border-border rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[var(--brand)] transition-colors"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 ml-1">For pickup coordination and SMS alerts</p>
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl text-sm font-black transition-all hover:brightness-95"
              style={{ background: 'var(--brand)', color: 'var(--background)' }}
            >
              Continue <ArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="w-full py-3 mt-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip for now
            </button>
          </div>

          {/* STEP 3: ROLE */}
          <div className={step === 3 ? 'block' : 'hidden'}>
            <div className="space-y-3 mb-8">
              
              <button
                type="button"
                onClick={() => setValue('role', 'buyer')}
                className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                  role === 'buyer' ? 'border-[var(--brand)] bg-[rgba(200,241,53,0.05)]' : 'border-border bg-surface hover:border-[var(--brand)]'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[rgba(200,241,53,0.2)] flex items-center justify-center mr-4">
                  <ShoppingBag size={20} style={{ color: 'var(--brand)' }} />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-foreground text-sm">I'm Buying</div>
                  <div className="text-xs text-muted-foreground">Find deals & save food</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  role === 'buyer' ? 'border-[var(--brand)]' : 'border-border'
                }`}>
                  {role === 'buyer' && <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--brand)' }} />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setValue('role', 'seller')}
                className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                  role === 'seller' ? 'border-[var(--brand)] bg-[rgba(200,241,53,0.05)]' : 'border-border bg-surface hover:border-[var(--brand)]'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[rgba(255,107,53,0.2)] flex items-center justify-center mr-4">
                  <Store size={20} style={{ color: '#FF6B35' }} />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-foreground text-sm">I'm a Supermarket</div>
                  <div className="text-xs text-muted-foreground">Sell near-expiry items</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  role === 'seller' ? 'border-[var(--brand)]' : 'border-border'
                }`}>
                  {role === 'seller' && <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--brand)' }} />}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setValue('role', 'restaurant')}
                className={`w-full flex items-center p-4 rounded-xl border-2 transition-all ${
                  role === 'restaurant' ? 'border-[var(--brand)] bg-[rgba(200,241,53,0.05)]' : 'border-border bg-surface hover:border-[var(--brand)]'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-[rgba(0,187,249,0.2)] flex items-center justify-center mr-4">
                  <Utensils size={20} style={{ color: '#00BBF9' }} />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-foreground text-sm">I'm a Restaurant</div>
                  <div className="text-xs text-muted-foreground">List surplus meals</div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  role === 'restaurant' ? 'border-[var(--brand)]' : 'border-border'
                }`}>
                  {role === 'restaurant' && <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--brand)' }} />}
                </div>
              </button>

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
                <>Create Account <ArrowRight size={16} /></>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
