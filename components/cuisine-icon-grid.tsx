import Link from "next/link"
import Image from "next/image"
import type { Cuisine } from "@/lib/types"

interface CuisineIconGridProps {
  cuisines: Cuisine[]
}

export function CuisineIconGrid({ cuisines }: CuisineIconGridProps) {
  // Cuisine icons mapping with proper fallback images
  const cuisineIcons: Record<string, string> = {
    italian: "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=200&h=200&auto=format&fit=crop",
    indian: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&h=200&auto=format&fit=crop",
    mexican: "https://images.unsplash.com/photo-1613514785940-daed07799d9b?w=200&h=200&auto=format&fit=crop",
    chinese: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&h=200&auto=format&fit=crop",
    japanese: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=200&h=200&auto=format&fit=crop",
    mediterranean: "https://images.unsplash.com/photo-1594007654729-407eedc4fe0f?w=200&h=200&auto=format&fit=crop",
    american: "https://images.unsplash.com/photo-1551782450-17144efb9c50?w=200&h=200&auto=format&fit=crop",
    thai: "https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=200&h=200&auto=format&fit=crop",
    french: "https://images.unsplash.com/photo-1608855238293-a8853e7f7c98?w=200&h=200&auto=format&fit=crop",
    spanish: "https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=200&h=200&auto=format&fit=crop",
    greek: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?w=200&h=200&auto=format&fit=crop",
    korean: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=200&h=200&auto=format&fit=crop",
    vietnamese: "https://images.unsplash.com/photo-1511910849309-0dffb8785146?w=200&h=200&auto=format&fit=crop",
    middle_eastern: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=200&h=200&auto=format&fit=crop",
    caribbean: "https://images.unsplash.com/photo-1544378375-c4d3f5d01fb4?w=200&h=200&auto=format&fit=crop",
    african: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=200&h=200&auto=format&fit=crop",
    brazilian: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=200&h=200&auto=format&fit=crop",
    german: "https://images.unsplash.com/photo-1599921841143-819065a55cc8?w=200&h=200&auto=format&fit=crop",
    russian: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&auto=format&fit=crop",
    turkish: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200&h=200&auto=format&fit=crop",
  }

  // Fallback icon
  const defaultIcon = "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&auto=format&fit=crop"

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
      {cuisines.map((cuisine) => (
        <Link key={cuisine.slug} href={`/cuisines/${cuisine.slug}`} className="flex flex-col items-center group">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-2 mb-3 shadow-lg group-hover:shadow-xl group-hover:from-orange-100 group-hover:to-amber-200 transition-all duration-300 overflow-hidden">
            <div className="relative w-full h-full rounded-full overflow-hidden">
              <Image
                src={cuisineIcons[cuisine.slug] || cuisine.imageUrl || defaultIcon}
                alt={cuisine.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          <span className="text-center font-medium text-sm group-hover:text-orange-600 transition-colors">
            {cuisine.name}
          </span>
        </Link>
      ))}
    </div>
  )
}
