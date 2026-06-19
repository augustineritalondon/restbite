'use client'

import { ShieldCheck, MapPin, Bell, User, Phone, Leaf, Plus } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// ─── Schemas ────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Enter a valid Nigerian phone number')
    .regex(/^(\+?234|0)[789]\d{9}$/, 'Enter a valid Nigerian mobile number'),
})

const preferencesSchema = z.object({
  notifications: z.object({
    push: z.boolean(),
    email: z.boolean(),
    sms: z.boolean(),
  }),
  dietary: z.object({
    vegan: z.boolean(),
    glutenFree: z.boolean(),
    nutFree: z.boolean(),
    halal: z.boolean(),
  }),
})

type ProfileValues = z.infer<typeof profileSchema>
type PreferencesValues = z.infer<typeof preferencesSchema>

// ─── Component ───────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSaving, isDirty: profileDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: 'Rita London', phone: '08012345678' },
  })

  const { control, handleSubmit: handlePrefSubmit, formState: { isSubmitting: prefSaving } } =
    useForm<PreferencesValues>({
      resolver: zodResolver(preferencesSchema),
      defaultValues: {
        notifications: { push: true, email: true, sms: false },
        dietary: { vegan: false, glutenFree: true, nutFree: false, halal: false },
      },
    })

  const onProfileSave = async (data: ProfileValues) => {
    await new Promise((r) => setTimeout(r, 800))
    console.log('Profile saved:', data)
    // TODO: call Supabase update user
  }

  const onPrefSave = async (data: PreferencesValues) => {
    await new Promise((r) => setTimeout(r, 600))
    console.log('Preferences saved:', data)
    // TODO: call Supabase update user_metadata
  }

  return (
    <div className="pb-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your profile, preferences, and notifications.</p>
      </div>

      {/* Savings Widget */}
      <div className="bg-[var(--surface)] border border-border rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[var(--brand)] rounded-full blur-[80px] opacity-20 pointer-events-none" />
        <div className="flex items-start gap-4 relative z-10">
          <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={24} className="text-[var(--brand)]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Total Savings This Month</h2>
            <div className="text-4xl font-black text-foreground">₦14,250</div>
            <p className="text-xs text-[var(--live)] mt-2 font-semibold bg-[rgba(0,212,200,0.1)] inline-block px-2 py-1 rounded">
              You're in the top 15% of food rescuers!
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── Left Column ── */}
        <div className="space-y-8">

          {/* Profile Form */}
          <section className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-[var(--brand)]" />
              <h3 className="font-bold text-lg">Personal Info</h3>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[var(--surface)] border border-border flex items-center justify-center text-xl font-black relative group cursor-pointer overflow-hidden">
                R
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] uppercase tracking-wider font-bold">Edit</span>
                </div>
              </div>
              <button type="button" className="text-xs font-semibold px-4 py-2 border border-border rounded-lg hover:bg-surface transition-colors">
                Change Avatar
              </button>
            </div>

            <form onSubmit={handleProfileSubmit(onProfileSave)} className="space-y-4" noValidate>
              <div>
                <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">Full Name</label>
                <input
                  type="text"
                  {...registerProfile('name')}
                  className={`w-full bg-surface border rounded-xl py-2.5 px-4 text-sm focus:outline-none transition-colors ${
                    profileErrors.name ? 'border-[var(--urgency)]' : 'border-border focus:border-[var(--brand)]'
                  }`}
                />
                {profileErrors.name && (
                  <p className="text-xs text-[var(--urgency)] mt-1 ml-1">{profileErrors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground ml-1 mb-1 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <input
                    type="tel"
                    {...registerProfile('phone')}
                    className={`w-full bg-surface border rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none transition-colors ${
                      profileErrors.phone ? 'border-[var(--urgency)]' : 'border-border focus:border-[var(--brand)]'
                    }`}
                  />
                </div>
                {profileErrors.phone && (
                  <p className="text-xs text-[var(--urgency)] mt-1 ml-1">{profileErrors.phone.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={profileSaving || !profileDirty}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={profileDirty ? { background: 'var(--brand)', color: 'var(--background)' } : { background: 'var(--surface)', color: 'var(--muted-foreground)' }}
              >
                {profileSaving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </section>

          {/* Saved Addresses */}
          <section className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-[var(--brand)]" />
              <h3 className="font-bold text-lg">Saved Addresses</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-[var(--brand)] bg-[rgba(200,241,53,0.02)] flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm">Home</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--brand)] text-black uppercase">Default</span>
                  </div>
                  <p className="text-xs text-muted-foreground">14 Peter Odili Road, Trans Amadi, Port Harcourt</p>
                </div>
                <button className="text-xs text-muted-foreground hover:text-foreground underline">Edit</button>
              </div>

              <div className="p-3 rounded-xl border border-border bg-surface flex justify-between items-start">
                <div>
                  <div className="font-bold text-sm mb-1">Office</div>
                  <p className="text-xs text-muted-foreground">Shell RA, Aba Road, Port Harcourt</p>
                </div>
                <button className="text-xs text-muted-foreground hover:text-foreground underline">Edit</button>
              </div>
            </div>

            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border border-dashed border-border hover:border-foreground transition-colors text-muted-foreground hover:text-foreground">
              <Plus size={16} /> Add New Address
            </button>
          </section>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-8">

          <form onSubmit={handlePrefSubmit(onPrefSave)} className="space-y-8">

            {/* Notifications */}
            <section className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bell size={18} className="text-[var(--brand)]" />
                <h3 className="font-bold text-lg">Notifications</h3>
              </div>

              <div className="space-y-5">
                {([
                  { name: 'notifications.push' as const, label: 'Push Notifications', desc: 'Instant alerts for price drops & order updates' },
                  { name: 'notifications.email' as const, label: 'Email Receipts', desc: 'Receive order confirmations via email' },
                  { name: 'notifications.sms' as const, label: 'SMS Alerts', desc: 'Delivery tracking and urgent alerts' },
                ]).map(({ name, label, desc }) => (
                  <div key={name} className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-sm">{label}</div>
                      <div className="text-xs text-muted-foreground">{desc}</div>
                    </div>
                    <Controller
                      name={name}
                      control={control}
                      render={({ field }) => (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={field.value} onChange={field.onChange} />
                          <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand)]" />
                        </label>
                      )}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Dietary Preferences */}
            <section className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Leaf size={18} className="text-[var(--brand)]" />
                <h3 className="font-bold text-lg">Dietary & Allergens</h3>
              </div>
              <p className="text-xs text-muted-foreground mb-4">We'll highlight these when you browse deals.</p>

              <div className="grid grid-cols-2 gap-3">
                {([
                  { name: 'dietary.vegan' as const, label: 'Vegan' },
                  { name: 'dietary.glutenFree' as const, label: 'Gluten Free' },
                  { name: 'dietary.nutFree' as const, label: 'Nut Free' },
                  { name: 'dietary.halal' as const, label: 'Halal' },
                ]).map(({ name, label }) => (
                  <Controller
                    key={name}
                    name={name}
                    control={control}
                    render={({ field }) => (
                      <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${field.value ? 'border-[var(--brand)] bg-[rgba(200,241,53,0.05)]' : 'border-border bg-surface hover:border-foreground'}`}>
                        <input type="checkbox" className="accent-[var(--brand)] w-4 h-4" checked={field.value} onChange={field.onChange} />
                        <span className="text-sm font-semibold">{label}</span>
                      </label>
                    )}
                  />
                ))}
              </div>
            </section>

            <button
              type="submit"
              disabled={prefSaving}
              className="w-full py-3 rounded-xl text-sm font-black transition-all hover:brightness-95 disabled:opacity-50"
              style={{ background: 'var(--brand)', color: 'var(--background)' }}
            >
              {prefSaving ? 'Saving…' : 'Save Preferences'}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
