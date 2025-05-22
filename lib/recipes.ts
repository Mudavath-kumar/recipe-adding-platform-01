"use server"

import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import { getCurrentUser } from "./auth"
import type { Recipe, RecipeInput } from "./types"

// Get all recipes
export async function getAllRecipes(): Promise<Recipe[]> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const recipes = await collection.find({}).sort({ createdAt: -1 }).toArray()
    return recipes as Recipe[]
  } catch (error) {
    console.error("Error fetching all recipes:", error)
    return []
  }
}

// Get recipe by ID
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const recipe = await collection.findOne({ _id: new ObjectId(id) })
    return recipe as Recipe
  } catch (error) {
    console.error("Error fetching recipe by ID:", error)
    return null
  }
}

// Create a new recipe
export async function createRecipe(recipeData: RecipeInput): Promise<Recipe | null> {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const newRecipe = {
      ...recipeData,
      authorId: user._id?.toString(),
      authorName: user.name,
      createdAt: new Date(),
      ratings: [],
      averageRating: 0,
    }

    const result = await collection.insertOne(newRecipe)

    return {
      _id: result.insertedId,
      ...newRecipe,
    } as Recipe
  } catch (error) {
    console.error("Error creating recipe:", error)
    return null
  }
}

// Update a recipe
export async function updateRecipe(id: string, recipeData: RecipeInput): Promise<Recipe | null> {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const recipe = await collection.findOne({ _id: new ObjectId(id) })
    if (!recipe || recipe.authorId !== user._id?.toString()) {
      return null
    }

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: recipeData })

    return {
      _id: new ObjectId(id),
      ...recipe,
      ...recipeData,
    } as Recipe
  } catch (error) {
    console.error("Error updating recipe:", error)
    return null
  }
}

// Delete a recipe
export async function deleteRecipe(id: string): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const recipe = await collection.findOne({ _id: new ObjectId(id) })
    if (!recipe || recipe.authorId !== user._id?.toString()) {
      return false
    }

    await collection.deleteOne({ _id: new ObjectId(id) })
    return true
  } catch (error) {
    console.error("Error deleting recipe:", error)
    return false
  }
}

// Rate a recipe
export async function rateRecipe(recipeId: string, rating: number, comment?: string): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const recipe = (await collection.findOne({ _id: new ObjectId(recipeId) })) as Recipe
    if (!recipe) {
      return false
    }

    // Check if user already rated
    const existingRatingIndex = recipe.ratings.findIndex((r) => r.userId === user._id?.toString())

    const newRatings = [...recipe.ratings]
    const newRating = {
      userId: user._id?.toString() || "",
      value: rating,
      comment,
      createdAt: new Date(),
    }

    if (existingRatingIndex >= 0) {
      // Update existing rating
      newRatings[existingRatingIndex] = newRating
    } else {
      // Add new rating
      newRatings.push(newRating)
    }

    // Calculate average rating
    const averageRating = newRatings.reduce((sum, r) => sum + r.value, 0) / newRatings.length

    await collection.updateOne({ _id: new ObjectId(recipeId) }, { $set: { ratings: newRatings, averageRating } })
    return true
  } catch (error) {
    console.error("Error rating recipe:", error)
    return false
  }
}

// Get user recipes
export async function getUserRecipes(userId: string): Promise<Recipe[]> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const recipes = await collection.find({ authorId: userId }).sort({ createdAt: -1 }).toArray()
    return recipes as Recipe[]
  } catch (error) {
    console.error("Error fetching user recipes:", error)
    return []
  }
}

// Get recipes with pagination and filters
export async function getRecipes({
  page = 1,
  limit = 12,
  category = "",
  cuisine = "",
  dietary = "",
  search = "",
  sortBy = "newest" | "popular" | "rating",
  difficulty = "",
  cookingTime = 0,
}: {
  page?: number
  limit?: number
  category?: string
  cuisine?: string
  dietary?: string
  search?: string
  sortBy?: "newest" | "popular" | "rating"
  difficulty?: string
  cookingTime?: number
}): Promise<{ recipes: Recipe[]; total: number }> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const skip = (page - 1) * limit

    // Build query
    const query: any = {}
    if (category) query.category = category
    if (cuisine) query.cuisine = cuisine
    if (dietary) query.dietary = dietary
    if (difficulty) query.difficulty = difficulty
    if (cookingTime > 0) query.cookingTime = { $lte: cookingTime }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { ingredients: { $elemMatch: { $regex: search, $options: "i" } } },
      ]
    }

    // Determine sort order
    let sortOptions: any = { createdAt: -1 } // default to newest
    if (sortBy === "popular") {
      sortOptions = { "ratings.length": -1 }
    } else if (sortBy === "rating") {
      sortOptions = { averageRating: -1 }
    }

    const total = await collection.countDocuments(query)
    const recipes = await collection.find(query).sort(sortOptions).skip(skip).limit(limit).toArray()

    return { recipes: recipes as Recipe[], total }
  } catch (error) {
    console.error("Error fetching filtered recipes:", error)
    return { recipes: [], total: 0 }
  }
}

