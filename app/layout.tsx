import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Restbite — Rescue Groceries & Grab Last-Minute Dining Slots',
    template: '%s | Restbite',
  },
  description:
    'The two-vertical marketplace to reduce waste. Grab near-expiry groceries from supermarkets or snag slashed-price last-minute dining slots.',
  keywords: ['food waste', 'grocery deals', 'last-minute dining', 'restbite'],
  authors: [{ name: 'Restbite' }],
  creator: 'Restbite',
  metadataBase: new URL('https://restbite.com'),
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    siteName: 'Restbite',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash of light mode — runs before paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('restbite-theme');
                  if (theme === 'light') {
                    document.documentElement.classList.add('light');
                  }
                  // Default is dark — no class needed
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}
