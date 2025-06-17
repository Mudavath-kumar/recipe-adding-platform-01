"use client"

import { useState } from "react"
import { Share2, Copy, Facebook, Twitter, PhoneIcon as WhatsApp, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface ShareRecipeProps {
  recipeId: string
  recipeTitle: string
}

export function ShareRecipe({ recipeId, recipeTitle }: ShareRecipeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const recipeUrl =
    typeof window !== "undefined" ? `${window.location.origin}/recipes/${recipeId}` : `/recipes/${recipeId}`

  const shareText = `Check out this recipe for ${recipeTitle} on RecipeHaven!`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(recipeUrl)
    toast({
      title: "Link copied",
      description: "Recipe link copied to clipboard",
    })
  }

  const shareLinks = [
    {
      name: "Facebook",
      icon: <Facebook className="h-5 w-5" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(recipeUrl)}`,
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(recipeUrl)}`,
      color: "bg-sky-500 hover:bg-sky-600",
    },
    {
      name: "WhatsApp",
      icon: <WhatsApp className="h-5 w-5" />,
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${recipeUrl}`)}`,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Email",
      icon: <Mail className="h-5 w-5" />,
      url: `mailto:?subject=${encodeURIComponent(`Recipe: ${recipeTitle}`)}&body=${encodeURIComponent(`${shareText}\n\n${recipeUrl}`)}`,
      color: "bg-gray-600 hover:bg-gray-700",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-white/90 rounded-full hover:bg-white">
          <Share2 className="h-5 w-5 text-orange-600" />
          <span className="sr-only">Share recipe</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Recipe</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-center space-x-2 mb-4">
            <div className="border rounded-md flex-1 p-2 text-sm bg-gray-50 truncate">{recipeUrl}</div>
            <Button variant="outline" size="icon" onClick={handleCopyLink}>
              <Copy className="h-4 w-4" />
              <span className="sr-only">Copy link</span>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center p-3 rounded-md text-white ${link.color}`}
              >
                {link.icon}
                <span className="mt-1 text-sm">{link.name}</span>
              </a>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
