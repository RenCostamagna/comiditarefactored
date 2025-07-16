import { createClient } from "@/lib/supabase/server"
import { ClientLayout } from "@/components/layout/client-layout"
import { TopRatedPlaces } from "@/components/places/top-rated-places"
import { redirect } from "next/navigation"

export default async function LugaresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Allow navigation without authentication for preview
  // if (!user) {
  //   redirect("/")
  // }

  // Create a test user for preview when no real user is available
  const displayUser = user || {
    id: "test-user-123",
    email: "usuario@prueba.com",
    user_metadata: {
      full_name: "Usuario de Prueba",
      avatar_url: "/placeholder.svg?height=40&width=40",
    },
  };

  return (
    <ClientLayout user={displayUser} currentPage="home">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Lugares Destacados</h1>
        <TopRatedPlaces 
          onPlaceSelect={(place) => {}}
          onReviewSelect={(reviewId) => {}}
        />
      </div>
    </ClientLayout>
  )
}