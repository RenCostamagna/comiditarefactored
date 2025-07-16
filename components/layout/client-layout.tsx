"use client"

import { Header } from "@/components/layout/header"
import { BottomNavigation } from "@/components/layout/bottom-navigation"
import { useRouter } from "next/navigation"

interface ClientLayoutProps {
  children: React.ReactNode
  user: any
  currentPage?: "home" | "review" | "profile"
}

export function ClientLayout({ children, user, currentPage = "home" }: ClientLayoutProps) {
  const router = useRouter()

  const handleGoHome = () => {
    router.push("/")
  }

  const handleGoReview = () => {
    router.push("/reviews/nueva")
  }

  const handleGoProfile = () => {
    router.push("/perfil")
  }

  const handleViewProfile = () => {
    router.push("/perfil")
  }

  const handleLogoClick = () => {
    router.push("/")
  }

  const handlePlaceSelect = async (place: any) => {
    // Use the place.id if it exists, otherwise use google_place_id as fallback
    const placeId = place.id || place.google_place_id
    
    if (!placeId) {
      console.error("No place ID found:", place)
      return
    }
    
    router.push(`/lugares/${placeId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={user}
        onViewProfile={handleViewProfile}
        onLogoClick={handleLogoClick}
        onPlaceSelect={handlePlaceSelect}
      />
      
      <main className={`container mx-auto px-4 py-8 pt-20 ${user ? "pb-24" : ""}`}>
        {children}
      </main>

      {user && (
        <BottomNavigation
          currentPage={currentPage}
          onGoHome={handleGoHome}
          onGoReview={handleGoReview}
          onGoProfile={handleGoProfile}
        />
      )}
    </div>
  )
}