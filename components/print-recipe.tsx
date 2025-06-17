"use client"

import { useState } from "react"
import { Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Recipe } from "@/lib/types"

interface PrintRecipeProps {
  recipe: Recipe
}

export function PrintRecipe({ recipe }: PrintRecipeProps) {
  const [isPrinting, setIsPrinting] = useState(false)

  const handlePrint = () => {
    setIsPrinting(true)

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    // Generate print-friendly HTML
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${recipe.title} | RecipeHaven</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          h2 {
            font-size: 18px;
            margin-top: 20px;
            margin-bottom: 10px;
          }
          .recipe-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #666;
          }
          .recipe-meta div {
            display: flex;
            align-items: center;
          }
          .ingredients-list {
            padding-left: 20px;
          }
          .instructions {
            white-space: pre-line;
          }
          .recipe-footer {
            margin-top: 30px;
            font-size: 12px;
            color: #666;
            text-align: center;
            border-top: 1px solid #ddd;
            padding-top: 10px;
          }
          @media print {
            body {
              font-size: 12pt;
            }
            h1 {
              font-size: 18pt;
            }
            h2 {
              font-size: 14pt;
            }
          }
        </style>
      </head>
      <body>
        <h1>${recipe.title}</h1>
        <p>${recipe.description}</p>
        
        <div class="recipe-meta">
          <div>
            <strong>Cooking Time:</strong> ${recipe.cookingTime} minutes
          </div>
          <div>
            <strong>Servings:</strong> ${recipe.servings}
          </div>
          <div>
            <strong>Difficulty:</strong> ${recipe.difficulty}
          </div>
          <div>
            <strong>Cuisine:</strong> ${recipe.cuisine}
          </div>
        </div>
        
        <h2>Ingredients</h2>
        <ul class="ingredients-list">
          ${recipe.ingredients.map((ingredient) => `<li>${ingredient}</li>`).join("")}
        </ul>
        
        <h2>Instructions</h2>
        <div class="instructions">
          ${recipe.instructions.replace(/\n\n/g, "<br><br>")}
        </div>
        
        ${
          recipe.nutritionalInfo
            ? `
        <h2>Nutrition Facts (per serving)</h2>
        <ul>
          ${recipe.nutritionalInfo.calories ? `<li><strong>Calories:</strong> ${recipe.nutritionalInfo.calories}</li>` : ""}
          ${recipe.nutritionalInfo.protein ? `<li><strong>Protein:</strong> ${recipe.nutritionalInfo.protein}g</li>` : ""}
          ${recipe.nutritionalInfo.carbs ? `<li><strong>Carbs:</strong> ${recipe.nutritionalInfo.carbs}g</li>` : ""}
          ${recipe.nutritionalInfo.fat ? `<li><strong>Fat:</strong> ${recipe.nutritionalInfo.fat}g</li>` : ""}
          ${recipe.nutritionalInfo.fiber ? `<li><strong>Fiber:</strong> ${recipe.nutritionalInfo.fiber}g</li>` : ""}
          ${recipe.nutritionalInfo.sugar ? `<li><strong>Sugar:</strong> ${recipe.nutritionalInfo.sugar}g</li>` : ""}
        </ul>
        `
            : ""
        }
        
        <div class="recipe-footer">
          <p>Recipe from RecipeHaven | Printed on ${new Date().toLocaleDateString()}</p>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `

    // Write to the new window and trigger print
    printWindow.document.open()
    printWindow.document.write(printContent)
    printWindow.document.close()

    // Reset printing state
    setTimeout(() => {
      setIsPrinting(false)
    }, 1000)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="bg-white/90 rounded-full hover:bg-white"
      onClick={handlePrint}
      disabled={isPrinting}
    >
      <Printer className={`h-5 w-5 ${isPrinting ? "text-gray-400" : "text-orange-600"}`} />
      <span className="sr-only">Print recipe</span>
    </Button>
  )
}
