import Link from "next/link"
import Image from "next/image"
import {
  Clock,
  Utensils,
  TrendingUp,
  Star,
  Users,
  ChefHat,
  Heart,
  Globe,
  BookOpen,
  FlameIcon as Fire,
  Zap,
} from "lucide-react"
import { initializeSampleRecipes } from "@/lib/recipes"

import { Button } from "@/components/ui/button"
import { getNewlyAddedRecipes, getPopularRecipes, getFeaturedRecipes } from "@/lib/recipes"
import { getAllCategories } from "@/lib/categories"
import { getAllCuisines } from "@/lib/cuisines"
import { initializeCategories, updateCategoryImages } from "@/lib/categories"
import { initializeCuisines, updateCuisineImages } from "@/lib/cuisines"

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
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* DRAMATIC HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543353071-10c8ba85a904?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-red-500/30 to-pink-500/30 animate-pulse"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full animate-bounce opacity-70"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Main Content */}
        <div className="container relative z-10 text-center px-4">
          {/* Glowing Badge */}
          <div className="mb-8">
            <span className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full text-lg font-bold shadow-2xl animate-pulse border-4 border-white/20">
              <Fire className="w-6 h-6 mr-3 animate-bounce" />🔥 WELCOME TO RECIPEHAVEN - THE ULTIMATE FOOD DESTINATION
              🔥
            </span>
          </div>

          {/* MASSIVE TITLE */}
          <h1 className="text-8xl md:text-9xl lg:text-[12rem] font-black mb-8 leading-none">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 animate-pulse drop-shadow-2xl">
              COOK
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse drop-shadow-2xl">
              AMAZING
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-500 animate-pulse drop-shadow-2xl">
              RECIPES
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-4xl text-white mb-12 max-w-4xl mx-auto font-bold drop-shadow-lg">
            🌟 DISCOVER • CREATE • SHARE • INSPIRE 🌟
            <br />
            <span className="text-orange-400">Join 100K+ Food Lovers Worldwide!</span>
          </p>

          {/* HUGE BUTTONS */}
          <div className="flex flex-wrap justify-center gap-8 mb-16">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white px-12 py-8 text-2xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/30 rounded-2xl"
            >
              <Link href="/explore/popular">
                <TrendingUp className="mr-4 h-8 w-8" />🔥 EXPLORE HOT RECIPES
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 hover:from-purple-600 hover:via-blue-600 hover:to-indigo-600 text-white px-12 py-8 text-2xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/30 rounded-2xl"
            >
              <Link href="/recipes/new">
                <Utensils className="mr-4 h-8 w-8" />⭐ SHARE YOUR RECIPE
              </Link>
            </Button>
          </div>

          {/* GLOWING STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { number: "100K+", label: "RECIPES", icon: BookOpen, color: "from-orange-400 to-red-500" },
              { number: "200+", label: "COUNTRIES", icon: Globe, color: "from-blue-400 to-purple-500" },
              { number: "1M+", label: "USERS", icon: Users, color: "from-green-400 to-blue-500" },
              { number: "5.0★", label: "RATING", icon: Star, color: "from-yellow-400 to-orange-500" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.color} p-8 rounded-3xl shadow-2xl transform hover:scale-110 transition-all duration-300 border-4 border-white/20`}
              >
                <stat.icon className="h-12 w-12 text-white mx-auto mb-4 animate-bounce" />
                <p className="text-4xl font-black text-white mb-2">{stat.number}</p>
                <p className="text-white font-bold text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEON FEATURES SECTION */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-8">
              🚀 AMAZING FEATURES
            </h2>
            <p className="text-2xl text-white font-bold">Why RecipeHaven is THE BEST cooking platform!</p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ChefHat,
                title: "EXPERT RECIPES",
                description: "Professional chef-approved recipes that guarantee success!",
                color: "from-orange-400 to-red-500",
                bgColor: "from-orange-900/50 to-red-900/50",
              },
              {
                icon: Users,
                title: "GLOBAL COMMUNITY",
                description: "Connect with millions of passionate food lovers worldwide!",
                color: "from-blue-400 to-purple-500",
                bgColor: "from-blue-900/50 to-purple-900/50",
              },
              {
                icon: Star,
                title: "5-STAR RATED",
                description: "Every recipe is tested and rated by our amazing community!",
                color: "from-yellow-400 to-orange-500",
                bgColor: "from-yellow-900/50 to-orange-900/50",
              },
              {
                icon: Heart,
                title: "SAVE FAVORITES",
                description: "Create collections and never lose your favorite recipes!",
                color: "from-pink-400 to-red-500",
                bgColor: "from-pink-900/50 to-red-900/50",
              },
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div
                  className={`relative bg-gradient-to-br ${feature.bgColor} backdrop-blur-sm rounded-3xl p-8 shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transition-all duration-500 transform hover:-translate-y-8 hover:scale-105 border-2 border-white/20`}
                >
                  {/* Glowing Icon */}
                  <div
                    className={`w-24 h-24 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:animate-bounce`}
                  >
                    <feature.icon className="h-12 w-12 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-black mb-4 text-white text-center">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed text-center font-medium">{feature.description}</p>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORLD CUISINES - COMPLETELY REDESIGNED */}
      <section className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-500/30 to-red-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="container relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 mb-8">
              🌍 WORLD CUISINES
            </h2>
            <p className="text-2xl text-white font-bold max-w-4xl mx-auto">
              Explore authentic flavors from every corner of the planet!
            </p>
          </div>

          {/* Enhanced Cuisine Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {cuisines.slice(0, 12).map((cuisine, index) => (
              <Link
                key={cuisine.slug}
                href={`/cuisines/${cuisine.slug}`}
                className="group relative transform hover:scale-110 transition-all duration-300"
              >
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] border-2 border-white/20">
                  {/* Cuisine Image */}
                  <div className="relative h-24 w-24 mx-auto mb-4 rounded-2xl overflow-hidden">
                    <Image
                      src={
                        cuisine.imageUrl ||
                        "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&auto=format&fit=crop" ||
                        "/placeholder.svg"
                      }
                      alt={cuisine.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>

                  {/* Country Name */}
                  <h3 className="text-white font-bold text-center text-lg group-hover:text-orange-400 transition-colors duration-300">
                    {cuisine.name}
                  </h3>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 via-red-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-12 py-6 text-xl font-bold shadow-2xl transform hover:scale-110 transition-all duration-300 rounded-2xl"
            >
              <Link href="/cuisines">
                <Globe className="mr-4 h-6 w-6" />🌟 EXPLORE ALL CUISINES
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* POPULAR RECIPES - NEON STYLE */}
      <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-8">
              🔥 HOT RECIPES
            </h2>
            <p className="text-2xl text-white font-bold">The most popular recipes loved by our community!</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {popularRecipes.slice(0, 8).map((recipe, index) => (
              <div
                key={recipe._id?.toString()}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] transform hover:scale-105 transition-all duration-300 border-2 border-white/20"
              >
                {/* Recipe Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={
                      recipe.imageUrl ||
                      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&auto=format&fit=crop" ||
                      "/placeholder.svg"
                    }
                    alt={recipe.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      🔥 HOT
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors duration-300">
                    {recipe.title}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-300 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span className="text-sm">{recipe.prepTime || "30"} mins</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400" />
                      <span className="text-sm">{recipe.rating || "4.8"}</span>
                    </div>
                  </div>
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold"
                  >
                    <Link href={`/recipes/${recipe._id}`}>
                      <Zap className="mr-2 h-4 w-4" />
                      VIEW RECIPE
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION - EXPLOSIVE DESIGN */}
      <section className="py-24 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 bg-white/20 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            ></div>
          ))}
        </div>

        <div className="container relative z-10 text-center">
          <h2 className="text-6xl md:text-8xl font-black text-white mb-8 drop-shadow-2xl">🚀 JOIN THE REVOLUTION!</h2>
          <p className="text-2xl text-white mb-12 font-bold max-w-4xl mx-auto">
            Share your amazing recipes with the world and become a culinary superstar!
          </p>

          <div className="flex flex-wrap justify-center gap-8">
            <Button
              asChild
              size="lg"
              className="bg-white text-orange-600 hover:bg-gray-100 px-12 py-8 text-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 rounded-2xl"
            >
              <Link href="/recipes/new">
                <Utensils className="mr-4 h-8 w-8" />🌟 SHARE YOUR RECIPE NOW!
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-4 border-white text-white hover:bg-white hover:text-orange-600 px-12 py-8 text-2xl font-black shadow-2xl transform hover:scale-110 transition-all duration-300 rounded-2xl"
            >
              <Link href="/signup">
                <Users className="mr-4 h-8 w-8" />🔥 JOIN COMMUNITY
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
