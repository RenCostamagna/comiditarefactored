import { createClient } from "@/lib/supabase/server"
import { ClientLayout } from "@/components/layout/client-layout"
import { AllCategoriesPageClient } from "@/components/all-categories-page-client"
import { redirect } from "next/navigation"

export default async function CategoriasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  return (
    <ClientLayout user={user} currentPage="home">
      <AllCategoriesPageClient user={user} />
    </ClientLayout>
  )
}