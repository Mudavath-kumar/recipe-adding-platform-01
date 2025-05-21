import Link from "next/link"
import Image from "next/image"
import type { Cuisine } from "@/lib/types"

interface CuisineIconGridProps {
  cuisines: Cuisine[]
}

export function CuisineIconGrid({ cuisines }: CuisineIconGridProps) {
  // Cuisine icons mapping
  const cuisineIcons: Record<string, string> = {
    italian: "/icons/italian.png",
    indian: "/icons/indian.png",
    mexican: "/icons/mexican.png",
    chinese: "/icons/chinese.png",
    japanese: "/icons/japanese.png",
    mediterranean: "/icons/mediterranean.png",
    american: "/icons/american.png",
    thai: "/icons/thai.png",
    french: "/icons/french.png",
    spanish: "/icons/spanish.png",
    greek: "/icons/greek.png",
    korean: "/icons/korean.png",
    vietnamese: "/icons/vietnamese.png",
    middle_eastern: "/icons/middle_eastern.png",
  }

  // Fallback icon
  const defaultIcon = "/icons/default-cuisine.png"

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
      {cuisines.map((cuisine) => (
        <Link key={cuisine.slug} href={`/cuisines/${cuisine.slug}`} className="flex flex-col items-center group">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-amber-50 flex items-center justify-center p-4 mb-3 shadow-md group-hover:shadow-lg group-hover:bg-orange-100 transition-all duration-300">
            <div className="relative w-full h-full">
              <Image
                src={cuisineIcons[cuisine.slug] || defaultIcon}
                alt={cuisine.name}
                fill
                className="object-contain p-1 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
          <span className="text-center font-medium group-hover:text-orange-600 transition-colors">{cuisine.name}</span>
        </Link>
      ))}
    </div>
  )
}
