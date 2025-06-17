import { ShoppingList } from "@/components/shopping-list"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function ShoppingListPage() {
  const user = await getCurrentUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-serif font-bold text-brown-900 mb-6">Shopping List</h1>
      <p className="text-brown-600 mb-8 max-w-3xl">
        Keep track of ingredients you need to buy for your recipes. Add items manually or generate a list from your meal
        plan.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <ShoppingList />
        </div>

        <div>
          <div className="bg-amber-50 p-6 rounded-lg">
            <h2 className="text-xl font-serif font-bold text-brown-900 mb-4">Shopping Tips</h2>
            <ul className="space-y-3 list-disc pl-5">
              <li>Shop with a list to avoid impulse purchases</li>
              <li>Check your pantry before shopping to avoid buying duplicates</li>
              <li>Buy seasonal produce for better flavor and value</li>
              <li>Compare unit prices to get the best deals</li>
              <li>Shop the perimeter of the store first for fresh foods</li>
              <li>Consider buying in bulk for non-perishable items</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
