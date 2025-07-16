import { createClient } from "@/lib/supabase/server"
import { ClientLayout } from "@/components/layout/client-layout"
import { SingleReviewPageClient } from "@/components/single-review-page-client"
import { redirect } from "next/navigation"

interface ReviewPageProps {
  params: { id: string }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
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
      <SingleReviewPageClient reviewId={params.id} />
    </ClientLayout>
  )
}