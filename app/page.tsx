import { createClient } from "@/lib/supabase/server"
import { HomePageClient } from "@/components/home-page-client"

export default async function Page() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <HomePageClient user={user} />
}