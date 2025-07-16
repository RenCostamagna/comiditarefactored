"use client"

import { useRouter } from "next/navigation"
import { SingleReviewPage } from "@/components/reviews/single-review-page"

interface SingleReviewPageClientProps {
  reviewId: string
}

export function SingleReviewPageClient({ reviewId }: SingleReviewPageClientProps) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleViewPlace = (place: any) => {
    router.push(`/lugares/${place.id}`)
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
    <SingleReviewPage
      reviewId={reviewId}
      onBack={handleBack}
      onViewPlace={handleViewPlace}
      onGoHome={handleGoHome}
      onGoReview={handleGoReview}
      onGoProfile={handleGoProfile}
    />
  )
}