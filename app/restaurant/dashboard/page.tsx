export default function RestaurantDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Restaurant Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your reservations, time slots, and menu in real-time.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Today\'s Guests', value: '0' },
          { label: 'Live Bookings', value: '0', color: 'var(--live)' },
          { label: 'Available Slots', value: '0' },
          { label: 'Revenue (Today)', value: '£0' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-6 border border-border relative overflow-hidden">
            {stat.color && (
              <div 
                className="absolute top-0 right-0 w-2 h-full" 
                style={{ background: stat.color }}
              />
            )}
            <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2 text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 glass rounded-xl border border-border min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-foreground">Upcoming Reservations</h3>
            <p className="text-muted-foreground mt-1 text-sm">No reservations for today.</p>
          </div>
        </div>
        <div className="glass rounded-xl border border-border min-h-[400px] flex items-center justify-center">
           <div className="text-center">
            <h3 className="text-lg font-medium text-foreground">Live Time Slots</h3>
            <p className="text-muted-foreground mt-1 text-sm">No active slots right now.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
