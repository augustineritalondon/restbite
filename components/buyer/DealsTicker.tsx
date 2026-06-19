export function DealsTicker() {
  return (
    <div className="py-2 overflow-hidden whitespace-nowrap" style={{ background: 'var(--brand)' }}>
      <div className="inline-flex animate-ticker">
        {/* We repeat the items to create a seamless infinite scrolling effect */}
        {[1, 2].map((group) => (
          <div key={group} className="flex">
            <span className="text-xs font-bold px-8 tracking-wide flex items-center gap-2" style={{ color: 'var(--background)' }}>
              <span className="w-1.5 h-1.5 rounded-full opacity-40" style={{ background: 'var(--background)' }}></span>
              Sourdough loaf — 70% off
            </span>
            <span className="text-xs font-bold px-8 tracking-wide flex items-center gap-2" style={{ color: 'var(--background)' }}>
              <span className="w-1.5 h-1.5 rounded-full opacity-40" style={{ background: 'var(--background)' }}></span>
              Native Tray — 8 seats left
            </span>
            <span className="text-xs font-bold px-8 tracking-wide flex items-center gap-2" style={{ color: 'var(--background)' }}>
              <span className="w-1.5 h-1.5 rounded-full opacity-40" style={{ background: 'var(--background)' }}></span>
              Gouda cheese — expires today
            </span>
            <span className="text-xs font-bold px-8 tracking-wide flex items-center gap-2" style={{ color: 'var(--background)' }}>
              <span className="w-1.5 h-1.5 rounded-full opacity-40" style={{ background: 'var(--background)' }}></span>
              Chicken thighs — 55% off
            </span>
            <span className="text-xs font-bold px-8 tracking-wide flex items-center gap-2" style={{ color: 'var(--background)' }}>
              <span className="w-1.5 h-1.5 rounded-full opacity-40" style={{ background: 'var(--background)' }}></span>
              Kilimanjaro — 5 seats left
            </span>
            <span className="text-xs font-bold px-8 tracking-wide flex items-center gap-2" style={{ color: 'var(--background)' }}>
              <span className="w-1.5 h-1.5 rounded-full opacity-40" style={{ background: 'var(--background)' }}></span>
              Greek yoghurt pack — 3 days left
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
