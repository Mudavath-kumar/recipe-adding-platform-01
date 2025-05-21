"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FolderOpen, Plus, Edit, Trash2, Lock, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"

import { createCollection, updateCollection, deleteCollection } from "@/lib/collections"
import type { RecipeCollection } from "@/lib/types"

interface RecipeCollectionsProps {
  collections: RecipeCollection[]
  userId: string
}

export function RecipeCollections({ collections, userId }: RecipeCollectionsProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState<RecipeCollection | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isPublic: false,
  })
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleCreateOpen = () => {
    setFormData({
      name: "",
      description: "",
      isPublic: false,
    })
    setIsCreateOpen(true)
  }

  const handleEditOpen = (collection: RecipeCollection) => {
    setSelectedCollection(collection)
    setFormData({
      name: collection.name,
      description: collection.description || "",
      isPublic: collection.isPublic,
    })
    setIsEditOpen(true)
  }

  const handleDeleteOpen = (collection: RecipeCollection) => {
    setSelectedCollection(collection)
    setIsDeleteOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPublic: checked }))
  }

  const handleCreateCollection = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your collection",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await createCollection({
        name: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
        userId,
      })

      toast({
        title: "Collection created",
        description: "Your collection has been created successfully",
      })

      setIsCreateOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateCollection = async () => {
    if (!selectedCollection || !formData.name.trim()) return

    setIsLoading(true)
    try {
      await updateCollection(selectedCollection._id?.toString() || "", {
        name: formData.name,
        description: formData.description,
        isPublic: formData.isPublic,
      })

      toast({
        title: "Collection updated",
        description: "Your collection has been updated successfully",
      })

      setIsEditOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCollection = async () => {
    if (!selectedCollection) return

    setIsLoading(true)
    try {
      await deleteCollection(selectedCollection._id?.toString() || "")

      toast({
        title: "Collection deleted",
        description: "Your collection has been deleted successfully",
      })

      setIsDeleteOpen(false)
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold text-brown-900">My Recipe Collections</h2>
        <Button onClick={handleCreateOpen} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="h-4 w-4 mr-2" />
          New Collection
        </Button>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12 bg-amber-50 rounded-lg">
          <FolderOpen className="h-16 w-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Collections Yet</h3>
          <p className="text-gray-600 mb-6">Create collections to organize your favorite recipes</p>
          <Button onClick={handleCreateOpen} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Collection
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <Card
              key={collection._id?.toString()}
              className="overflow-hidden hover:shadow-md transition-all duration-300"
            >
              <Link href={`/collections/${collection._id}`}>
                <div className="relative h-40 w-full bg-gradient-to-r from-amber-100 to-orange-100 flex items-center justify-center">
                  {collection.recipeIds.length > 0 ? (
                    <div className="grid grid-cols-2 gap-1 w-full h-full">
                      {[...Array(Math.min(4, collection.recipeIds.length))].map((_, index) => (
                        <div key={index} className="relative w-full h-full">
                          <Image
                            src={`/placeholder.svg?height=150&width=150&text=Recipe+${index + 1}`}
                            alt="Recipe thumbnail"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <FolderOpen className="h-16 w-16 text-orange-300" />
                  )}

                  <div className="absolute top-2 right-2">
                    {collection.isPublic ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Public
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Private
                      </Badge>
                    )}
                  </div>
                </div>
              </Link>

              <CardContent className="p-4">
                <Link href={`/collections/${collection._id}`}>
                  <h3 className="font-medium text-lg mb-1 hover:text-orange-600 transition-colors">
                    {collection.name}
                  </h3>
                </Link>
                {collection.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{collection.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  {collection.recipeIds.length} {collection.recipeIds.length === 1 ? "recipe" : "recipes"}
                </p>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditOpen(collection)}>
                  <Edit className="h-4 w-4 text-gray-500" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteOpen(collection)}>
                  <Trash2 className="h-4 w-4 text-gray-500" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create Collection Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
            <DialogDescription>Create a collection to organize your favorite recipes</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Collection Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Weeknight Dinners"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your collection..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public">Make Public</Label>
                <p className="text-sm text-gray-500">Public collections can be viewed by anyone</p>
              </div>
              <Switch id="public" checked={formData.isPublic} onCheckedChange={handleSwitchChange} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCollection} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
              {isLoading ? "Creating..." : "Create Collection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>Update your collection details</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Collection Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="edit-public">Make Public</Label>
                <p className="text-sm text-gray-500">Public collections can be viewed by anyone</p>
              </div>
              <Switch id="edit-public" checked={formData.isPublic} onCheckedChange={handleSwitchChange} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateCollection} disabled={isLoading} className="bg-orange-500 hover:bg-orange-600">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Collection Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Collection</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this collection? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCollection} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete Collection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
