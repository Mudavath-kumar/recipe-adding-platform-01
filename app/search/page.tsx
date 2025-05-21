import Link from "next/link"
import { Search } from "lucide-react"

import { getRecipes } from "@/lib/recipes"
import { getAllCategories } from "@/lib/categories"
import { getAllCuisines } from "@/lib/cuisines"
import { RecipeCard } from "@/components/recipe-card"
import { AdvancedSearchFilter } from "@/components/advanced-search-filter"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/pagination"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: {
    q?: string
    page?: string
    category?: string
    cuisine?: string
    dietary?: string
    difficulty?: string
    cookingTime?: string
    sortBy?: string
  }
}) {
  const query = searchParams.q || ""
  const page = Number.parseInt(searchParams.page || "1")
  const category = searchParams.category || ""
  const cuisine = searchParams.cuisine || ""
  const dietary = searchParams.dietary || ""
  const difficulty = searchParams.difficulty || ""
  const cookingTime = Number.parseInt(searchParams.cookingTime || "0")
  const sortBy = (searchParams.sortBy || "newest") as "newest" | "popular" | "rating"

  const [{ recipes, total }, categories, cuisines] = await Promise.all([
    getRecipes({
      page,
      limit: 12,
      category,
      cuisine,
      dietary,
      search: query,
      difficulty,
      cookingTime,
      sortBy,
    }),
    getAllCategories(),
    getAllCuisines(),
  ])

  const totalPages = Math.ceil(total / 12)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-brown-900 mb-2">Search Results</h1>
        {query ? (
          <p className="text-brown-600">
            {total} {total === 1 ? "recipe" : "recipes"} found for &quot;{query}&quot;
          </p>
        ) : (
          <p className="text-brown-600">
            {total} {total === 1 ? "recipe" : "recipes"} found
          </p>
        )}
      </div>

      <AdvancedSearchFilter categories={categories} cuisines={cuisines} initialFilters={searchParams} />

      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-amber-50 rounded-lg">
          <Search className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No recipes found</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Try adjusting your search or filters to find what you're looking for
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild variant="outline" className="border-orange-200">
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/recipes/new">Add a Recipe</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id?.toString()} recipe={recipe} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12">
              <Pagination currentPage={page} totalPages={totalPages} baseUrl="/search" searchParams={searchParams} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
