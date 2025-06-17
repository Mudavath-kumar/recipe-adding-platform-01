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
          imageUrl: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&auto=format&fit=crop",
        },
        {
          name: "Indian",
          slug: "indian",
          description: "Flavorful and spicy Indian cuisine",
          imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop",
        },
        {
          name: "Mexican",
          slug: "mexican",
          description: "Vibrant and bold Mexican flavors",
          imageUrl: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&auto=format&fit=crop",
        },
        {
          name: "Chinese",
          slug: "chinese",
          description: "Traditional and modern Chinese recipes",
          imageUrl: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop",
        },
        {
          name: "Japanese",
          slug: "japanese",
          description: "Elegant and precise Japanese cooking",
          imageUrl: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop",
        },
        {
          name: "Mediterranean",
          slug: "mediterranean",
          description: "Healthy and flavorful Mediterranean dishes",
          imageUrl: "https://images.unsplash.com/photo-1594007654729-407eedc4fe0f?w=800&auto=format&fit=crop",
        },
        {
          name: "American",
          slug: "american",
          description: "Classic American comfort food",
          imageUrl: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&auto=format&fit=crop",
        },
        {
          name: "Thai",
          slug: "thai",
          description: "Aromatic and spicy Thai cuisine",
          imageUrl: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop",
        },
        {
          name: "French",
          slug: "french",
          description: "Sophisticated and elegant French cuisine",
          imageUrl: "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=800&auto=format&fit=crop",
        },
        {
          name: "Spanish",
          slug: "spanish",
          description: "Flavorful Spanish dishes including tapas and paella",
          imageUrl: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&auto=format&fit=crop",
        },
        {
          name: "Greek",
          slug: "greek",
          description: "Fresh and healthy Greek cuisine",
          imageUrl: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=800&auto=format&fit=crop",
        },
        {
          name: "Korean",
          slug: "korean",
          description: "Bold and flavorful Korean dishes",
          imageUrl: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop",
        },
        {
          name: "Vietnamese",
          slug: "vietnamese",
          description: "Fresh and aromatic Vietnamese cuisine",
          imageUrl: "https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=800&auto=format&fit=crop",
        },
        {
          name: "Middle Eastern",
          slug: "middle_eastern",
          description: "Rich and aromatic Middle Eastern flavors",
          imageUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop",
        },
        {
          name: "Caribbean",
          slug: "caribbean",
          description: "Tropical and vibrant Caribbean cuisine",
          imageUrl: "https://images.unsplash.com/photo-1544378375-c4d3f5d01fb4?w=800&auto=format&fit=crop",
        },
        {
          name: "African",
          slug: "african",
          description: "Diverse and flavorful African dishes",
          imageUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&auto=format&fit=crop",
        },
        {
          name: "Brazilian",
          slug: "brazilian",
          description: "Vibrant Brazilian cuisine and barbecue",
          imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop",
        },
        {
          name: "German",
          slug: "german",
          description: "Hearty and traditional German dishes",
          imageUrl: "https://images.unsplash.com/photo-1599921841143-819065a55cc8?w=800&auto=format&fit=crop",
        },
        {
          name: "Russian",
          slug: "russian",
          description: "Traditional Russian comfort food",
          imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop",
        },
        {
          name: "Turkish",
          slug: "turkish",
          description: "Rich and diverse Turkish cuisine",
          imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop",
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
      italian: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=800&auto=format&fit=crop",
      indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop",
      mexican: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=800&auto=format&fit=crop",
      chinese: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop",
      japanese: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop",
      mediterranean: "https://images.unsplash.com/photo-1594007654729-407eedc4fe0f?w=800&auto=format&fit=crop",
      american: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=800&auto=format&fit=crop",
      thai: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=800&auto=format&fit=crop",
      french: "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=800&auto=format&fit=crop",
      spanish: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&auto=format&fit=crop",
      greek: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=800&auto=format&fit=crop",
      korean: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop",
      vietnamese: "https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=800&auto=format&fit=crop",
      middle_eastern: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop",
      caribbean: "https://images.unsplash.com/photo-1544378375-c4d3f5d01fb4?w=800&auto=format&fit=crop",
      african: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=800&auto=format&fit=crop",
      brazilian: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop",
      german: "https://images.unsplash.com/photo-1599921841143-819065a55cc8?w=800&auto=format&fit=crop",
      russian: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop",
      turkish: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800&auto=format&fit=crop",
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
