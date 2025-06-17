import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, Utensils, TrendingUp, Award } from "lucide-react"
import { initializeSampleRecipes } from "@/lib/recipes"

import { Button } from "@/components/ui/button"
import { getNewlyAddedRecipes, getPopularRecipes, getFeaturedRecipes } from "@/lib/recipes"
import { getAllCategories } from "@/lib/categories"
import { getAllCuisines } from "@/lib/cuisines"
import { initializeCategories, updateCategoryImages } from "@/lib/categories"
import { initializeCuisines, updateCuisineImages } from "@/lib/cuisines"
import { SearchBar } from "@/components/search-bar"
import { FeaturedRecipeCarousel } from "@/components/featured-recipe-carousel"
import { RecipeCard } from "@/components/recipe-card"
import { CuisineIconGrid } from "@/components/cuisine-icon-grid"

export default async function Home() {
  // Initialize default data if needed and update images
  await Promise.all([
    initializeCategories(),
    initializeCuisines(),
    updateCategoryImages(),
    updateCuisineImages(),
    initializeSampleRecipes(),
  ])

  // Fetch data for the homepage
  const [newRecipes, popularRecipes, featuredRecipes, categories, cuisines] = await Promise.all([
    getNewlyAddedRecipes(10),
    getPopularRecipes(10),
    getFeaturedRecipes(5),
    getAllCategories(),
    getAllCuisines(),
  ])

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=2070&auto=format&fit=crop"
            alt="Cooking background"
            fill
            className="object-cover brightness-[0.4]"
            priority
          />
        </div>

        {/* Content */}
        <div className="container relative z-10 px-4 py-32 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white leading-tight">
              Discover <span className="text-orange-400">Delicious</span> Recipes
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto">
              Find and share the best recipes from around the world. Join our community of food lovers!
            </p>

            <div className="max-w-2xl mx-auto mb-12">
              <SearchBar className="shadow-xl" />
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg">
                <Link href="/explore/popular">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Popular Recipes
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-orange-400 text-orange-400 hover:bg-orange-900/20 px-8 py-6 text-lg"
              >
                <Link href="/recipes/new">
                  <Utensils className="mr-2 h-5 w-5" />
                  Share Your Recipe
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-6">
            <div className="bg-black/60 backdrop-blur-sm px-8 py-5 rounded-lg border border-orange-600/30">
              <p className="text-4xl font-bold text-orange-400">1000+</p>
              <p className="text-gray-300">Recipes</p>
            </div>
            <div className="bg-black/60 backdrop-blur-sm px-8 py-5 rounded-lg border border-orange-600/30">
              <p className="text-4xl font-bold text-orange-400">50+</p>
              <p className="text-gray-300">Categories</p>
            </div>
            <div className="bg-black/60 backdrop-blur-sm px-8 py-5 rounded-lg border border-orange-600/30">
              <p className="text-4xl font-bold text-orange-400">10k+</p>
              <p className="text-gray-300">Happy Cooks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Recipes Carousel */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-white">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900">Featured Recipes</h2>
              <p className="text-brown-600 mt-2">Handpicked recipes you'll love to try</p>
            </div>
            <Link
              href="/explore/featured"
              className="text-orange-600 hover:text-orange-700 flex items-center font-medium"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <FeaturedRecipeCarousel recipes={featuredRecipes} />
        </div>
      </section>

      {/* Cuisine Icons Grid */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900">Explore World Cuisines</h2>
            <p className="text-brown-600 mt-2 max-w-2xl mx-auto">
              Discover authentic recipes from around the globe and bring international flavors to your kitchen
            </p>
          </div>

          <CuisineIconGrid cuisines={cuisines} />
        </div>
      </section>

      {/* Categories with Images */}
      <section className="py-16 bg-amber-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900">Recipe Categories</h2>
            <p className="text-brown-600 mt-2">Find recipes by meal type</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link key={category.slug} href={`/categories/${category.slug}`} className="group">
                <div className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full">
                  <div className="relative h-36 w-full overflow-hidden">
                    <Image
                      src={category.imageUrl || "/placeholder.svg?height=200&width=300"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-4">
                      <h3 className="font-medium text-lg text-white group-hover:text-orange-200 transition-colors">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Recipes */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900 flex items-center">
                <Award className="mr-3 h-8 w-8 text-orange-500" />
                Popular Recipes
              </h2>
              <p className="text-brown-600 mt-2">Our most loved recipes by the community</p>
            </div>
            <Link
              href="/explore/popular"
              className="text-orange-600 hover:text-orange-700 flex items-center font-medium"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {popularRecipes.slice(0, 8).map((recipe) => (
              <RecipeCard key={recipe._id?.toString()} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Newly Added Recipes */}
      <section className="py-16 bg-amber-50">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900 flex items-center">
                <Clock className="mr-3 h-8 w-8 text-orange-500" />
                Newly Added
              </h2>
              <p className="text-brown-600 mt-2">Check out the latest culinary creations from our community</p>
            </div>
            <Link
              href="/explore/recent"
              className="text-orange-600 hover:text-orange-700 flex items-center font-medium"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newRecipes.slice(0, 8).map((recipe) => (
              <RecipeCard key={recipe._id?.toString()} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600 text-white">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Share Your Culinary Creations</h2>
              <p className="text-lg mb-8 text-white/90 max-w-lg">
                Join our community of food enthusiasts and share your favorite recipes with the world. Get feedback,
                save your favorites, and inspire others with your unique dishes.
              </p>
              <Button asChild size="lg" className="bg-white text-orange-700 hover:bg-orange-100 px-8 py-6 text-lg">
                <Link href="/recipes/new">
                  <Utensils className="mr-2 h-5 w-5" />
                  Add Your Recipe
                </Link>
              </Button>
            </div>
            <div className="md:w-1/2 relative h-[300px] md:h-[400px] w-full rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba?q=80&w=2068&auto=format&fit=crop"
                alt="Cooking"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900">What Our Users Say</h2>
            <p className="text-brown-600 mt-2 max-w-2xl mx-auto">
              Join thousands of happy cooks who have discovered new recipes and shared their own creations
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-amber-50 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{testimonial.name}</h3>
                    <p className="text-sm text-gray-600">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
                <div className="flex mt-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-amber-50">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900 mb-4">
              Get Weekly Recipe Inspiration
            </h2>
            <p className="text-lg text-brown-600 mb-8">
              Subscribe to our newsletter and receive the best recipes directly in your inbox every week
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3">
                Subscribe
              </Button>
            </form>
            <p className="text-sm text-gray-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

// Sample testimonials data
const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, USA",
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
    text: "RecipeHaven has transformed my cooking experience! I've discovered so many amazing recipes and even gained confidence to share my own creations.",
  },
  {
    name: "Michael Chen",
    location: "Toronto, Canada",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    text: "As a busy professional, I love how easy it is to find quick and delicious recipes here. The community is so supportive and inspiring!",
  },
  {
    name: "Priya Sharma",
    location: "London, UK",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    text: "I've been able to share my family's traditional recipes and learn new cooking techniques. This platform has become my go-to for meal planning.",
  },
]
