"use client"

import { RecipeCard, Recipe } from "./recipe-card"

interface RecipeGridProps {
  recipes: Recipe[]
  onFavoriteToggle: (id: string) => void
}

export function RecipeGrid({ recipes, onFavoriteToggle }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 rounded-3xl bg-cream flex items-center justify-center mb-4">
          <span className="text-4xl">🍓</span>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">No recipes found</h3>
        <p className="text-muted-foreground text-center max-w-sm">
          Try adjusting your search or category to find delicious recipes!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {recipes.map((recipe, index) => (
        <div
          key={recipe.id}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: "both" }}
        >
          <RecipeCard recipe={recipe} onFavoriteToggle={onFavoriteToggle} />
        </div>
      ))}
    </div>
  )
}
