"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Filter, ChevronDown, ChevronUp, Clock, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

import type { Category, Cuisine } from "@/lib/types"

interface AdvancedSearchFilterProps {
  categories: Category[]
  cuisines: Cuisine[]
  initialFilters?: Record<string, string>
}

export function AdvancedSearchFilter({ categories, cuisines, initialFilters = {} }: AdvancedSearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "All Categories",
    cuisine: searchParams.get("cuisine") || "All Cuisines",
    dietary: searchParams.get("dietary") || "All Diets",
    difficulty: searchParams.get("difficulty") || "Any Difficulty",
    cookingTime: searchParams.get("cookingTime") || "180",
    sortBy: searchParams.get("sortBy") || "newest",
    ...initialFilters,
  })

  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  useEffect(() => {
    // Count active filters (excluding search query and sort)
    let count = 0
    if (filters.category !== "All Categories") count++
    if (filters.cuisine !== "All Cuisines") count++
    if (filters.dietary !== "All Diets") count++
    if (filters.difficulty !== "Any Difficulty") count++
    if (filters.cookingTime && filters.cookingTime !== "180") count++

    setActiveFiltersCount(count)
  }, [filters])

  const dietaryOptions = [
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "gluten-free", label: "Gluten-Free" },
    { id: "dairy-free", label: "Dairy-Free" },
    { id: "keto", label: "Keto" },
    { id: "low-carb", label: "Low-Carb" },
  ]

  const difficultyOptions = [
    { id: "easy", label: "Easy" },
    { id: "medium", label: "Medium" },
    { id: "hard", label: "Hard" },
  ]

  const sortOptions = [
    { id: "newest", label: "Newest First" },
    { id: "popular", label: "Most Popular" },
    { id: "rating", label: "Highest Rated" },
  ]

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleDietaryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, dietary: value }))
  }

  const handleCookingTimeChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, cookingTime: value[0].toString() }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()

    // Only add non-empty filters to the URL
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value &&
        value !== "All Categories" &&
        value !== "All Cuisines" &&
        value !== "All Diets" &&
        value !== "Any Difficulty"
      ) {
        params.set(key, value)
      }
    })

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      q: filters.q,
      category: "All Categories",
      cuisine: "All Cuisines",
      dietary: "All Diets",
      difficulty: "Any Difficulty",
      cookingTime: "180",
      sortBy: "newest",
    })
  }

  const removeFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }))
  }

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search recipes, ingredients..."
            value={filters.q}
            onChange={(e) => handleFilterChange("q", e.target.value)}
            className="w-full"
          />
        </div>

        <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange("sortBy", value)}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} className="bg-orange-500 hover:bg-orange-600">
          Search
        </Button>
      </div>

      {/* Active filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.category !== "All Categories" && (
            <Badge variant="outline" className="flex items-center gap-1 bg-amber-50">
              Category: {filters.category}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-amber-100"
                onClick={() => removeFilter("category")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.cuisine !== "All Cuisines" && (
            <Badge variant="outline" className="flex items-center gap-1 bg-amber-50">
              Cuisine: {filters.cuisine}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-amber-100"
                onClick={() => removeFilter("cuisine")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.dietary !== "All Diets" && (
            <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
              Dietary: {filters.dietary}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-green-100"
                onClick={() => removeFilter("dietary")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.difficulty !== "Any Difficulty" && (
            <Badge variant="outline" className="flex items-center gap-1 bg-amber-50">
              Difficulty: {filters.difficulty}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-amber-100"
                onClick={() => removeFilter("difficulty")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {filters.cookingTime && filters.cookingTime !== "180" && (
            <Badge variant="outline" className="flex items-center gap-1 bg-amber-50">
              Max Time: {filters.cookingTime} mins
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 hover:bg-amber-100"
                onClick={() => handleFilterChange("cookingTime", "180")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 h-7"
            onClick={clearFilters}
          >
            Clear All
          </Button>
        </div>
      )}

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex justify-between items-center">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-0 hover:bg-transparent hover:text-orange-600">
              <Filter className="h-4 w-4" />
              Advanced Filters
              {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </CollapsibleTrigger>

          {activeFiltersCount > 0 && (
            <span className="text-sm text-gray-500">
              {activeFiltersCount} {activeFiltersCount === 1 ? "filter" : "filters"} applied
            </span>
          )}
        </div>

        <CollapsibleContent className="mt-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-medium mb-2">Category</h3>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.slug} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2">Cuisine</h3>
              <Select value={filters.cuisine} onValueChange={(value) => handleFilterChange("cuisine", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Cuisines">All Cuisines</SelectItem>
                  {cuisines.map((cuisine) => (
                    <SelectItem key={cuisine.slug} value={cuisine.name}>
                      {cuisine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2">Dietary</h3>
              <Select value={filters.dietary} onValueChange={handleDietaryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select dietary preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Diets">All Diets</SelectItem>
                  {dietaryOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="font-medium mb-2">Difficulty</h3>
              <Select value={filters.difficulty} onValueChange={(value) => handleFilterChange("difficulty", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any Difficulty">Any Difficulty</SelectItem>
                  {difficultyOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4 text-orange-500" />
                Maximum Cooking Time
              </h3>
              <span className="text-sm font-medium">{filters.cookingTime} minutes</span>
            </div>
            <Slider
              value={[Number.parseInt(filters.cookingTime)]}
              min={10}
              max={180}
              step={5}
              onValueChange={handleCookingTimeChange}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>10 min</span>
              <span>1 hour</span>
              <span>3 hours</span>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
