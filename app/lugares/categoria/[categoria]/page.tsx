import { createClient } from "@/lib/supabase/server"
import { ClientLayout } from "@/components/layout/client-layout"
import { CategoryPlacesPageClient } from "@/components/category-places-page-client"
import { redirect } from "next/navigation"

interface CategoryPageProps {
  params: { categoria: string }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  const decodedCategory = decodeURIComponent(params.categoria)

  return (
    <ClientLayout user={user} currentPage="home">
      <CategoryPlacesPageClient category={decodedCategory} user={user} />
    </ClientLayout>
  )
}