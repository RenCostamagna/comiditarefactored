import { createClient } from "@/lib/supabase/server"
import { ClientLayout } from "@/components/layout/client-layout"
import { SingleReviewPageClient } from "@/components/single-review-page-client"
import { redirect } from "next/navigation"

interface ReviewPageProps {
  params: { id: string }
}

// UUID validation regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export default async function ReviewPage({ params }: ReviewPageProps) {
  // Validate that the ID is a UUID, otherwise redirect to nueva route if it's "nueva"
  if (!UUID_REGEX.test(params.id)) {
    if (params.id === "nueva") {
      redirect("/reviews/nueva")
    }
    // For other invalid IDs, redirect to reviews home
    redirect("/reviews")
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  return (
    <ClientLayout user={user} currentPage="home">
      <SingleReviewPageClient reviewId={params.id} />
    </ClientLayout>
  )
}