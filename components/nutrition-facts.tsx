import { Card, CardContent } from "@/components/ui/card"

interface NutritionFactsProps {
  nutritionalInfo: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    sugar?: number
    fiber?: number
    sodium?: number
    [key: string]: number | undefined
  }
  servings: number
}

export function NutritionFacts({ nutritionalInfo, servings }: NutritionFactsProps) {
  return (
    <Card className="border-amber-100 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-200 to-orange-200 h-2" />
      <CardContent className="p-6">
        <h2 className="text-2xl font-serif font-bold mb-4 text-gray-900">Nutrition Facts</h2>
        <p className="text-sm text-gray-500 mb-4">Amount per serving</p>

        <div className="border-t-2 border-b border-gray-300 py-2 mb-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Calories</span>
            <span className="font-bold text-lg">{nutritionalInfo.calories || 0}</span>
          </div>
        </div>

        <div className="border-b border-gray-200 py-1">
          <div className="flex justify-between items-center">
            <span className="font-bold">Total Fat</span>
            <span>{nutritionalInfo.fat || 0}g</span>
          </div>
        </div>

        <div className="border-b border-gray-200 py-1">
          <div className="flex justify-between items-center">
            <span className="font-bold">Total Carbohydrates</span>
            <span>{nutritionalInfo.carbs || 0}g</span>
          </div>
        </div>

        {nutritionalInfo.fiber !== undefined && (
          <div className="border-b border-gray-200 py-1 pl-4">
            <div className="flex justify-between items-center">
              <span>Dietary Fiber</span>
              <span>{nutritionalInfo.fiber}g</span>
            </div>
          </div>
        )}

        {nutritionalInfo.sugar !== undefined && (
          <div className="border-b border-gray-200 py-1 pl-4">
            <div className="flex justify-between items-center">
              <span>Sugars</span>
              <span>{nutritionalInfo.sugar}g</span>
            </div>
          </div>
        )}

        <div className="border-b border-gray-200 py-1">
          <div className="flex justify-between items-center">
            <span className="font-bold">Protein</span>
            <span>{nutritionalInfo.protein || 0}g</span>
          </div>
        </div>

        {nutritionalInfo.sodium !== undefined && (
          <div className="border-b border-gray-200 py-1">
            <div className="flex justify-between items-center">
              <span className="font-bold">Sodium</span>
              <span>{nutritionalInfo.sodium}mg</span>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4">
          * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending
          on your calorie needs.
        </p>
      </CardContent>
    </Card>
  )
}
