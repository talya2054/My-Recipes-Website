"use client"

import { CakeSlice, Flame, Soup, Cookie, IceCream, Salad } from "lucide-react"

const categories = [
  { id: "all", name: "All Recipes", icon: Flame, color: "from-primary to-pink-400" },
  { id: "baking", name: "Baking", icon: CakeSlice, color: "from-amber-400 to-orange-400" },
  { id: "cooking", name: "Cooking", icon: Soup, color: "from-emerald-400 to-teal-400" },
  { id: "desserts", name: "Desserts", icon: IceCream, color: "from-violet-400 to-purple-400" },
  { id: "snacks", name: "Snacks", icon: Cookie, color: "from-rose-400 to-pink-400" },
  { id: "healthy", name: "Healthy", icon: Salad, color: "from-lime-400 to-green-400" },
]

interface CategoriesProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function Categories({ activeCategory, onCategoryChange }: CategoriesProps) {
  return (
    <section className="py-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Categories</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = activeCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl font-medium text-sm transition-all duration-300 ${
                isActive
                  ? "bg-card text-foreground shadow-marshmallow scale-105"
                  : "bg-cream/50 text-muted-foreground hover:bg-card hover:shadow-soft hover:scale-102"
              }`}
            >
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center transition-transform duration-300 ${isActive ? "scale-110" : ""}`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              <span className="whitespace-nowrap">{category.name}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
