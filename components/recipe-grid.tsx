"use client"

import { RecipeCard, Recipe } from "./recipe-card"

interface RecipeGridProps {
  recipes: Recipe[]
  onFavoriteToggle: (id: string) => void
}

export function RecipeGrid({ recipes, onFavoriteToggle }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 rounded-3xl bg-strawberry-light flex items-center justify-center mb-5 shadow-soft animate-float">
          <span className="text-5xl">🍓</span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">No recipes found</h3>
        <p className="text-muted-foreground text-center max-w-sm leading-relaxed">
          Try adjusting your search or category to discover more delicious recipes!
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
      {recipes.map((recipe, index) => (
        <div
          key={recipe.id}
          className="animate-in fade-in slide-in-from-bottom-4"
          style={{ animationDelay: `${index * 75}ms`, animationFillMode: "both", animationDuration: "600ms" }}
        >
          <RecipeCard recipe={recipe} onFavoriteToggle={onFavoriteToggle} />
        </div>
      ))}
    </div>
  )
}
