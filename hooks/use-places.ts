import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Place } from "@/lib/types"

export function usePlaces() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handlePlaceSelect = async (googlePlace: any): Promise<Place | null> => {
    setIsLoading(true)
    try {
      if (googlePlace.id && !googlePlace.google_place_id.startsWith("temp")) {
        setIsLoading(false)
        return googlePlace
      }

      const { data: existingPlace } = await supabase
        .from("places")
        .select("*")
        .eq("google_place_id", googlePlace.google_place_id)
        .single()

      if (existingPlace) {
        return existingPlace
      } else {
        const newPlace = {
          google_place_id: googlePlace.google_place_id,
          name: googlePlace.name,
          address: googlePlace.address,
          latitude: googlePlace.latitude,
          longitude: googlePlace.longitude,
          phone: googlePlace.phone,
          website: googlePlace.website,
        }

        const { data: createdPlace, error } = await supabase.from("places").insert(newPlace).select().single()

        if (error) {
          console.error("Error creating place:", error)
          return {
            id: `temp-${Date.now()}`,
            ...newPlace,
            rating: 0,
            total_reviews: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        } else {
          return createdPlace
        }
      }
    } catch (error) {
      console.error("Error handling place selection:", error)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddReview = (place: Place, currentUser: any, setPreSelectedPlaceForReview: (place: Place) => void, goToReview: () => void) => {
    if (!currentUser) {
      alert("Debes iniciar sesión para dejar una reseña")
      return
    }

    const normalizedPlace = {
      id: place.id,
      google_place_id: place.google_place_id,
      name: place.name,
      address: place.address,
      latitude: place.latitude,
      longitude: place.longitude,
      phone: place.phone,
      website: place.website,
      rating: place.rating,
      total_reviews: place.total_reviews,
    }

    setPreSelectedPlaceForReview(normalizedPlace)
    goToReview()
  }

  return {
    isLoading,
    handlePlaceSelect,
    handleAddReview,
  }
}