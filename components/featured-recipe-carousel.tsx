"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock, Utensils, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Recipe } from "@/lib/types"

interface FeaturedRecipeCarouselProps {
  recipes: Recipe[]
}

export function FeaturedRecipeCarousel({ recipes }: FeaturedRecipeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const goToNext = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToPrev = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + recipes.length) % recipes.length)
    setTimeout(() => setIsAnimating(false), 500)
  }

  useEffect(() => {
    // Auto-advance carousel
    timerRef.current = setInterval(goToNext, 6000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [recipes.length])

  if (recipes.length === 0) {
    return <div className="text-center py-10">No featured recipes available</div>
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl shadow-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {recipes.map((recipe) => (
            <div key={recipe._id?.toString()} className="w-full flex-shrink-0">
              <div className="relative h-[500px] md:h-[600px] w-full">
                <Image
                  src={recipe.imageUrl || "/placeholder.svg?height=600&width=1200"}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white">Featured</Badge>
                      <Badge className="bg-white text-orange-700 hover:bg-orange-100">{recipe.cuisine}</Badge>
                      <Badge className="bg-white text-orange-700 hover:bg-orange-100">{recipe.category}</Badge>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-3 max-w-2xl">{recipe.title}</h2>
                    <p className="text-white/80 mb-6 max-w-2xl line-clamp-2 md:line-clamp-3">{recipe.description}</p>

                    <div className="flex flex-wrap gap-6 mb-6">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-orange-400" />
                        <span>{recipe.cookingTime} mins</span>
                      </div>
                      <div className="flex items-center">
                        <Utensils className="h-5 w-5 mr-2 text-orange-400" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 mr-2 text-orange-400" />
                        <span>
                          {recipe.averageRating.toFixed(1)} ({recipe.ratings.length} reviews)
                        </span>
                      </div>
                    </div>

                    <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
                      <Link href={`/recipes/${recipe._id}`}>View Recipe</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <button
        onClick={goToPrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
        aria-label="Previous recipe"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={goToNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-colors"
        aria-label="Next recipe"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="flex justify-center mt-4 gap-2">
        {recipes.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAnimating(true)
              setCurrentIndex(index)
              setTimeout(() => setIsAnimating(false), 500)
            }}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-orange-500" : "w-2 bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
