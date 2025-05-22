import { getAllRecipes } from "@/lib/recipes"
import { MealPlanner } from "@/components/meal-planner"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function MealPlannerPage() {
  const user = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login")
  }

  const recipes = await getAllRecipes()

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-serif font-bold text-brown-900 mb-6">Weekly Meal Planner</h1>
      <p className="text-brown-600 mb-8 max-w-3xl">
        Plan your meals for the week ahead. Drag and drop recipes to different days and meal times to create your
        perfect meal plan.
      </p>

      <MealPlanner recipes={recipes} />

      <div className="mt-12 bg-amber-50 p-6 rounded-lg">
        <h2 className="text-xl font-serif font-bold text-brown-900 mb-4">Tips for Meal Planning</h2>
        <ul className="space-y-2 list-disc pl-5">
          <li>Plan your meals around seasonal ingredients for the best flavor and value</li>
          <li>Batch cook on weekends to save time during busy weekdays</li>
          <li>Include a variety of proteins, carbs, and vegetables for balanced nutrition</li>
          <li>Consider leftovers when planning to reduce food waste</li>
          <li>Keep some quick and easy recipes for days when you have less time</li>
        </ul>
      </div>
    </div>
  )
}
