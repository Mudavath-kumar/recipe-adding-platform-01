"use client"

import { useState } from "react"
import { Calendar, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import type { Recipe } from "@/lib/types"

interface MealPlannerProps {
  recipes: Recipe[]
}

type Meal = {
  id: string
  recipeId: string
  recipeName: string
  mealType: "breakfast" | "lunch" | "dinner" | "snack"
}

type DayPlan = {
  meals: Meal[]
}

type WeekPlan = {
  [key: string]: DayPlan
}

export function MealPlanner({ recipes }: MealPlannerProps) {
  const { toast } = useToast()
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date()
    const day = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const diff = today.getDate() - day
    return new Date(today.setDate(diff)) // Set to Sunday
  })

  const [weekPlan, setWeekPlan] = useState<WeekPlan>(() => {
    // Initialize empty week plan
    const plan: WeekPlan = {}
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]
      plan[dateStr] = { meals: [] }
    }
    return plan
  })

  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast")
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("")
  const [isAddMealOpen, setIsAddMealOpen] = useState(false)

  const getDayName = (date: Date): string => {
    return date.toLocaleDateString("en-US", { weekday: "long" })
  }

  const getFormattedDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const getWeekDates = (): { date: Date; dateStr: string }[] => {
    const dates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]
      dates.push({ date, dateStr })
    }
    return dates
  }

  const goToPreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(newWeekStart.getDate() - 7)
    setCurrentWeekStart(newWeekStart)

    // Initialize empty week plan for new week
    const plan: WeekPlan = { ...weekPlan }
    for (let i = 0; i < 7; i++) {
      const date = new Date(newWeekStart)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]
      if (!plan[dateStr]) {
        plan[dateStr] = { meals: [] }
      }
    }
    setWeekPlan(plan)
  }

  const goToNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart)
    newWeekStart.setDate(newWeekStart.getDate() + 7)
    setCurrentWeekStart(newWeekStart)

    // Initialize empty week plan for new week
    const plan: WeekPlan = { ...weekPlan }
    for (let i = 0; i < 7; i++) {
      const date = new Date(newWeekStart)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]
      if (!plan[dateStr]) {
        plan[dateStr] = { meals: [] }
      }
    }
    setWeekPlan(plan)
  }

  const openAddMealDialog = (dateStr: string) => {
    setSelectedDate(dateStr)
    setSelectedMealType("breakfast")
    setSelectedRecipeId("")
    setIsAddMealOpen(true)
  }

  const addMealToPlan = () => {
    if (!selectedRecipeId || !selectedDate) {
      toast({
        title: "Error",
        description: "Please select a recipe",
        variant: "destructive",
      })
      return
    }

    const recipe = recipes.find((r) => r._id?.toString() === selectedRecipeId)
    if (!recipe) return

    const newMeal: Meal = {
      id: Math.random().toString(36).substring(2, 9),
      recipeId: selectedRecipeId,
      recipeName: recipe.title,
      mealType: selectedMealType,
    }

    setWeekPlan((prev) => {
      const updatedPlan = { ...prev }
      if (!updatedPlan[selectedDate]) {
        updatedPlan[selectedDate] = { meals: [] }
      }
      updatedPlan[selectedDate].meals.push(newMeal)
      return updatedPlan
    })

    setIsAddMealOpen(false)
    toast({
      title: "Meal added",
      description: `${recipe.title} added to your meal plan`,
    })
  }

  const removeMeal = (dateStr: string, mealId: string) => {
    setWeekPlan((prev) => {
      const updatedPlan = { ...prev }
      if (updatedPlan[dateStr]) {
        updatedPlan[dateStr].meals = updatedPlan[dateStr].meals.filter((meal) => meal.id !== mealId)
      }
      return updatedPlan
    })

    toast({
      title: "Meal removed",
      description: "Meal removed from your plan",
    })
  }

  const getMealTypeColor = (mealType: string): string => {
    switch (mealType) {
      case "breakfast":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "lunch":
        return "bg-green-100 text-green-800 border-green-200"
      case "dinner":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "snack":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-bold text-brown-900 flex items-center">
          <Calendar className="mr-3 h-6 w-6 text-orange-500" />
          Meal Planner
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
            Previous Week
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextWeek}>
            Next Week
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {getWeekDates().map(({ date, dateStr }) => (
          <Card key={dateStr} className="overflow-hidden">
            <CardHeader className="p-3 bg-amber-50">
              <CardTitle className="text-center">
                <div className="text-sm font-medium">{getDayName(date)}</div>
                <div className="text-lg">{getFormattedDate(date)}</div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 min-h-[200px]">
              {weekPlan[dateStr]?.meals.length > 0 ? (
                <div className="space-y-2">
                  {weekPlan[dateStr].meals.map((meal) => (
                    <div key={meal.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getMealTypeColor(meal.mealType)}`}>
                          {meal.mealType}
                        </span>
                        <p className="text-sm mt-1 font-medium">{meal.recipeName}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => removeMeal(dateStr, meal.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <p className="text-sm">No meals planned</p>
                </div>
              )}
            </CardContent>
            <div className="p-3 border-t text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 w-full"
                onClick={() => openAddMealDialog(dateStr)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Meal
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Meal to Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Meal Type</label>
              <Select value={selectedMealType} onValueChange={(value: any) => setSelectedMealType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recipe</label>
              <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a recipe" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {recipes.map((recipe) => (
                    <SelectItem key={recipe._id?.toString()} value={recipe._id?.toString() || ""}>
                      {recipe.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsAddMealOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addMealToPlan} className="bg-orange-500 hover:bg-orange-600">
              Add to Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
