"use server"

import clientPromise from "./mongodb"
import type { Cuisine } from "./types"

// Get all cuisines
export async function getAllCuisines(): Promise<Cuisine[]> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("cuisines")

    const cuisines = await collection.find({}).sort({ name: 1 }).toArray()
    return cuisines as Cuisine[]
  } catch (error) {
    console.error("Error fetching cuisines:", error)
    return []
  }
}

// Get cuisine by slug
export async function getCuisineBySlug(slug: string): Promise<Cuisine | null> {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("cuisines")

    const cuisine = await collection.findOne({ slug })
    return cuisine as Cuisine
  } catch (error) {
    console.error("Error fetching cuisine by slug:", error)
    return null
  }
}

// Initialize default cuisines if none exist
export async function initializeCuisines() {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("cuisines")

    const count = await collection.countDocuments()
    if (count === 0) {
      const defaultCuisines: Omit<Cuisine, "_id">[] = [
        {
          name: "Italian",
          slug: "italian",
          description: "Classic Italian dishes from pasta to pizza",
          imageUrl:
            "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGl0YWxpYW4lMjBmb29kfGVufDB8fDB8fHww",
        },
        {
          name: "Indian",
          slug: "indian",
          description: "Flavorful and spicy Indian cuisine",
          imageUrl:
            "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
        },
        {
          name: "Mexican",
          slug: "mexican",
          description: "Vibrant and bold Mexican flavors",
          imageUrl:
            "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWV4aWNhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
        },
        {
          name: "Chinese",
          slug: "chinese",
          description: "Traditional and modern Chinese recipes",
          imageUrl:
            "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpbmVzZSUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
        },
        {
          name: "Japanese",
          slug: "japanese",
          description: "Elegant and precise Japanese cooking",
          imageUrl:
            "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFwYW5lc2UlMjBmb29kfGVufDB8fDB8fHww",
        },
        {
          name: "Mediterranean",
          slug: "mediterranean",
          description: "Healthy and flavorful Mediterranean dishes",
          imageUrl:
            "https://images.unsplash.com/photo-1594007654729-407eedc4fe0f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRlcnJhbmVhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
        },
        {
          name: "American",
          slug: "american",
          description: "Classic American comfort food",
          imageUrl:
            "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww",
        },
        {
          name: "Thai",
          slug: "thai",
          description: "Aromatic and spicy Thai cuisine",
          imageUrl:
            "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGhhaSUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
        },
        {
          name: "French",
          slug: "french",
          description: "Sophisticated and elegant French cuisine",
          imageUrl:
            "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlbmNoJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
        },
        {
          name: "Spanish",
          slug: "spanish",
          description: "Flavorful Spanish dishes including tapas and paella",
          imageUrl:
            "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3BhbmlzaCUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
        },
        {
          name: "Greek",
          slug: "greek",
          description: "Fresh and healthy Greek cuisine",
          imageUrl:
            "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JlZWslMjBmb29kfGVufDB8fDB8fHww",
        },
        {
          name: "Korean",
          slug: "korean",
          description: "Bold and flavorful Korean dishes",
          imageUrl:
            "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a29yZWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
        },
      ]

      await collection.insertMany(defaultCuisines)
    }
  } catch (error) {
    console.error("Error initializing cuisines:", error)
  }
}

// Update cuisine images if they're using placeholders
export async function updateCuisineImages() {
  try {
    const client = await clientPromise
    const collection = client.db("recipe-app").collection("cuisines")

    const cuisines = await collection
      .find({
        imageUrl: { $regex: "/placeholder.svg" },
      })
      .toArray()

    const cuisineImages = {
      italian:
        "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGl0YWxpYW4lMjBmb29kfGVufDB8fDB8fHww",
      indian:
        "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
      mexican:
        "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWV4aWNhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      chinese:
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hpbmVzZSUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      japanese:
        "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8amFwYW5lc2UlMjBmb29kfGVufDB8fDB8fHww",
      mediterranean:
        "https://images.unsplash.com/photo-1594007654729-407eedc4fe0f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWVkaXRlcnJhbmVhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      american:
        "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnVyZ2VyfGVufDB8fDB8fHww",
      thai: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGhhaSUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      french:
        "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZnJlbmNoJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
      spanish:
        "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3BhbmlzaCUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      greek:
        "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JlZWslMjBmb29kfGVufDB8fDB8fHww",
      korean:
        "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8a29yZWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
      vietnamese:
        "https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dmlldG5hbWVzZSUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      middle_eastern:
        "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWlkZGxlJTIwZWFzdGVybiUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
      caribbean:
        "https://images.unsplash.com/photo-1544378375-c4d3f5d01fb4?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FyaWJiZWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D",
      african:
        "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWZyaWNhbiUyMGZvb2R8ZW58MHx8MHx8fDA%3D",
    }

    for (const cuisine of cuisines) {
      if (cuisine.slug && cuisineImages[cuisine.slug]) {
        await collection.updateOne({ _id: cuisine._id }, { $set: { imageUrl: cuisineImages[cuisine.slug] } })
      }
    }
  } catch (error) {
    console.error("Error updating cuisine images:", error)
  }
}
