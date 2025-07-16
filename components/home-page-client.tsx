"use client"

import { useRouter } from "next/navigation"
import { ClientLayout } from "@/components/layout/client-layout"
import { TopRatedPlaces } from "@/components/places/top-rated-places"
import { CategoriesSection } from "@/components/places/categories-section"
import { LoginCard } from "@/components/auth/login-card"
import { useAuth } from "@/hooks/use-auth"

interface HomePageClientProps {
  user: any
}

export function HomePageClient({ user: initialUser }: HomePageClientProps) {
  const router = useRouter()
  const auth = useAuth(initialUser)

  const handlePlaceSelect = async (place: any) => {
    router.push(`/lugares/${place.id}`)
  }

  const handleReviewSelect = (reviewId: string) => {
    router.push(`/reviews/${reviewId}`)
  }

  const handleCategorySelect = (category: string) => {
    router.push(`/lugares/categoria/${encodeURIComponent(category)}`)
  }

  const handleViewAllCategories = () => {
    router.push("/categorias")
  }

  return (
    <ClientLayout user={auth.currentUser} currentPage="home">
      {!auth.currentUser ? (
        <LoginCard
          onGoogleSignIn={auth.signInWithGoogle}
          onFacebookSignIn={auth.signInWithFacebook}
          onTestLogin={auth.handleTestLogin}
        />
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          <TopRatedPlaces 
            onPlaceSelect={handlePlaceSelect} 
            onReviewSelect={handleReviewSelect} 
          />
          <CategoriesSection 
            onCategorySelect={handleCategorySelect} 
            onViewAllCategories={handleViewAllCategories} 
          />
        </div>
      )}
    </ClientLayout>
  )
}