export default function SellerDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-up">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage your listings, view performance, and fulfill orders.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Placeholder Stat Cards */}
        {[
          { label: 'Total Revenue', value: '£0.00' },
          { label: 'Active Listings', value: '0' },
          { label: 'Pending Orders', value: '0' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-xl p-6 border border-border">
            <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
            <p className="text-3xl font-bold mt-2 text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl border border-border min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">No recent activity</h3>
          <p className="text-muted-foreground mt-1 text-sm">Your latest orders and updates will appear here.</p>
        </div>
      </div>
    </div>
  )
}
