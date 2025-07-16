import { createClient } from "@/lib/supabase/server"
import { ClientLayout } from "@/components/layout/client-layout"
import { PlaceReviewsPageClient } from "@/components/place-reviews-page-client"
import { redirect } from "next/navigation"

interface PlacePageProps {
  params: { id: string }
}

export default async function PlacePage({ params }: PlacePageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const { data: place, error } = await supabase
    .from("places")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !place) {
    redirect("/")
  }

  return (
    <ClientLayout user={user} currentPage="home">
      <PlaceReviewsPageClient place={place} user={user} />
    </ClientLayout>
  )
}