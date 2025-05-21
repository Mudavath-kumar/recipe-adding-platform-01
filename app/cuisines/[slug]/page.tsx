import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCuisineBySlug, updateCuisineImages } from "@/lib/cuisines"
import { getRecipes } from "@/lib/recipes"
import { RatingStars } from "@/components/rating-stars"

export default async function CuisinePage({
  params,
  searchParams,
}: {
  params: { slug: string }
  searchParams: { page?: string }
}) {
  // Update cuisine images if needed
  await updateCuisineImages()

  const cuisine = await getCuisineBySlug(params.slug)
  if (!cuisine) {
    notFound()
  }

  const page = Number.parseInt(searchParams.page || "1")
  const { recipes, total } = await getRecipes({
    page,
    limit: 12,
    cuisine: cuisine.name,
  })

  const totalPages = Math.ceil(total / 12)

  return (
    <div className="container py-8">
      <Link href="/cuisines" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to cuisines
      </Link>

      <div className="relative h-64 w-full rounded-xl overflow-hidden mb-8">
        <Image
          src={cuisine.imageUrl || "/placeholder.svg?height=600&width=1200"}
          alt={cuisine.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-serif font-bold text-white mb-2">{cuisine.name}</h1>
          <p className="text-white/90 text-xl max-w-2xl text-center">{cuisine.description}</p>
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 bg-amber-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No recipes found in this cuisine</h2>
          <p className="text-gray-600 mb-6">Be the first to add a recipe to this cuisine!</p>
          <Link href="/recipes/new" className="text-orange-600 hover:underline">
            Add Recipe
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <Link key={recipe._id?.toString()} href={`/recipes/${recipe._id}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-amber-100 hover:border-orange-200 hover:-translate-y-1">
                  <div className="relative h-48 w-full">
                    <Image
                      src={recipe.imageUrl || "/placeholder.svg?height=300&width=400"}
                      alt={recipe.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-white text-brown-700 hover:bg-white">
                        {recipe.dietary?.includes("vegetarian") ? "Vegetarian" : "Non-Vegetarian"}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-2 line-clamp-1">{recipe.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{recipe.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                        {recipe.category}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <span>By {recipe.authorName}</span>
                    </div>
                    <div className="flex items-center">
                      <RatingStars rating={recipe.averageRating || 0} size="sm" />
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex gap-2">
                {page > 1 && (
                  <Link
                    href={{
                      pathname: `/cuisines/${params.slug}`,
                      query: { page: page - 1 },
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Link
                    key={pageNum}
                    href={{
                      pathname: `/cuisines/${params.slug}`,
                      query: { page: pageNum },
                    }}
                    className={`px-4 py-2 border rounded-md ${
                      pageNum === page ? "bg-brown-600 text-white" : "hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link
                    href={{
                      pathname: `/cuisines/${params.slug}`,
                      query: { page: page + 1 },
                    }}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
