"use client"

import { useRouter } from "next/navigation"
import { AllCategoriesPage } from "@/components/places/all-categories-page"

interface AllCategoriesPageClientProps {
  user: any
}

export function AllCategoriesPageClient({ user }: AllCategoriesPageClientProps) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleCategorySelect = (category: string) => {
    router.push(`/lugares/categoria/${encodeURIComponent(category)}`)
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
    <AllCategoriesPage
      onBack={handleBack}
      onCategorySelect={handleCategorySelect}
      currentUser={user}
      onGoHome={handleGoHome}
      onGoReview={handleGoReview}
      onGoProfile={handleGoProfile}
    />
  )
}