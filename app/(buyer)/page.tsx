import { HeroSection } from '@/components/buyer/HeroSection'
import { DealsTicker } from '@/components/buyer/DealsTicker'
import { StatsBar } from '@/components/buyer/StatsBar'
import { MarketplaceTabs } from '@/components/buyer/MarketplaceTabs'
import { HowItWorks } from '@/components/buyer/HowItWorks'
import { ImpactSection } from '@/components/buyer/ImpactSection'
import { CallToAction } from '@/components/buyer/CallToAction'

export default function BuyerHomepage() {
  return (
    <>
      <HeroSection />
      <DealsTicker />
      <StatsBar />
      <MarketplaceTabs />
      <HowItWorks />
      <ImpactSection />
      <CallToAction />
    </>
  )
}
