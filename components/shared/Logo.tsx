import Link from 'next/link'

interface LogoProps {
  href?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

export function Logo({ href = '/', size = 'md' }: LogoProps) {
  return (
    <Link
      href={href}
      className={`font-bold tracking-tight ${sizeMap[size]} flex items-center gap-0.5 hover:opacity-90 transition-opacity`}
      aria-label="Restbite — home"
    >
      <span className="text-foreground">rest</span>
      <span style={{ color: 'var(--brand)' }}>bite</span>
      <span
        className="w-1.5 h-1.5 rounded-full ml-0.5 mb-0.5 inline-block"
        style={{ background: 'var(--live)' }}
        aria-hidden="true"
      />
    </Link>
  )
}
