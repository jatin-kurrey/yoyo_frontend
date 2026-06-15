import { lazy, Suspense } from "react"
import Hero from "../components/Hero"
import { usePageTitle } from "../hooks/usePageTitle"

const DiscoverSection = lazy(() => import("../components/DiscoverSection"))
const RestaurantSection = lazy(() => import("../components/RestaurantSection"))
const SuitesSection = lazy(() => import("../components/SuitesSection"))
const HallBookingSection = lazy(() => import("../components/HallBookingSection"))
const TrustSection = lazy(() => import("../components/TrustSection"))
const AboutSection = lazy(() => import("../components/AboutSection"))

function Home() {
  usePageTitle("Home")
  return (
    <main className="bg-white">
      {/* 1. Hero (includes Quick Info Bar) */}
      <Hero />
      
      <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading section...</div>}>
        {/* 2. Waterpark Attractions */}
        <DiscoverSection />
        
        {/* 3. Resort Extensions */}
        <RestaurantSection />
        <SuitesSection />
        <HallBookingSection />
        
        {/* 5. Trust & Social Proof */}
        <TrustSection />
        
        {/* 6. About */}
        <AboutSection />
      </Suspense>
    </main>
  )
}

export default Home

