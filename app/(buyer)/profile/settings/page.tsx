'use client'

import { ShieldCheck, MapPin, Bell, User, Phone, Leaf, Plus } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

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
  }),
})

type ProfileValues = z.infer<typeof profileSchema>
type PreferencesValues = z.infer<typeof preferencesSchema>

// ─── Component ───────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    formState: { errors: profileErrors, isSubmitting: profileSaving, isDirty: profileDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: '', phone: '' },
  })

  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  type Address = {
    id: string;
    name: string;
    address: string;
    isDefault: boolean;
  }
  const [addresses, setAddresses] = useState<Address[]>([])
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState<{name: string, address: string}>({name: '', address: ''})
  const [isAddingAddress, setIsAddingAddress] = useState(false)

  const { 
    control, 
    handleSubmit: handlePrefSubmit, 
    setValue: setPrefValue,
    formState: { isSubmitting: prefSaving } 
  } = useForm<PreferencesValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      notifications: { push: true },
    },
  })

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 3000)
  }

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setProfileValue('name', profile.full_name || '')
        setProfileValue('phone', profile.phone || '')
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url)
        if (profile.addresses) setAddresses(profile.addresses)
        if (profile.notification_preferences) {
          setPrefValue('notifications.push', profile.notification_preferences.push ?? true)
        }
      }
    }
    fetchUser()
  }, [setProfileValue, setPrefValue])

  const onProfileSave = async (data: ProfileValues) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('users')
      .update({ full_name: data.name, phone: data.phone })
      .eq('id', user.id)

    if (error) {
      console.error(error)
      showToast("Failed to save profile.")
    } else {
      await supabase.auth.updateUser({
        data: { full_name: data.name, phone: data.phone }
      })
      showToast("Profile saved successfully!")
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true)
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const filePath = `${user.id}-${Math.random()}.${fileExt}`

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      // Update users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)

      if (updateError) throw updateError

      // Update auth metadata too
      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      })

      setAvatarUrl(publicUrl)
      showToast('Avatar updated!')
    } catch (error: any) {
      showToast(error.message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveAddress = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    let newAddresses = [...addresses]
    
    if (isAddingAddress) {
      newAddresses.push({
        id: Math.random().toString(36).substr(2, 9),
        name: addressForm.name,
        address: addressForm.address,
        isDefault: addresses.length === 0
      })
    } else if (editingAddressId) {
      newAddresses = newAddresses.map(a => 
        a.id === editingAddressId 
          ? { ...a, name: addressForm.name, address: addressForm.address } 
          : a
      )
    }

    const { error } = await supabase
      .from('users')
      .update({ addresses: newAddresses })
      .eq('id', user.id)

    if (error) {
      showToast("Failed to save address.")
    } else {
      setAddresses(newAddresses)
      setIsAddingAddress(false)
      setEditingAddressId(null)
      setAddressForm({name: '', address: ''})
      showToast("Address saved!")
    }
  }

  const handleDeleteAddress = async (id: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newAddresses = addresses.filter(a => a.id !== id)

    const { error } = await supabase
      .from('users')
      .update({ addresses: newAddresses })
      .eq('id', user.id)

    if (error) {
      alert("Failed to delete address.")
    } else {
      setAddresses(newAddresses)
    }
  }

  const handleSetDefaultAddress = async (id: string) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newAddresses = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }))

    const { error } = await supabase
      .from('users')
      .update({ addresses: newAddresses })
      .eq('id', user.id)

    if (error) {
      alert("Failed to set default address.")
    } else {
      setAddresses(newAddresses)
    }
  }

  const onPrefSave = async (data: PreferencesValues) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('users')
      .update({ notification_preferences: data.notifications })
      .eq('id', user.id)

    if (error) {
      console.error(error)
      showToast("Failed to save preferences.")
    } else {
      showToast("Preferences saved successfully!")
    }
  }

  return (
    <div className="pb-12 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-foreground text-background px-6 py-3 rounded-xl font-bold text-sm shadow-2xl animate-fade-up">
          {toastMessage}
        </div>
      )}

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
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-16 h-16 rounded-full bg-[var(--surface)] border border-border flex items-center justify-center text-xl font-black relative group cursor-pointer overflow-hidden"
              >
                {avatarUrl ? (
                  <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span>R</span>
                )}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-white">Edit</span>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="text-xs font-semibold px-4 py-2 border border-border rounded-lg hover:bg-surface transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Uploading...' : 'Change Avatar'}
              </button>
              <input 
                type="file" 
                hidden 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleAvatarUpload} 
              />
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
              {addresses.map((addr) => (
                <div key={addr.id} className={`p-3 rounded-xl border ${addr.isDefault ? 'border-[var(--brand)] bg-[rgba(200,241,53,0.02)]' : 'border-border bg-surface'} flex justify-between items-start`}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm">{addr.name}</span>
                      {addr.isDefault && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--brand)] text-black uppercase">Default</span>}
                    </div>
                    <p className="text-xs text-muted-foreground">{addr.address}</p>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <button 
                      onClick={() => {
                        setIsAddingAddress(false)
                        setEditingAddressId(addr.id)
                        setAddressForm({ name: addr.name, address: addr.address })
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground underline"
                    >
                      Edit
                    </button>
                    {!addr.isDefault && (
                      <button 
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-[10px] font-semibold text-muted-foreground hover:text-foreground"
                      >
                        Set Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {addresses.length === 0 && !isAddingAddress && (
                <p className="text-xs text-muted-foreground text-center py-4">No addresses saved yet.</p>
              )}
            </div>

            {(isAddingAddress || editingAddressId) ? (
              <div className="p-4 border border-border rounded-xl bg-surface space-y-3">
                <input 
                  type="text" 
                  placeholder="Label (e.g. Home, Office)" 
                  className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[var(--brand)]"
                  value={addressForm.name}
                  onChange={e => setAddressForm({...addressForm, name: e.target.value})}
                />
                <textarea 
                  placeholder="Full Address" 
                  rows={2}
                  className="w-full bg-background border border-border rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[var(--brand)] resize-none"
                  value={addressForm.address}
                  onChange={e => setAddressForm({...addressForm, address: e.target.value})}
                />
                <div className="flex gap-2 justify-end">
                  {editingAddressId && (
                    <button 
                      onClick={() => handleDeleteAddress(editingAddressId)}
                      className="px-3 py-1.5 text-xs font-bold text-[var(--urgency)] hover:bg-[var(--urgency)]/10 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  )}
                  <div className="flex-1" />
                  <button 
                    onClick={() => {
                      setIsAddingAddress(false)
                      setEditingAddressId(null)
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveAddress}
                    disabled={!addressForm.name || !addressForm.address}
                    className="px-4 py-1.5 text-xs font-bold bg-[var(--brand)] text-black rounded-lg transition-colors disabled:opacity-50"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setEditingAddressId(null)
                  setAddressForm({name: '', address: ''})
                  setIsAddingAddress(true)
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold border border-dashed border-border hover:border-foreground transition-colors text-muted-foreground hover:text-foreground"
              >
                <Plus size={16} /> Add New Address
              </button>
            )}
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
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">Push Notifications</div>
                    <div className="text-xs text-muted-foreground">Instant alerts for price drops & order updates</div>
                  </div>
                  <Controller
                    name="notifications.push"
                    control={control}
                    render={({ field }) => (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={field.value} onChange={field.onChange} />
                        <div className="w-11 h-6 bg-surface peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand)]" />
                      </label>
                    )}
                  />
                </div>
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
