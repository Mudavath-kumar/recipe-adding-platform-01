"use server"

import { ObjectId } from "mongodb"
import clientPromise from "./mongodb"
import { getCurrentUser } from "./auth"
import type { RecipeCollection } from "./types"

// Create a new collection
export async function createCollection({
  name,
  description,
  isPublic,
  userId,
}: {
  name: string
  description?: string
  isPublic: boolean
  userId: string
}): Promise<RecipeCollection | null> {
  try {
    const user = await getCurrentUser()
    if (!user) return null

    const client = await clientPromise
    const collection = client.db("recipe-app").collection("collections")

    const newCollection = {
      name,
      description,
      recipeIds: [],
      createdAt: new Date(),
      userId: userId || user._id?.toString(),
      isPublic,
    }

    const result = await collection.insertOne(newCollection)

    return {
      _id: result.insertedId,
      ...newCollection,
    } as RecipeCollection
  } catch (error) {
    console.error("Error creating collection:", error)
    return null
  }
}

// Get user collections
export async function getUserCollections(userId: string): Promise<RecipeCollection[]> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("collections")

    const collections = await collection.find({ userId }).sort({ createdAt: -1 }).toArray()
    return collections as RecipeCollection[]
  } catch (error) {
    console.error("Error fetching user collections:", error)
    return []
  }
}

// Get collection by ID
export async function getCollectionById(id: string): Promise<RecipeCollection | null> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("collections")

    const result = await collection.findOne({ _id: new ObjectId(id) })
    return result as RecipeCollection
  } catch (error) {
    console.error("Error fetching collection by ID:", error)
    return null
  }
}

// Update collection
export async function updateCollection(
  id: string,
  data: {
    name?: string
    description?: string
    isPublic?: boolean
  },
): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const client = await clientPromise
    const collection = client.db("recipe-app").collection("collections")

    const existingCollection = await collection.findOne({ _id: new ObjectId(id) })
    if (!existingCollection || existingCollection.userId !== user._id?.toString()) {
      return false
    }

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: data })
    return true
  } catch (error) {
    console.error("Error updating collection:", error)
    return false
  }
}

// Delete collection
export async function deleteCollection(id: string): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const client = await clientPromise
    const collection = client.db("recipe-app").collection("collections")

    const existingCollection = await collection.findOne({ _id: new ObjectId(id) })
    if (!existingCollection || existingCollection.userId !== user._id?.toString()) {
      return false
    }

    await collection.deleteOne({ _id: new ObjectId(id) })
    return true
  } catch (error) {
    console.error("Error deleting collection:", error)
    return false
  }
}

// Add recipe to collection
export async function addRecipeToCollection(collectionId: string, recipeId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const client = await clientPromise
    const collection = client.db("recipe-app").collection("collections")

    const existingCollection = await collection.findOne({ _id: new ObjectId(collectionId) })
    if (!existingCollection || existingCollection.userId !== user._id?.toString()) {
      return false
    }

    await collection.updateOne({ _id: new ObjectId(collectionId) }, { $addToSet: { recipeIds: recipeId } })
    return true
  } catch (error) {
    console.error("Error adding recipe to collection:", error)
    return false
  }
}

// Remove recipe from collection
export async function removeRecipeFromCollection(collectionId: string, recipeId: string): Promise<boolean> {
  try {
    const user = await getCurrentUser()
    if (!user) return false

    const client = await clientPromise
    const collection = client.db("recipe-app").collection("collections")

    const existingCollection = await collection.findOne({ _id: new ObjectId(collectionId) })
    if (!existingCollection || existingCollection.userId !== user._id?.toString()) {
      return false
    }

    await collection.updateOne({ _id: new ObjectId(collectionId) }, { $pull: { recipeIds: recipeId } })
    return true
  } catch (error) {
    console.error("Error removing recipe from collection:", error)
    return false
  }
}

// Get public collections
export async function getPublicCollections(limit = 10): Promise<RecipeCollection[]> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("collections")

    const collections = await collection.find({ isPublic: true }).sort({ createdAt: -1 }).limit(limit).toArray()
    return collections as RecipeCollection[]
  } catch (error) {
    console.error("Error fetching public collections:", error)
    return []
  }
}
