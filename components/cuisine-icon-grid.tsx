import Link from "next/link"
import Image from "next/image"
import type { Cuisine } from "@/lib/types"

interface CuisineIconGridProps {
  cuisines: Cuisine[]
}

export function CuisineIconGrid({ cuisines }: CuisineIconGridProps) {
  const cuisineImages = [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&auto=format&fit=crop", // Italian
    "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=400&auto=format&fit=crop", // Indian
    "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=400&h=400&auto=format&fit=crop", // Mexican
    "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&h=400&auto=format&fit=crop", // Chinese
    "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=400&h=400&auto=format&fit=crop", // Japanese
    "https://images.unsplash.com/photo-1594007654729-407eedc4fe0f?w=400&h=400&auto=format&fit=crop", // Mediterranean
    "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=400&h=400&auto=format&fit=crop", // American
    "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=400&h=400&auto=format&fit=crop", // Thai
    "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=400&h=400&auto=format&fit=crop", // French
    "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=400&h=400&auto=format&fit=crop", // Spanish
    "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=400&h=400&auto=format&fit=crop", // Greek
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&auto=format&fit=crop", // Korean
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
      {cuisines.slice(0, 12).map((cuisine, index) => (
        <Link
          key={cuisine.slug}
          href={`/cuisines/${cuisine.slug}`}
          className="group relative transform hover:scale-125 transition-all duration-500 hover-explode"
        >
          <div className="relative bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-lg rounded-3xl p-6 shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] border-2 border-white/30 animate-neon-glow">
            {/* Cuisine Image */}
            <div className="relative h-20 w-20 mx-auto mb-4 rounded-2xl overflow-hidden">
              <Image
                src={
                  cuisineImages[index] ||
                  cuisine.imageUrl ||
                  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&auto=format&fit=crop"
                }
                alt={cuisine.name}
                fill
                className="object-cover group-hover:scale-150 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-orange-500/50"></div>
            </div>

            {/* Country Name */}
            <h3 className="text-white font-black text-center text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-500 transition-all duration-300 text-glow">
              {cuisine.name}
            </h3>

            {/* Rainbow Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-red-500/30 to-pink-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl animate-pulse-rainbow"></div>
          </div>
        </Link>
      ))}
    </div>
  )
}
