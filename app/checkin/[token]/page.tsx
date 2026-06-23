'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, XCircle, AlertTriangle, Camera, Loader2 } from 'lucide-react'

type ScanState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'scanning' }
  | { status: 'success'; name: string; partySize: number; code: string }
  | { status: 'already_checked_in'; name: string; code: string }
  | { status: 'invalid'; code: string }
  | { status: 'error'; message: string }

type Session = {
  id: string
  status: string
  closing_time: string
  restaurant_id: string
}

declare global {
  interface BarcodeDetectorOptions {
    formats: string[];
  }
  class BarcodeDetector {
    constructor(options?: BarcodeDetectorOptions);
    detect(image: ImageBitmapSource): Promise<{ rawValue: string }[]>;
  }
  interface Window {
    BarcodeDetector: typeof BarcodeDetector
  }
}

export default function CheckInPage() {
  const { token } = useParams<{ token: string }>()
  const [session, setSession] = useState<Session | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)
  const [scan, setScan] = useState<ScanState>({ status: 'idle' })
  const [manualCode, setManualCode] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectorRef = useRef<BarcodeDetector | null>(null)
  const scanLoopRef = useRef<number | null>(null)
  const processingRef = useRef(false)

  // Load session by token
  useEffect(() => {
    if (!token) return
    const supabase = createClient()
    supabase
      .from('dining_sessions')
      .select('id, status, closing_time, restaurant_id')
      .eq('checkin_token', token)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setSessionError('Check-in link is invalid or has expired.')
        } else if (data.status === 'closed') {
          setSessionError('This session has already closed.')
        } else {
          setSession(data)
        }
        setSessionLoading(false)
      })
  }, [token])

  // Clean up camera on unmount
  useEffect(() => {
    return () => stopCamera()
  }, [])

  const stopCamera = () => {
    if (scanLoopRef.current) cancelAnimationFrame(scanLoopRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }

  const startScanner = async () => {
    setScan({ status: 'loading' })
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      // Use native BarcodeDetector if available, else show manual fallback
      if ('BarcodeDetector' in window) {
        detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] })
        setScan({ status: 'scanning' })
        scanLoop()
      } else {
        // Browser doesn't support BarcodeDetector — fall through to manual entry
        setScan({ status: 'scanning' })
      }
    } catch {
      setScan({ status: 'error', message: 'Camera access denied. Please allow camera permission and try again.' })
    }
  }

  const scanLoop = () => {
    if (!videoRef.current || !detectorRef.current || processingRef.current) {
      scanLoopRef.current = requestAnimationFrame(scanLoop)
      return
    }
    detectorRef.current
      .detect(videoRef.current)
      .then(codes => {
        if (codes.length > 0) {
          const raw = codes[0].rawValue.trim().toUpperCase()
          processingRef.current = true
          handleCode(raw)
        } else {
          scanLoopRef.current = requestAnimationFrame(scanLoop)
        }
      })
      .catch(() => {
        scanLoopRef.current = requestAnimationFrame(scanLoop)
      })
  }

  const handleCode = async (code: string) => {
    if (!session) return
    const supabase = createClient()

    const { data, error } = await supabase
      .from('reservations')
      .select('id, name, party_size, arrived')
      .eq('session_id', session.id)
      .eq('code', code)
      .single()

    if (error || !data) {
      setScan({ status: 'invalid', code })
    } else if (data.arrived) {
      setScan({ status: 'already_checked_in', name: data.name, code })
    } else {
      // Mark arrived
      await supabase
        .from('reservations')
        .update({ arrived: true })
        .eq('id', data.id)

      setScan({ status: 'success', name: data.name, partySize: data.party_size, code })
    }

    // Auto-reset to scanning after 3 seconds
    setTimeout(() => {
      processingRef.current = false
      setScan({ status: 'scanning' })
      if (detectorRef.current) scanLoop()
    }, 3000)
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualCode.trim()) return
    processingRef.current = true
    handleCode(manualCode.trim().toUpperCase())
    setManualCode('')
  }

  // ─── Loading / Error States ───────────────────────────────────────────────

  if (sessionLoading) {
    return (
      <div className="min-h-dvh bg-[#0a0a10] flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-[var(--dining)]" />
      </div>
    )
  }

  if (sessionError) {
    return (
      <div className="min-h-dvh bg-[#0a0a10] flex flex-col items-center justify-center p-6 text-center">
        <XCircle size={64} className="text-red-500 mb-4" />
        <h1 className="text-xl font-black text-white mb-2">Link Invalid</h1>
        <p className="text-gray-400 text-sm max-w-xs">{sessionError}</p>
      </div>
    )
  }

  // ─── Success / Error Overlays ─────────────────────────────────────────────

  const overlay = (() => {
    if (scan.status === 'success') return (
      <div className="absolute inset-0 bg-emerald-500 flex flex-col items-center justify-center text-white animate-in fade-in duration-200 z-20">
        <CheckCircle2 size={80} strokeWidth={1.5} className="mb-4" />
        <div className="text-4xl font-black mb-1">✓ Checked In</div>
        <div className="text-2xl font-bold mb-2">{scan.name}</div>
        <div className="text-lg opacity-80">Party of {scan.partySize}</div>
        <div className="mt-4 text-sm opacity-60 font-mono">{scan.code}</div>
      </div>
    )
    if (scan.status === 'already_checked_in') return (
      <div className="absolute inset-0 bg-amber-500 flex flex-col items-center justify-center text-white animate-in fade-in duration-200 z-20">
        <AlertTriangle size={80} strokeWidth={1.5} className="mb-4" />
        <div className="text-3xl font-black mb-2">Already Checked In</div>
        <div className="text-xl">{scan.name}</div>
        <div className="mt-4 text-sm opacity-60 font-mono">{scan.code}</div>
      </div>
    )
    if (scan.status === 'invalid') return (
      <div className="absolute inset-0 bg-red-600 flex flex-col items-center justify-center text-white animate-in fade-in duration-200 z-20">
        <XCircle size={80} strokeWidth={1.5} className="mb-4" />
        <div className="text-3xl font-black mb-2">Invalid Code</div>
        <div className="text-sm opacity-70 font-mono">{scan.code}</div>
      </div>
    )
    return null
  })()

  // ─── Main Render ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-dvh bg-[#0a0a10] flex flex-col relative overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 z-10">
        <div className="text-white font-black text-lg tracking-tight">Check-In Scanner</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--dining)] animate-pulse" />
          <span className="text-[var(--dining)] text-xs font-bold uppercase tracking-widest">
            Session Open · {session?.closing_time}
          </span>
        </div>
      </div>

      {/* Camera viewport */}
      <div className="relative flex-1 mx-4 mb-4 rounded-2xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Scan overlay: idle/loading */}
        {(scan.status === 'idle' || scan.status === 'loading') && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black/70 z-10">
            {scan.status === 'loading' ? (
              <Loader2 size={48} className="animate-spin text-[var(--dining)]" />
            ) : (
              <>
                <Camera size={64} className="text-white/40" strokeWidth={1} />
                <button
                  onClick={startScanner}
                  className="px-8 py-4 bg-[var(--dining)] text-white font-black text-lg rounded-2xl shadow-xl shadow-[var(--dining)]/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  Start Scanning
                </button>
                <p className="text-white/40 text-sm text-center px-8">
                  Tap to open camera and begin scanning guest QR codes
                </p>
              </>
            )}
          </div>
        )}

        {/* Scanning: aim guide */}
        {scan.status === 'scanning' && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-56 h-56 rounded-3xl border-4 border-white/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-[var(--dining)] rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[var(--dining)] rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[var(--dining)] rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[var(--dining)] rounded-br-3xl" />
            </div>
          </div>
        )}

        {/* Error */}
        {scan.status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 z-10 p-6 text-center">
            <XCircle size={48} className="text-red-400" />
            <p className="text-white text-sm">{scan.message}</p>
            <button onClick={startScanner} className="px-6 py-3 bg-[var(--dining)] text-white font-bold rounded-xl">
              Try Again
            </button>
          </div>
        )}

        {/* Result overlays */}
        {overlay}
      </div>

      {/* Manual code entry fallback */}
      <form onSubmit={handleManualSubmit} className="flex gap-2 px-4 pb-6">
        <input
          type="text"
          value={manualCode}
          onChange={e => setManualCode(e.target.value.toUpperCase())}
          placeholder="Enter code manually"
          maxLength={8}
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 text-sm font-mono tracking-widest focus:outline-none focus:border-[var(--dining)] uppercase"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-[var(--dining)] text-white font-bold rounded-xl text-sm hover:brightness-110 active:scale-95 transition-all"
        >
          Check In
        </button>
      </form>
    </div>
  )
}
