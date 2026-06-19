# 🍽️ Restbite

> **A two-vertical food rescue marketplace.** Supermarkets sell near-expiry products at steep discounts. Restaurants open last-minute dining slots at slashed prices. One platform that reduces waste and recovers value for everyone.

---

## What is Restbite?

Restbite connects buyers with two types of time-sensitive food deals:

| Vertical | How it works |
|---|---|
| 🛒 **Supermarket deals** | Stores list near-expiry groceries at up to 80% off. Buyers browse, filter by category & distance, and pick up or get delivery before the expiry date. |
| 🍽️ **Dining sessions** | Restaurants close to closing time post a last-minute slot at a slashed percentage off. Buyers book a seat and pay at the door. Restbite is the discovery + booking layer only — no online food orders. |

---

## Screenshots

> _Coming soon — run locally to see the full UI_

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Vanilla CSS animations |
| UI Components | shadcn/ui + Radix UI |
| Icons | Lucide React |
| Database (planned) | [Supabase](https://supabase.com/) (PostgreSQL + Auth) |
| Geocoding | Nominatim (OpenStreetMap) — free, no API key required |

---

## Features

### Buyer-facing (live)
- 🏠 **Homepage** — animated hero, live deals ticker, marketplace tabs (groceries / dining), how it works, impact stats, app download CTA
- 🛍️ **Product listing** (`/supermarkets`) — search with auto-suggest, category filter pills, distance toggle (1km / 5km / 10km), urgency badges, sorted soonest-expiry first
- 📦 **Product detail** (`/supermarkets/[id]`) — photos, crossed-out price + sale price + % off, expiry date (prominent), quantity selector, allergen/ingredient tabs, store card, order CTA
- 🏪 **Store listing** (`/stores`) — all partner stores with rating, distance, active deal count, delivery/pickup tags
- 🏪 **Store detail** (`/stores/[slug]`) — store hero, hours, address, fulfilment options, all active deals from that store

### Design system
- Dark-first theme with light mode toggle (no flash)
- Electric lime (`#C8F135`) primary brand colour
- Animated slanted light beams across the page background
- Floating parallax cards on the hero (mouse-tracking)
- Scroll-driven fade-up animations throughout

### Seller / Restaurant (scaffolded)
- `/seller` — seller dashboard route (in progress)
- `/restaurant` — restaurant dashboard route (in progress)
- `/admin` — admin route (in progress)

---

## Project Structure

```
restbite/
├── app/
│   ├── (buyer)/                  # Buyer-facing routes (shared layout + navbar)
│   │   ├── page.tsx              # Homepage
│   │   ├── layout.tsx            # Buyer layout (navbar + footer + animated background)
│   │   ├── supermarkets/
│   │   │   ├── page.tsx          # Product listing page
│   │   │   └── [id]/page.tsx     # Product detail page
│   │   └── stores/
│   │       ├── page.tsx          # Store listing page
│   │       └── [slug]/page.tsx   # Store detail page
│   ├── seller/                   # Seller dashboard (in progress)
│   ├── restaurant/               # Restaurant dashboard (in progress)
│   ├── admin/                    # Admin panel (in progress)
│   ├── globals.css               # Design tokens, animations, base styles
│   └── layout.tsx                # Root layout (font, theme script)
│
├── components/
│   ├── buyer/                    # Homepage + buyer UI components
│   │   ├── BuyerNavbar.tsx
│   │   ├── BuyerFooter.tsx
│   │   ├── HeroSection.tsx
│   │   ├── DealsTicker.tsx
│   │   ├── StatsBar.tsx
│   │   ├── MarketplaceTabs.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── ImpactSection.tsx
│   │   └── CallToAction.tsx
│   ├── shared/                   # Cross-cutting components (Logo, ThemeToggle…)
│   └── ui/                       # shadcn/ui primitives
│
├── lib/
│   ├── products.ts               # Product mock data + helpers (expiryLabel)
│   └── stores.ts                 # Store mock data + slug helper
│
└── middleware.ts                 # Route protection (Supabase auth, coming soon)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/restbite.git
cd restbite

# Install dependencies
npm install
```

### Environment variables

Create a `.env.local` file in the root:

```env
# Supabase (required for auth + database — coming soon)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** The UI runs fully on mock data without Supabase credentials. You only need these for authentication and live database features.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Roadmap

- [ ] Supabase schema + migrations (products, stores, sessions, orders)
- [ ] Authentication (buyer sign up / sign in)
- [ ] Seller dashboard — list products, set expiry, manage stock
- [ ] Restaurant dashboard — post / close dining sessions
- [ ] Booking flow for dining sessions (slot reservation + QR code)
- [ ] Order flow for grocery pickup
- [ ] Real geolocation-filtered feed (replace mock data)
- [ ] Push notifications for expiring deals near you
- [ ] Admin panel — approve stores, manage listings
- [ ] Mobile app (React Native / Expo)

---

## Business Model

Restbite earns by helping businesses **recover value** they would otherwise lose:

- **Supermarkets** pay a small commission per sold near-expiry unit (recovered revenue vs. bin)
- **Restaurants** pay a flat session fee per posted dining slot
- Buyers always pay the restaurant/store directly — Restbite takes no payment cut on dining sessions

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## License

[MIT](./LICENSE)

---

<p align="center">Built with ❤️ in Port Harcourt, Nigeria</p>
