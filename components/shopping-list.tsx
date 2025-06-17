"use client"

import { useState, useEffect } from "react"
import { Check, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

type ShoppingItem = {
  id: string
  name: string
  completed: boolean
  category: string
}

export function ShoppingList() {
  const { toast } = useToast()
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const savedItems = localStorage.getItem("shoppingList")
      return savedItems ? JSON.parse(savedItems) : []
    }
    return []
  })

  const [newItemName, setNewItemName] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("produce")
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem("shoppingList", JSON.stringify(items))
  }, [items])

  const addItem = () => {
    if (!newItemName.trim()) return

    const newItem: ShoppingItem = {
      id: Math.random().toString(36).substring(2, 9),
      name: newItemName.trim(),
      completed: false,
      category: newItemCategory,
    }

    setItems((prev) => [...prev, newItem])
    setNewItemName("")

    toast({
      title: "Item added",
      description: `${newItemName} added to your shopping list`,
    })
  }

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))

    toast({
      title: "Item removed",
      description: "Item removed from your shopping list",
    })
  }

  const clearCompleted = () => {
    setItems((prev) => prev.filter((item) => !item.completed))

    toast({
      title: "Completed items cleared",
      description: "All completed items have been removed",
    })
  }

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true
    if (filter === "active") return !item.completed
    if (filter === "completed") return item.completed
    return true
  })

  // Group items by category
  const groupedItems: Record<string, ShoppingItem[]> = {}
  filteredItems.forEach((item) => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = []
    }
    groupedItems[item.category].push(item)
  })

  const categories = [
    { value: "produce", label: "Fruits & Vegetables" },
    { value: "dairy", label: "Dairy & Eggs" },
    { value: "meat", label: "Meat & Seafood" },
    { value: "bakery", label: "Bakery" },
    { value: "pantry", label: "Pantry" },
    { value: "frozen", label: "Frozen Foods" },
    { value: "beverages", label: "Beverages" },
    { value: "other", label: "Other" },
  ]

  const getCategoryLabel = (value: string): string => {
    return categories.find((cat) => cat.value === value)?.label || "Other"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-serif flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-orange-500" />
            Shopping List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Add an item..."
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItem()}
              />
            </div>
            <select
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            <Button onClick={addItem} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add</span>
            </Button>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              All
            </Button>
            <Button
              variant={filter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("active")}
              className={filter === "active" ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              Active
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
              className={filter === "completed" ? "bg-orange-500 hover:bg-orange-600" : ""}
            >
              Completed
            </Button>

            <div className="flex-1 text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCompleted}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={!items.some((item) => item.completed)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Completed
              </Button>
            </div>
          </div>

          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Your shopping list is empty</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([category, categoryItems]) => (
                <div key={category}>
                  <h3 className="font-medium text-gray-700 mb-2">{getCategoryLabel(category)}</h3>
                  <div className="space-y-2">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-md border border-gray-200 hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleItem(item.id)}
                            className={`h-5 w-5 rounded-full flex items-center justify-center ${
                              item.completed
                                ? "bg-green-500 text-white"
                                : "border border-gray-300 hover:border-orange-500"
                            }`}
                          >
                            {item.completed && <Check className="h-3 w-3" />}
                          </button>
                          <span className={item.completed ? "line-through text-gray-400" : ""}>{item.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
