import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getUserCollections } from "@/lib/collections"
import { RecipeCollections } from "@/components/recipe-collections"

export default async function CollectionsPage() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }

  const collections = await getUserCollections(user._id?.toString() || "")

  return (
    <div className="container py-8">
      <RecipeCollections collections={collections} userId={user._id?.toString() || ""} />
    </div>
  )
}
