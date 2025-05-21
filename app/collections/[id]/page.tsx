import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, FolderOpen, Lock, Globe, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getCollectionById } from "@/lib/collections"
import { getRecipesByIds } from "@/lib/recipes"
import { getCurrentUser } from "@/lib/auth"
import { RecipeCard } from "@/components/recipe-card"

export default async function CollectionDetailPage({ params }: { params: { id: string } }) {
  const [collection, currentUser] = await Promise.all([getCollectionById(params.id), getCurrentUser()])

  if (!collection) {
    notFound()
  }

  // Check if user has access to this collection
  const isOwner = currentUser && currentUser._id?.toString() === collection.userId
  if (!collection.isPublic && !isOwner) {
    redirect("/collections")
  }

  // Get recipes in this collection
  const recipes = collection.recipeIds.length > 0 ? await getRecipesByIds(collection.recipeIds) : []

  return (
    <div className="container py-8">
      <Link href="/collections" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to collections
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-serif font-bold text-brown-900">{collection.name}</h1>
            {collection.isPublic ? (
              <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Public
              </Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Private
              </Badge>
            )}
          </div>
          {collection.description && <p className="text-gray-600 mb-2 max-w-2xl">{collection.description}</p>}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="flex items-center">
              <User className="h-3 w-3 mr-1" />
              {isOwner ? "Your collection" : "By " + collection.userId}
            </div>
            <span>&bull;</span>
            <span>
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            </span>
            <span>&bull;</span>
            <span>Created {new Date(collection.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href={`/collections/${collection._id}/edit`}>Edit Collection</Link>
            </Button>
          </div>
        )}
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-amber-50 rounded-lg">
          <FolderOpen className="h-16 w-16 text-orange-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No recipes in this collection yet</h2>
          {isOwner ? (
            <p className="text-gray-600 mb-6">Browse recipes and add them to this collection</p>
          ) : (
            <p className="text-gray-600">This collection is empty</p>
          )}
          {isOwner && (
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/">Browse Recipes</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id?.toString()} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
