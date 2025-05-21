"use server"

import clientPromise from "./mongodb"
import type { Category } from "./types"

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("categories")

    const categories = await collection.find({}).sort({ name: 1 }).toArray()
    return categories as Category[]
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

// Get category by slug
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("categories")

    const category = await collection.findOne({ slug })
    return category as Category
  } catch (error) {
    console.error("Error fetching category by slug:", error)
    return null
  }
}

// Initialize default categories if none exist
export async function initializeCategories() {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("categories")

    const count = await collection.countDocuments()
    if (count === 0) {
      const defaultCategories: Omit<Category, "_id">[] = [
        {
          name: "Breakfast",
          slug: "breakfast",
          description: "Start your day with these delicious breakfast recipes",
          imageUrl:
            "https://images.unsplash.com/photo-1533089860892-a9b9ac6cd6a4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJlYWtmYXN0fGVufDB8fDB8fHww",
        },
        {
          name: "Lunch",
          slug: "lunch",
          description: "Perfect meals for your midday break",
          imageUrl:
            "https://images.unsplash.com/photo-1547496502-affa22d38842?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGx1bmNofGVufDB8fDB8fHww",
        },
        {
          name: "Dinner",
          slug: "dinner",
          description: "Hearty and satisfying dinner recipes for the whole family",
          imageUrl:
            "https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRpbm5lcnxlbnwwfHwwfHx8MA%3D%3D",
        },
        {
          name: "Desserts",
          slug: "desserts",
          description: "Sweet treats to satisfy your cravings",
          imageUrl:
            "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzc2VydHN8ZW58MHx8MHx8fDA%3D",
        },
        {
          name: "Snacks",
          slug: "snacks",
          description: "Quick and easy snack ideas",
          imageUrl:
            "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25hY2tzfGVufDB8fDB8fHww",
        },
        {
          name: "Drinks",
          slug: "drinks",
          description: "Refreshing beverages for any occasion",
          imageUrl:
            "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZHJpbmtzfGVufDB8fDB8fHww",
        },
      ]

      await collection.insertMany(defaultCategories)
    }
  } catch (error) {
    console.error("Error initializing categories:", error)
  }
}

// Update category images if they're using placeholders
export async function updateCategoryImages() {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("categories")

    const categories = await collection
      .find({
        imageUrl: { $regex: "/placeholder.svg" },
      })
      .toArray()

    const categoryImages = {
      breakfast:
        "https://images.unsplash.com/photo-1533089860892-a9b9ac6cd6a4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJlYWtmYXN0fGVufDB8fDB8fHww",
      lunch:
        "https://images.unsplash.com/photo-1547496502-affa22d38842?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGx1bmNofGVufDB8fDB8fHww",
      dinner:
        "https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGRpbm5lcnxlbnwwfHwwfHx8MA%3D%3D",
      desserts:
        "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVzc2VydHN8ZW58MHx8MHx8fDA%3D",
      snacks:
        "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c25hY2tzfGVufDB8fDB8fHww",
      drinks:
        "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZHJpbmtzfGVufDB8fDB8fHww",
    }

    for (const category of categories) {
      if (category.slug && categoryImages[category.slug]) {
        await collection.updateOne({ _id: category._id }, { $set: { imageUrl: categoryImages[category.slug] } })
      }
    }
  } catch (error) {
    console.error("Error updating category images:", error)
  }
}
