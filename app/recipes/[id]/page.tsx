import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Clock, Edit, User, Utensils, ChefHat, Heart } from "lucide-react"
import { AddToCollection } from "@/components/add-to-collection"
import { PrintRecipe } from "@/components/print-recipe"
import { ShareRecipe } from "@/components/share-recipe"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRecipeById, getSimilarRecipes } from "@/lib/recipes"
import { getCurrentUser } from "@/lib/auth"
import { DeleteRecipeButton } from "@/components/delete-recipe-button"
import { FavoriteButton } from "@/components/favorite-button"
import { RatingStars } from "@/components/rating-stars"
import { RecipeRatingForm } from "@/components/recipe-rating-form"
import { RecipeCard } from "@/components/recipe-card"
import { NutritionFacts } from "@/components/nutrition-facts"

export default async function RecipePage({ params }: { params: { id: string } }) {
  try {
    const [recipe, currentUser, similarRecipes] = await Promise.all([
      getRecipeById(params.id),
      getCurrentUser(),
      getSimilarRecipes(params.id, 4),
    ])

    if (!recipe) {
      notFound()
    }

    const isAuthor = currentUser && recipe.authorId === currentUser._id?.toString()

    return (
      <div className="container py-8">
        <Link href="/" className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to recipes
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-3xl font-serif font-bold tracking-tight text-gray-900">{recipe.title}</h1>
              <div className="flex gap-2">
                {isAuthor && (
                  <>
                    <Link href={`/recipes/${recipe._id}/edit`}>
                      <Button variant="outline" className="border-orange-200 text-orange-700 hover:bg-orange-50">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <DeleteRecipeButton id={recipe._id?.toString() || ""} />
                  </>
                )}
                {currentUser && (
                  <>
                    <FavoriteButton
                      recipeId={recipe._id?.toString() || ""}
                      userId={currentUser._id?.toString() || ""}
                    />
                    <AddToCollection
                      recipeId={recipe._id?.toString() || ""}
                      userId={currentUser._id?.toString() || ""}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="relative h-[500px] w-full rounded-xl overflow-hidden shadow-lg">
              <Image
                src={recipe.imageUrl || "/placeholder.svg?height=600&width=800"}
                alt={recipe.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute top-4 right-4 flex gap-2">
                {currentUser && (
                  <AddToCollection recipeId={recipe._id?.toString() || ""} userId={currentUser._id?.toString() || ""} />
                )}
                <PrintRecipe recipe={recipe} />
                <ShareRecipe recipeId={recipe._id?.toString() || ""} recipeTitle={recipe.title} />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                {recipe.category}
              </Badge>
              <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
                {recipe.cuisine}
              </Badge>
              {recipe.dietary &&
                recipe.dietary.map((diet) => (
                  <Badge key={diet} variant="outline" className="bg-green-50 text-green-800 border-green-200">
                    {diet}
                  </Badge>
                ))}
            </div>

            <div className="flex flex-wrap gap-6 text-gray-600 bg-amber-50 p-6 rounded-xl">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Cooking Time</p>
                  <p className="font-medium">{recipe.cookingTime} minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Servings</p>
                  <p className="font-medium">{recipe.servings} servings</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ChefHat className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="font-medium capitalize">{recipe.difficulty}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-orange-500" />
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center">
                    <RatingStars rating={recipe.averageRating || 0} />
                    <span className="ml-1">({recipe.ratings?.length || 0})</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-serif font-bold mb-4 text-gray-900">Description</h2>
              <p className="text-gray-700 leading-relaxed text-lg">{recipe.description}</p>
            </div>

            <Card className="border-amber-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-200 to-orange-200 h-2" />
              <CardContent className="p-6">
                <h2 className="text-2xl font-serif font-bold mb-6 flex items-center text-gray-900">
                  <Utensils className="mr-3 h-6 w-6 text-orange-500" />
                  Ingredients
                </h2>
                <ul className="grid gap-3 md:grid-cols-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-orange-400" />
                      <span className="text-lg">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="border-amber-100 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-200 to-orange-200 h-2" />
              <CardContent className="p-6">
                <h2 className="text-2xl font-serif font-bold mb-6 flex items-center text-gray-900">
                  <ChefHat className="mr-3 h-6 w-6 text-orange-500" />
                  Instructions
                </h2>
                <ol className="space-y-6">
                  {recipe.instructions.split("\n\n").map((instruction, index) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center mr-4 font-bold">
                        {index + 1}
                      </span>
                      <p className="pt-1 text-lg">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Nutrition Facts */}
            {recipe.nutritionalInfo && Object.keys(recipe.nutritionalInfo).length > 0 && (
              <NutritionFacts nutritionalInfo={recipe.nutritionalInfo} servings={recipe.servings} />
            )}

            {/* Similar Recipes */}
            {similarRecipes.length > 0 && (
              <div>
                <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900">You Might Also Like</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {similarRecipes.map((recipe) => (
                    <RecipeCard key={recipe._id?.toString()} recipe={recipe} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-amber-100 overflow-hidden sticky top-20">
              <div className="bg-gradient-to-r from-amber-200 to-orange-200 h-2" />
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">{recipe.authorName}</h3>
                    <p className="text-sm text-muted-foreground">{new Date(recipe.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="border-t border-b py-4 my-4">
                  <h3 className="font-medium mb-2">Rating</h3>
                  <div className="flex items-center gap-2 mb-1">
                    <RatingStars rating={recipe.averageRating || 0} />
                    <span className="text-sm text-muted-foreground">
                      ({recipe.ratings?.length || 0} {recipe.ratings?.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                  {currentUser && !isAuthor && <RecipeRatingForm recipeId={recipe._id?.toString() || ""} />}
                </div>

                {recipe.ratings && recipe.ratings.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3">Reviews</h3>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {recipe.ratings
                        .filter((rating) => rating.comment)
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((rating, index) => (
                          <div key={index} className="border-b pb-3 last:border-0">
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center">
                                <RatingStars rating={rating.value} size="sm" />
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {new Date(rating.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{rating.comment}</p>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error loading recipe:", error)
    notFound()
  }
}
