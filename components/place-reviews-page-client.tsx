"use client"

import { useRouter } from "next/navigation"
import { PlaceReviewsPage } from "@/components/places/place-reviews-page"

interface PlaceReviewsPageClientProps {
  place: any
  user: any
}

export function PlaceReviewsPageClient({ place, user }: PlaceReviewsPageClientProps) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleAddReview = (place: any) => {
    router.push(`/reviews/nueva?placeId=${place.id}`)
  }

  const handleGoHome = () => {
    router.push("/")
  }

  const handleGoReview = () => {
    router.push("/reviews/nueva")
  }

  const handleGoProfile = () => {
    router.push("/perfil")
  }

  return (
    <PlaceReviewsPage
      place={place}
      onBack={handleBack}
      onAddReview={handleAddReview}
      currentUser={user}
      onGoHome={handleGoHome}
      onGoSearch={handleGoProfile}
      onGoReview={handleGoReview}
    />
  )
}