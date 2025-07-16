import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useReviews() {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleSubmitDetailedReview = async (reviewData: any, currentUser: any) => {
    if (!currentUser) {
      throw new Error("Usuario requerido para crear reseña")
    }

    setIsLoading(true)
    try {
      if (!reviewData.place || !reviewData.place.google_place_id) {
        throw new Error("Datos del lugar incompletos")
      }

      let placeId = reviewData.place.id

      if (!placeId || placeId.startsWith("temp-")) {
        const { data: existingPlace, error: searchError } = await supabase
          .from("places")
          .select("id")
          .eq("google_place_id", reviewData.place.google_place_id)
          .single()

        if (searchError && searchError.code !== "PGRST116") {
          console.error("Error searching for existing place:", searchError)
          throw searchError
        }

        if (existingPlace) {
          placeId = existingPlace.id
        } else {
          const placeToInsert = {
            google_place_id: reviewData.place.google_place_id,
            name: reviewData.place.name,
            address: reviewData.place.address,
            latitude: reviewData.place.latitude,
            longitude: reviewData.place.longitude,
            phone: reviewData.phone,
            website: reviewData.website,
          }

          const { data: createdPlace, error: placeError } = await supabase
            .from("places")
            .insert(placeToInsert)
            .select("id")
            .single()

          if (placeError) {
            console.error("Error creating place:", placeError)
            throw placeError
          }
          placeId = createdPlace.id
        }
      }

      const { data: existingReview, error: reviewCheckError } = await supabase
        .from("detailed_reviews")
        .select("id")
        .eq("user_id", currentUser.id)
        .eq("place_id", placeId)
        .single()

      if (reviewCheckError && reviewCheckError.code !== "PGRST116") {
        console.error("Error checking existing review:", reviewCheckError)
        throw reviewCheckError
      }

      if (existingReview) {
        throw new Error("Ya tienes una reseña para este lugar. Solo puedes tener una reseña por lugar.")
      }

      const reviewToInsert = {
        user_id: currentUser.id,
        place_id: placeId,
        dish_name: reviewData.dish_name,
        food_taste: reviewData.food_taste,
        presentation: reviewData.presentation,
        portion_size: reviewData.portion_size,
        drinks_variety: reviewData.drinks_variety,
        veggie_options: reviewData.veggie_options,
        gluten_free_options: reviewData.gluten_free_options,
        vegan_options: reviewData.vegan_options,
        music_acoustics: reviewData.music_acoustics,
        ambiance: reviewData.ambiance,
        furniture_comfort: reviewData.furniture_comfort,
        cleanliness: reviewData.cleanliness,
        service: reviewData.service,
        price_range: reviewData.price_range,
        restaurant_category: reviewData.restaurant_category,
        comment: reviewData.comment,
        photo_1_url: reviewData.photo_1_url,
        photo_2_url: reviewData.photo_2_url,
      }

      const { error } = await supabase.from("detailed_reviews").insert(reviewToInsert)

      if (error) {
        console.error("Error submitting detailed review:", error)
        throw error
      }

      return { success: true }
    } catch (error) {
      console.error("Error submitting detailed review:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleSubmitDetailedReview,
  }
}