"use client"

import { useRouter } from "next/navigation"
import { CategoryPlacesPage } from "@/components/places/category-places-page"

interface CategoryPlacesPageClientProps {
  category: string
  user: any
}

export function CategoryPlacesPageClient({ category, user }: CategoryPlacesPageClientProps) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handlePlaceSelect = (place: any) => {
    router.push(`/lugares/${place.id}`)
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
    <CategoryPlacesPage
      selectedCategory={category}
      onBack={handleBack}
      onPlaceSelect={handlePlaceSelect}
      onAddReview={handleAddReview}
      currentUser={user}
      onGoHome={handleGoHome}
      onGoReview={handleGoReview}
      onGoProfile={handleGoProfile}
    />
  )
}