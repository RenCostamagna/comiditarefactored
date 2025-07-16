"use client"

import { useRouter } from "next/navigation"
import { UserProfilePage } from "@/components/user/user-profile-page"

interface UserProfilePageClientProps {
  user: any
}

export function UserProfilePageClient({ user }: UserProfilePageClientProps) {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <UserProfilePage
      user={user}
      onBack={handleBack}
    />
  )
}