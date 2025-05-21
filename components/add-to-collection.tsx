"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { FolderPlus, Plus, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/components/ui/use-toast"

import { getUserCollections } from "@/lib/collections"
import { addRecipeToCollection, removeRecipeFromCollection, createCollection } from "@/lib/collections"
import type { RecipeCollection } from "@/lib/types"

interface AddToCollectionProps {
  recipeId: string
  userId: string
}

export function AddToCollection({ recipeId, userId }: AddToCollectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [collections, setCollections] = useState<RecipeCollection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set())
  const [newCollectionName, setNewCollectionName] = useState("")
  const [isCreatingCollection, setIsCreatingCollection] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchCollections = async () => {
      if (isOpen) {
        setIsLoading(true)
        try {
          const userCollections = await getUserCollections(userId)
          setCollections(userCollections)

          // Set initially selected collections
          const initialSelected = new Set<string>()
          userCollections.forEach((collection) => {
            if (collection.recipeIds.includes(recipeId)) {
              initialSelected.add(collection._id?.toString() || "")
            }
          })
          setSelectedCollections(initialSelected)
        } catch (error) {
          console.error("Error fetching collections:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchCollections()
  }, [isOpen, recipeId, userId])

  const handleToggleCollection = async (collectionId: string) => {
    const isSelected = selectedCollections.has(collectionId)

    try {
      if (isSelected) {
        // Remove from collection
        await removeRecipeFromCollection(collectionId, recipeId)
        selectedCollections.delete(collectionId)
      } else {
        // Add to collection
        await addRecipeToCollection(collectionId, recipeId)
        selectedCollections.add(collectionId)
      }

      setSelectedCollections(new Set(selectedCollections))

      toast({
        title: isSelected ? "Removed from collection" : "Added to collection",
        description: isSelected
          ? "Recipe removed from collection successfully"
          : "Recipe added to collection successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update collection. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return

    setIsCreatingCollection(true)
    try {
      const newCollection = await createCollection({
        name: newCollectionName,
        isPublic: false,
        userId,
      })

      if (newCollection && newCollection._id) {
        // Add recipe to the new collection
        await addRecipeToCollection(newCollection._id.toString(), recipeId)

        // Update UI
        setCollections([...collections, newCollection])
        setSelectedCollections(new Set([...selectedCollections, newCollection._id.toString()]))
        setNewCollectionName("")

        toast({
          title: "Collection created",
          description: "Recipe added to your new collection",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingCollection(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <FolderPlus className="h-4 w-4" />
          Save
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save to Collection</DialogTitle>
          <DialogDescription>Add this recipe to your collections for easy access later</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <>
              {/* Create new collection */}
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="text"
                  placeholder="Create new collection..."
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Button
                  onClick={handleCreateCollection}
                  disabled={!newCollectionName.trim() || isCreatingCollection}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Collection list */}
              {collections.length === 0 ? (
                <p className="text-center py-4 text-gray-500">
                  You don't have any collections yet. Create one to get started.
                </p>
              ) : (
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {collections.map((collection) => (
                      <div
                        key={collection._id?.toString()}
                        className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${
                          selectedCollections.has(collection._id?.toString() || "")
                            ? "bg-orange-100 hover:bg-orange-200"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => handleToggleCollection(collection._id?.toString() || "")}
                      >
                        <div>
                          <p className="font-medium">{collection.name}</p>
                          <p className="text-sm text-gray-500">
                            {collection.recipeIds.length} {collection.recipeIds.length === 1 ? "recipe" : "recipes"}
                          </p>
                        </div>

                        {selectedCollections.has(collection._id?.toString() || "") ? (
                          <div className="h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center">
                            <Check className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
