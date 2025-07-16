import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

export function useAuth(initialUser: any) {
  const [testUser, setTestUser] = useState<any>(null)
  const supabase = createClient()

  const currentUser = initialUser || testUser

  const handleTestLogin = async () => {
    const testUserData = {
      id: "test-user-123",
      email: "usuario@prueba.com",
      user_metadata: {
        full_name: "Usuario de Prueba",
        avatar_url: "/placeholder.svg?height=40&width=40",
      },
    }

    try {
      const { error } = await supabase.from("users").upsert({
        id: testUserData.id,
        email: testUserData.email,
        full_name: testUserData.user_metadata.full_name,
        avatar_url: testUserData.user_metadata.avatar_url,
      })

      if (error) {
        console.log("Usuario de prueba ya existe o error menor:", error)
      }
    } catch (error) {
      console.log("Error creando usuario de prueba:", error)
    }

    setTestUser(testUserData)
  }

  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signInWithFacebook = () => {
    supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return {
    currentUser,
    testUser,
    handleTestLogin,
    signInWithGoogle,
    signInWithFacebook,
  }
}