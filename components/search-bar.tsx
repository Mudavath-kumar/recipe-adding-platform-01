"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  className?: string
}

export function SearchBar({ className = "" }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Input
        type="search"
        placeholder="Search for recipes, ingredients, cuisines..."
        className="pl-4 pr-12 py-6 rounded-full text-lg border-2 focus-visible:ring-orange-500"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button
        type="submit"
        className="absolute right-1 top-1 h-10 w-10 rounded-full bg-orange-500 hover:bg-orange-600"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </Button>
    </form>
  )
}
