import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Clock, Utensils, TrendingUp, Award, Star, Users, ChefHat, Heart } from "lucide-react"
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
      {/* Hero Section with Background Video */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=2070&auto=format&fit=crop"
            className="object-cover w-full h-full brightness-[0.3]"
          >
            <source src="/videos/cooking-background.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-5">
          <div className="absolute top-20 left-10 w-20 h-20 bg-orange-400/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-amber-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-orange-300/20 rounded-full blur-xl animate-pulse delay-2000"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 px-4 py-32 text-center">
          <div className="animate-fade-in-up">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-orange-600/90 text-white rounded-full text-sm font-medium mb-4">
                🍳 Welcome to RecipeHaven
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-white leading-tight">
              Discover{" "}
              <span className="text-orange-400 relative">
                Delicious
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full"></div>
              </span>{" "}
              Recipes
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
              Find and share the best recipes from around the world. Join our community of passionate food lovers and
              culinary enthusiasts!
            </p>

            <div className="max-w-2xl mx-auto mb-12">
              <SearchBar className="shadow-2xl border-2 border-orange-400/50" />
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-8 py-6 text-lg shadow-xl"
              >
                <Link href="/explore/popular">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Popular Recipes
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-orange-400 text-orange-400 hover:bg-orange-900/20 px-8 py-6 text-lg backdrop-blur-sm bg-white/10"
              >
                <Link href="/recipes/new">
                  <Utensils className="mr-2 h-5 w-5" />
                  Share Your Recipe
                </Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 flex flex-wrap justify-center gap-8">
            <div className="bg-black/60 backdrop-blur-sm px-8 py-6 rounded-xl border border-orange-600/30 shadow-xl">
              <p className="text-4xl font-bold text-orange-400 mb-1">1000+</p>
              <p className="text-gray-300 text-sm">Recipes</p>
            </div>
            <div className="bg-black/60 backdrop-blur-sm px-8 py-6 rounded-xl border border-orange-600/30 shadow-xl">
              <p className="text-4xl font-bold text-orange-400 mb-1">50+</p>
              <p className="text-gray-300 text-sm">Categories</p>
            </div>
            <div className="bg-black/60 backdrop-blur-sm px-8 py-6 rounded-xl border border-orange-600/30 shadow-xl">
              <p className="text-4xl font-bold text-orange-400 mb-1">10k+</p>
              <p className="text-gray-300 text-sm">Happy Cooks</p>
            </div>
            <div className="bg-black/60 backdrop-blur-sm px-8 py-6 rounded-xl border border-orange-600/30 shadow-xl">
              <p className="text-4xl font-bold text-orange-400 mb-1">4.9★</p>
              <p className="text-gray-300 text-sm">Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-amber-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900 mb-4">Why Choose RecipeHaven?</h2>
            <p className="text-brown-600 max-w-2xl mx-auto">
              Discover what makes our platform the perfect place for food enthusiasts
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <ChefHat className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Recipes</h3>
              <p className="text-gray-600">Curated by professional chefs and home cooking experts</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community Driven</h3>
              <p className="text-gray-600">Join thousands of passionate cooks sharing their favorites</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Rated & Reviewed</h3>
              <p className="text-gray-600">Every recipe is tested and rated by our community</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Save Favorites</h3>
              <p className="text-gray-600">Create collections and save your favorite recipes</p>
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
              className="text-orange-600 hover:text-orange-700 flex items-center font-medium group"
            >
              View All <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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

      {/* Recipe of the Day */}
      <section className="py-16 bg-gradient-to-r from-orange-50 to-amber-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900">Recipe of the Day</h2>
            <p className="text-brown-600 mt-2">Today's special pick from our chef's collection</p>
          </div>

          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <Image
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&auto=format&fit=crop"
                  alt="Recipe of the Day"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Chef's Choice
                  </span>
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <h3 className="text-2xl font-bold mb-4">Mediterranean Quinoa Bowl</h3>
                <p className="text-gray-600 mb-6">
                  A healthy and delicious quinoa bowl packed with fresh vegetables, feta cheese, and a tangy lemon
                  dressing. Perfect for a nutritious lunch or dinner.
                </p>
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-orange-500 mr-1" />
                    <span className="text-sm">25 mins</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm">4.8 (124 reviews)</span>
                  </div>
                </div>
                <Button asChild className="bg-orange-600 hover:bg-orange-700">
                  <Link href="/recipes/mediterranean-quinoa-bowl">
                    View Recipe <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Categories with Images */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900">Featured Categories</h2>
            <p className="text-brown-600 mt-2">Explore our most popular recipe categories</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="group relative h-80 overflow-hidden rounded-xl shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1533089860892-a9b9ac6cd6a4?w=800&auto=format&fit=crop"
                alt="Breakfast"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Breakfast</h3>
                <p className="text-white/80 mb-4">Start your day with these delicious breakfast recipes</p>
                <Link
                  href="/categories/breakfast"
                  className="inline-flex items-center text-orange-300 hover:text-orange-100 group"
                >
                  View Recipes <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="group relative h-80 overflow-hidden rounded-xl shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=800&auto=format&fit=crop"
                alt="Dinner"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Dinner</h3>
                <p className="text-white/80 mb-4">Hearty and satisfying dinner recipes for the whole family</p>
                <Link
                  href="/categories/dinner"
                  className="inline-flex items-center text-orange-300 hover:text-orange-100 group"
                >
                  View Recipes <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="group relative h-80 overflow-hidden rounded-xl shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop"
                alt="Desserts"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-serif font-bold text-white mb-2">Desserts</h3>
                <p className="text-white/80 mb-4">Sweet treats to satisfy your cravings</p>
                <Link
                  href="/categories/desserts"
                  className="inline-flex items-center text-orange-300 hover:text-orange-100 group"
                >
                  View Recipes <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Recipes */}
      <section className="py-16 bg-amber-50">
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
              className="text-orange-600 hover:text-orange-700 flex items-center font-medium group"
            >
              View All <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
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
      <section className="py-16 bg-white">
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
              className="text-orange-600 hover:text-orange-700 flex items-center font-medium group"
            >
              View All <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newRecipes.slice(0, 8).map((recipe) => (
              <RecipeCard key={recipe._id?.toString()} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* Cooking Tips Section */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-orange-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brown-900">Cooking Tips & Tricks</h2>
            <p className="text-brown-600 mt-2 max-w-2xl mx-auto">
              Enhance your culinary skills with these professional cooking tips
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1556911073-38141963c9e0?w=800&auto=format&fit=crop"
                  alt="Knife Skills"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Master Knife Skills</h3>
                <p className="text-gray-700 mb-4">
                  Learn proper knife techniques to improve your efficiency and safety in the kitchen.
                </p>
                <Link
                  href="/tips/knife-skills"
                  className="text-orange-600 hover:text-orange-700 flex items-center font-medium group"
                >
                  Learn More <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&auto=format&fit=crop"
                  alt="Flavor Pairing"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Flavor Pairing Secrets</h3>
                <p className="text-gray-700 mb-4">
                  Discover how to combine ingredients to create perfectly balanced and delicious dishes.
                </p>
                <Link
                  href="/tips/flavor-pairing"
                  className="text-orange-600 hover:text-orange-700 flex items-center font-medium group"
                >
                  Learn More <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48">
                <Image
                  src="https://images.unsplash.com/photo-1607877742574-a7253426f5af?w=800&auto=format&fit=crop"
                  alt="Food Presentation"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Food Presentation</h3>
                <p className="text-gray-700 mb-4">
                  Learn how to plate your dishes like a professional chef and impress your guests.
                </p>
                <Link
                  href="/tips/food-presentation"
                  className="text-orange-600 hover:text-orange-700 flex items-center font-medium group"
                >
                  Learn More <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">Share Your Culinary Creations</h2>
              <p className="text-lg mb-8 text-white/90 max-w-lg">
                Join our community of food enthusiasts and share your favorite recipes with the world. Get feedback,
                save your favorites, and inspire others with your unique dishes.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-orange-700 hover:bg-orange-100 px-8 py-6 text-lg shadow-xl"
              >
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
              <div
                key={index}
                className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
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
                <p className="text-gray-700 italic mb-3">"{testimonial.text}"</p>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-b from-amber-50 to-orange-100">
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
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                required
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-3"
              >
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
