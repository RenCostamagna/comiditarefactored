import { createClient } from "@/lib/supabase/server"
import { ClientLayout } from "@/components/layout/client-layout"
import { UserProfilePageClient } from "@/components/user-profile-page-client"
import { redirect } from "next/navigation"

export default async function PerfilPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/")
  }

  return (
    <ClientLayout user={user} currentPage="profile">
      <UserProfilePageClient user={user} />
    </ClientLayout>
  )
}