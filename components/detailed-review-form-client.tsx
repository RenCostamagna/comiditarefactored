"use client"

import { useRouter } from "next/navigation"
import { DetailedReviewForm } from "@/components/reviews/detailed-review-form"
import { useReviews } from "@/hooks/use-reviews"
import { usePlaces } from "@/hooks/use-places"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface DetailedReviewFormClientProps {
  user: any
  preSelectedPlaceId?: string
}

export function DetailedReviewFormClient({ user, preSelectedPlaceId }: DetailedReviewFormClientProps) {
  const router = useRouter()
  const reviews = useReviews()
  const places = usePlaces()
  const [preSelectedPlace, setPreSelectedPlace] = useState(null)
  const supabase = createClient()

  useEffect(() => {
    if (preSelectedPlaceId) {
      const fetchPlace = async () => {
        const { data: place } = await supabase
          .from("places")
          .select("*")
          .eq("id", preSelectedPlaceId)
          .single()
        
        if (place) {
          setPreSelectedPlace(place)
        }
      }
      fetchPlace()
    }
  }, [preSelectedPlaceId, supabase])

  const handleSubmit = async (reviewData: any) => {
    try {
      await reviews.handleSubmitDetailedReview(reviewData, user)
      router.push("/")
    } catch (error: any) {
      alert(`Error al enviar la reseña: ${error.message}`)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <DetailedReviewForm
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={reviews.isLoading || places.isLoading}
      preSelectedPlace={preSelectedPlace}
    />
  )
}