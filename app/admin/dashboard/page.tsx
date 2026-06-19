export default function AdminDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
          <p className="text-muted-foreground mt-2">Platform-wide metrics and pending approvals.</p>
        </div>
        <div className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'color-mix(in srgb, var(--urgency) 15%, transparent)', color: 'var(--urgency)' }}>
          System Health: Optimal
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: 'Total Users', value: '0' },
          { label: 'Active Restaurants', value: '0' },
          { label: 'Pending Approvals', value: '0', alert: true },
          { label: 'Platform Revenue', value: '£0.00' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-6 border border-border relative">
            <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2 text-foreground" style={stat.alert ? { color: 'var(--urgency)' } : {}}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl border border-border min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">Needs Attention</h3>
          <p className="text-muted-foreground mt-1 text-sm">No items require administrative action at this time.</p>
        </div>
      </div>
    </div>
  )
}