// Get newly added recipes
export async function getNewlyAddedRecipes(limit = 6): Promise<Recipe[]> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const recipes = await collection.find({}).sort({ createdAt: -1 }).limit(limit).toArray()
    return recipes as Recipe[]
  } catch (error) {
    console.error("Error fetching newly added recipes:", error)
    return []
  }
}

// Get popular recipes
export async function getPopularRecipes(limit = 6): Promise<Recipe[]> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const recipes = await collection.find({}).sort({ averageRating: -1 }).limit(limit).toArray()
    return recipes as Recipe[]
  } catch (error) {
    console.error("Error fetching popular recipes:", error)
    return []
  }
}

// Get featured recipes
export async function getFeaturedRecipes(limit = 5): Promise<Recipe[]> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    // Get recipes with highest ratings and at least 3 reviews
    const recipes = await collection
      .find({ "ratings.3": { $exists: true } }) // At least 3 ratings
      .sort({ averageRating: -1 })
      .limit(limit)
      .toArray()

    // If not enough recipes with 3+ ratings, get the most popular ones
    if (recipes.length < limit) {
      const additionalRecipes = await collection
        .find({ _id: { $nin: recipes.map((r) => r._id) } })
        .sort({ averageRating: -1 })
        .limit(limit - recipes.length)
        .toArray()

      recipes.push(...additionalRecipes)
    }

    return recipes as Recipe[]
  } catch (error) {
    console.error("Error fetching featured recipes:", error)
    return []
  }
}

// Get similar recipes
export async function getSimilarRecipes(recipeId: string, limit = 4): Promise<Recipe[]> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    // Get the current recipe
    const currentRecipe = (await collection.findOne({ _id: new ObjectId(recipeId) })) as Recipe
    if (!currentRecipe) return []

    // Find recipes with same category or cuisine
    const similarRecipes = await collection
      .find({
        _id: { $ne: new ObjectId(recipeId) },
        $or: [
          { category: currentRecipe.category },
          { cuisine: currentRecipe.cuisine },
          { difficulty: currentRecipe.difficulty },
        ],
      })
      .sort({ averageRating: -1 })
      .limit(limit)
      .toArray()

    return similarRecipes as Recipe[]
  } catch (error) {
    console.error("Error fetching similar recipes:", error)
    return []
  }
}

// Get recipes by dietary preference
export async function getRecipesByDietary(dietary: string, limit = 10): Promise<Recipe[]> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const recipes = await collection.find({ dietary: dietary }).sort({ averageRating: -1 }).limit(limit).toArray()

    return recipes as Recipe[]
  } catch (error) {
    console.error(`Error fetching recipes for dietary ${dietary}:`, error)
    return []
  }
}

// Initialize sample recipes if none exist
export async function initializeSampleRecipes() {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const count = await collection.countDocuments()
    if (count === 0) {
      // Import sample recipes
      const { sampleRecipes } = await import("./sample-recipes")
      const { additionalRecipes } = await import("./additional-recipes")

      // Combine all recipes
      const allRecipes = [...sampleRecipes, ...additionalRecipes]

      await collection.insertMany(allRecipes)
    }
  } catch (error) {
    console.error("Error initializing sample recipes:", error)
  }
}

// Get recipes by IDs
export async function getRecipesByIds(ids: string[]): Promise<Recipe[]> {
  try {
    if (ids.length === 0) return []

    const client = await clientPromise
    const collection = client.db("recipe-app").collection("recipes")

    const objectIds = ids.map((id) => new ObjectId(id))
    const recipes = await collection.find({ _id: { $in: objectIds } }).toArray()

    // Sort recipes to match the order of the input IDs
    const recipeMap = new Map(recipes.map((recipe) => [recipe._id?.toString(), recipe]))
    const sortedRecipes = ids.map((id) => recipeMap.get(id)).filter((recipe) => recipe !== undefined) as Recipe[]

    return sortedRecipes
  } catch (error) {
    console.error("Error fetching recipes by IDs:", error)
    return []
  }
}
