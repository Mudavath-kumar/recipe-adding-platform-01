import Link from "next/link"
import Image from "next/image"
import { Clock } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RatingStars } from "@/components/rating-stars"
import type { Recipe } from "@/lib/types"

interface RecipeCardProps {
  recipe: Recipe
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe._id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 border-amber-100 hover:border-orange-200 hover:-translate-y-1 group">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={recipe.imageUrl || "/placeholder.svg?height=300&width=400"}
            alt={recipe.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-white text-brown-700 hover:bg-white">
              {recipe.dietary?.includes("vegetarian") ? "Vegetarian" : "Non-Vegetarian"}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-medium text-lg mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {recipe.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{recipe.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
              {recipe.cuisine}
            </Badge>
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">
              {recipe.category}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="mr-1 h-4 w-4 text-orange-500" />
            {recipe.cookingTime} mins
          </div>
          <div className="flex items-center gap-1">
            <RatingStars rating={recipe.averageRating || 0} size="sm" />
            <span className="text-xs">({recipe.ratings?.length || 0})</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
