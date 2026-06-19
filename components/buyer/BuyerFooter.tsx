import Link from 'next/link'
import { Logo } from '@/components/shared/Logo'

export function BuyerFooter() {
  return (
    <footer className="border-t border-border mt-16 bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Logo size="md" />
            <p className="mt-4 text-sm text-muted-foreground">
              Rescue near-expiry groceries and snag last-minute dining slots at huge discounts.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Marketplace</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/supermarkets" className="hover:text-brand transition-colors">Supermarkets</Link></li>
              <li><Link href="/closing-sessions" className="hover:text-brand transition-colors">Closing Sessions</Link></li>
              <li><Link href="#how" className="hover:text-brand transition-colors">How it works</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Partner with us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/auth/register" className="hover:text-brand transition-colors">Become a Seller</Link></li>
              <li><Link href="/auth/register" className="hover:text-brand transition-colors">List your Restaurant</Link></li>
              <li><Link href="/seller" className="hover:text-brand transition-colors">Seller Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-brand transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Restbite. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
