import { createClient } from "@/lib/supabase/server"
import { ClientLayout } from "@/components/layout/client-layout"
import { DetailedReviewFormClient } from "@/components/detailed-review-form-client"
import { redirect } from "next/navigation"

interface SearchParams {
  placeId?: string
}

interface NewReviewPageProps {
  searchParams: SearchParams
}

export default async function NewReviewPage({ searchParams }: NewReviewPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  return (
    <ClientLayout user={user} currentPage="review">
      <div className="max-w-2xl mx-auto space-y-6">
        <DetailedReviewFormClient 
          user={user} 
          preSelectedPlaceId={searchParams.placeId}
        />
      </div>
    </ClientLayout>
  )
}