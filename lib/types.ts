import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  createdAt: Date
  favorites: string[] // Array of recipe IDs
  collections?: RecipeCollection[]
}

export interface Recipe {
  _id?: ObjectId
  title: string
  description: string
  ingredients: string[]
  instructions: string
  cookingTime: number
  servings: number
  difficulty: "easy" | "medium" | "hard"
  imageUrl: string
  category: string
  cuisine: string
  dietary: string[]
  authorId: string
  authorName: string
  createdAt: Date
  ratings: Rating[]
  averageRating: number
  nutritionalInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    sugar?: number
    fiber?: number
    sodium?: number
    [key: string]: number | undefined
  }
  featured?: boolean
}

export interface Rating {
  userId: string
  value: number
  comment?: string
  createdAt: Date
}

export interface Category {
  _id?: ObjectId
  name: string
  slug: string
  description: string
  imageUrl: string
}

export interface Cuisine {
  _id?: ObjectId
  name: string
  slug: string
  description: string
  imageUrl: string
}

export interface RecipeInput {
  title: string
  description: string
  ingredients: string[]
  instructions: string
  cookingTime: number
  servings: number
  difficulty: "easy" | "medium" | "hard"
  imageUrl: string
  category: string
  cuisine: string
  dietary: string[]
  nutritionalInfo?: {
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    sugar?: number
    fiber?: number
    sodium?: number
    [key: string]: number | undefined
  }
}

export interface RecipeCollection {
  _id?: ObjectId
  name: string
  description?: string
  recipeIds: string[]
  createdAt: Date
  userId: string
  isPublic: boolean
}
