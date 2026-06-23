'use client'

import { useState, useEffect } from 'react'
import { MapPin, Image as ImageIcon, Camera, Check, X, Store } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/store/authStore'

export default function RestaurantSettings() {
  const [isSaving, setIsSaving] = useState(false)
  const [businessName, setBusinessName] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [address, setAddress] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [walkIns, setWalkIns] = useState(false)
  
  // Custom Modal State
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const [modalMessage, setModalMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const user = useAuthStore(state => state.user)
  
  const openModal = (title: string, message: string, success: boolean = false) => {
    setModalTitle(title)
    setModalMessage(message)
    setIsSuccess(success)
    setShowModal(true)
  }
  
  // Fetch existing profile
  useEffect(() => {
    if (!user) return
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('restaurant_profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (data) {
        setBusinessName(data.business_name || '')
        setCuisine(data.cuisine || '')
        setAddress(data.address || '')
        setImageUrl(data.image_url || '')
        setLogoUrl(data.logo_url || '')
      }
    }
    fetchProfile()
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const supabase = createClient()
    const { data: { user: authUser } } = await supabase.auth.getUser()
    
    if (!authUser) {
      openModal("Authentication Error", "You must be logged in to save settings.")
      return
    }

    setIsSaving(true)
    
    const { error } = await supabase
      .from('restaurant_profiles')
      .upsert({
        id: authUser.id,
        business_name: businessName,
        cuisine,
        address,
        image_url: imageUrl,
        logo_url: logoUrl,
        updated_at: new Date().toISOString()
      })
      
    setIsSaving(false)
    if (error) {
      openModal("Error", "Failed to save profile: " + error.message)
    } else {
      openModal("Success", "Profile saved successfully!", true)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'logo') => {
    try {
      const file = event.target.files?.[0]
      if (!file) return

      const supabase = createClient()
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        openModal("Authentication Error", "Please try logging out and logging back in.")
        return
      }
      
      const previewUrl = URL.createObjectURL(file)

      // Instantly show the image on the frontend preview
      if (type === 'image') {
        setImageUrl(previewUrl)
        setUploadingImage(true)
      } else {
        setLogoUrl(previewUrl)
        setUploadingLogo(true)
      }

      const fileExt = file.name.split('.').pop()
      const filePath = `${authUser.id}/${type}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('restaurant_images')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        // Revert preview on failure
        if (type === 'image') setImageUrl('')
        else setLogoUrl('')
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('restaurant_images')
        .getPublicUrl(filePath)

      if (type === 'image') {
        setImageUrl(publicUrl)
        await supabase.from('restaurant_profiles').upsert({
          id: authUser.id,
          business_name: businessName,
          cuisine,
          address,
          image_url: publicUrl,
          logo_url: logoUrl,
          updated_at: new Date().toISOString()
        })
      } else {
        setLogoUrl(publicUrl)
        await supabase.from('restaurant_profiles').upsert({
          id: authUser.id,
          business_name: businessName,
          cuisine,
          address,
          image_url: imageUrl,
          logo_url: publicUrl,
          updated_at: new Date().toISOString()
        })
      }

    } catch (error: any) {
      openModal("Upload Error", 'Error uploading image: ' + error.message)
    } finally {
      if (type === 'image') setUploadingImage(false)
      else setUploadingLogo(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      <div>
        <h1 className="text-2xl font-black tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure your public profile and default session parameters.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Branding */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Branding & Identity</h2>
          
          <div className="space-y-6">
            {/* Banner */}
            <div>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Cover Photo</label>
              <label className="w-full h-40 bg-[var(--surface)] border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:bg-card hover:border-muted-foreground transition-colors cursor-pointer group relative overflow-hidden">
                <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileUpload(e, 'image')} onClick={(e) => { (e.target as HTMLInputElement).value = '' }} disabled={uploadingImage} />
                {imageUrl ? (
                  <img src={imageUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <ImageIcon size={32} className={`mb-2 transition-transform ${uploadingImage ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                    <span className="text-sm font-semibold">{uploadingImage ? 'Uploading...' : 'Upload Banner Image'}</span>
                    <span className="text-xs mt-1">1200 x 400px recommended</span>
                  </>
                )}
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Logo */}
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Restaurant Logo</label>
                <label className="w-24 h-24 bg-[var(--surface)] border border-border rounded-full flex flex-col items-center justify-center text-muted-foreground hover:bg-card hover:border-muted-foreground transition-colors cursor-pointer group relative overflow-hidden">
                  <input type="file" className="sr-only" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} onClick={(e) => { (e.target as HTMLInputElement).value = '' }} disabled={uploadingLogo} />
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo" className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <Camera size={24} className={`transition-transform ${uploadingLogo ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                  )}
                </label>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Restaurant Name</label>
                  <input 
                    type="text" 
                    value={businessName}
                    onChange={e => setBusinessName(e.target.value)}
                    placeholder="Enter your restaurant name"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Cuisine Type</label>
                  <input 
                    type="text" 
                    value={cuisine}
                    onChange={e => setCuisine(e.target.value)}
                    placeholder="e.g. Local & Continental"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location & Hours */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Location & Hours</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Street Address</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input 
                  type="text" 
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Enter full street address"
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Standard Opening Time</label>
                <input 
                  type="time" 
                  defaultValue="11:00"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Standard Closing Time</label>
                <input 
                  type="time" 
                  defaultValue="23:00"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Session Preferences */}
        <section className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-6">Session Preferences</h2>
          
          <div className="space-y-6">
            <div>
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Max Party Size (Per Booking)</label>
              <input 
                type="number" 
                defaultValue="6"
                min="1"
                className="w-full md:w-1/3 px-4 py-3 rounded-xl bg-[var(--surface)] border border-border text-sm focus:outline-none focus:border-[var(--dining)] transition-colors text-foreground"
              />
              <p className="text-xs text-muted-foreground mt-2">The maximum number of people a single user can reserve for.</p>
            </div>

            <div className="pt-2 border-t border-border">
              <label className="flex items-start gap-4 cursor-pointer pt-4">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={walkIns}
                    onChange={(e) => setWalkIns(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-11 h-6 bg-[var(--surface)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--dining)]"></div>
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground">Allow Walk-ins for sessions</div>
                  <div className="text-xs text-muted-foreground mt-0.5">If disabled, only users who reserved via the app will be seated.</div>
                </div>
              </label>
            </div>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button 
            type="button"
            className="px-6 py-2.5 rounded-xl text-sm font-bold bg-[var(--surface)] text-foreground hover:bg-card border border-border transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-70"
            style={{ background: 'var(--dining)', color: 'white' }}
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Check size={16} strokeWidth={3} />
            )}
            Save Changes
          </button>
        </div>
      </form>

      {/* Custom Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-card w-full max-w-sm rounded-2xl p-6 border border-border shadow-2xl relative animate-in zoom-in-95">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-muted-foreground hover:bg-[var(--surface)] rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isSuccess ? 'bg-[rgba(46,204,113,0.1)]' : 'bg-[rgba(231,76,60,0.1)]'}`}>
                {isSuccess ? (
                  <Check size={32} className="text-[var(--success, #2ecc71)]" />
                ) : (
                  <Store size={32} className="text-[var(--urgency)]" />
                )}
              </div>
              <h2 className="text-xl font-bold mb-2">{modalTitle}</h2>
              <p className="text-sm text-muted-foreground mb-6">
                {modalMessage}
              </p>
              <button 
                onClick={() => setShowModal(false)}
                className="block w-full py-3.5 rounded-xl text-sm font-bold transition-all hover:brightness-110 active:scale-[0.98] text-center"
                style={{ background: isSuccess ? 'var(--success, #2ecc71)' : 'var(--dining)', color: 'white' }}
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
