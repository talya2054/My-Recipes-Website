"use client"

import { CakeSlice, Flame, Utensils, IceCream, Cookie, Salad } from "lucide-react"

const categories = [
  { id: "all", name: "All Recipes", icon: Flame, emoji: "✨" },
  { id: "baking", name: "Baking", icon: CakeSlice, emoji: "🥐" },
  { id: "cooking", name: "Cooking", icon: Utensils, emoji: "🍳" },
  { id: "desserts", name: "Desserts", icon: IceCream, emoji: "🍰" },
  { id: "snacks", name: "Snacks", icon: Cookie, emoji: "🍪" },
  { id: "healthy", name: "Healthy", icon: Salad, emoji: "🥗" },
]

interface CategoriesProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function Categories({ activeCategory, onCategoryChange }: CategoriesProps) {
  return (
    <section className="py-6">
      <div className="flex items-center gap-2 mb-5">
        <h2 className="text-lg font-bold text-foreground">Browse Categories</h2>
        <span className="text-lg">🍓</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {categories.map((category, index) => {
          const isActive = activeCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold text-sm transition-all duration-500 ease-marshmallow animate-in fade-in slide-in-from-bottom-2 ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-marshmallow scale-105"
                  : "bg-card text-foreground shadow-soft hover:shadow-marshmallow hover:scale-105 hover:-translate-y-0.5"
              }`}
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all duration-500 ${
                isActive 
                  ? "bg-primary-foreground/20 scale-110" 
                  : "bg-strawberry-light"
              }`}>
                {category.emoji}
              </div>
              <span className="whitespace-nowrap">{category.name}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
