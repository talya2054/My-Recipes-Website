"use client"

import { useState, useMemo } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { Categories } from "@/components/categories"
import { RecipeGrid } from "@/components/recipe-grid"
import { Recipe } from "@/components/recipe-card"

const sampleRecipes: Recipe[] = [
  {
    id: "1",
    title: "Strawberry Shortcake",
    description: "Light and fluffy sponge cake layered with fresh strawberries and whipped cream. A classic summer dessert.",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80",
    time: "45 min",
    servings: 8,
    rating: 4.9,
    category: "baking",
    difficulty: "Medium",
    isFavorite: true,
  },
  {
    id: "2",
    title: "Creamy Tomato Pasta",
    description: "Rich and velvety tomato cream sauce tossed with your favorite pasta. Comfort food at its finest.",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop&q=80",
    time: "30 min",
    servings: 4,
    rating: 4.7,
    category: "cooking",
    difficulty: "Easy",
    isFavorite: false,
  },
  {
    id: "3",
    title: "Vanilla Bean Cupcakes",
    description: "Moist vanilla cupcakes topped with silky buttercream frosting and rainbow sprinkles.",
    image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=800&auto=format&fit=crop&q=80",
    time: "50 min",
    servings: 12,
    rating: 4.8,
    category: "baking",
    difficulty: "Easy",
    isFavorite: false,
  },
  {
    id: "4",
    title: "Honey Glazed Salmon",
    description: "Perfectly seared salmon with a sweet honey glaze, served with roasted vegetables.",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    time: "25 min",
    servings: 2,
    rating: 4.9,
    category: "cooking",
    difficulty: "Medium",
    isFavorite: true,
  },
  {
    id: "5",
    title: "Chocolate Lava Cake",
    description: "Decadent chocolate cake with a molten center. A show-stopping dessert for special occasions.",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&auto=format&fit=crop&q=80",
    time: "35 min",
    servings: 4,
    rating: 4.9,
    category: "desserts",
    difficulty: "Hard",
    isFavorite: false,
  },
  {
    id: "6",
    title: "Fresh Garden Salad",
    description: "Crisp mixed greens with cherry tomatoes, cucumber, and a zesty lemon vinaigrette.",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    time: "15 min",
    servings: 2,
    rating: 4.5,
    category: "healthy",
    difficulty: "Easy",
    isFavorite: false,
  },
  {
    id: "7",
    title: "Homemade Cinnamon Rolls",
    description: "Soft, pillowy rolls swirled with cinnamon sugar and topped with cream cheese frosting.",
    image: "https://images.unsplash.com/photo-1609126979532-eb8b1b8c6cb6?w=800&auto=format&fit=crop&q=80",
    time: "2 hrs",
    servings: 12,
    rating: 4.8,
    category: "baking",
    difficulty: "Medium",
    isFavorite: true,
  },
  {
    id: "8",
    title: "Crispy Cheese Nachos",
    description: "Loaded tortilla chips with melted cheese, jalapeños, sour cream, and fresh guacamole.",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=800&auto=format&fit=crop&q=80",
    time: "20 min",
    servings: 6,
    rating: 4.6,
    category: "snacks",
    difficulty: "Easy",
    isFavorite: false,
  },
  {
    id: "9",
    title: "Berry Smoothie Bowl",
    description: "A refreshing blend of mixed berries topped with granola, coconut, and fresh fruit.",
    image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&auto=format&fit=crop&q=80",
    time: "10 min",
    servings: 1,
    rating: 4.7,
    category: "healthy",
    difficulty: "Easy",
    isFavorite: false,
  },
]

export default function RecipeDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [recipes, setRecipes] = useState<Recipe[]>(sampleRecipes)

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = activeCategory === "all" || recipe.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [recipes, searchQuery, activeCategory])

  const handleFavoriteToggle = (id: string) => {
    setRecipes((prev) =>
      prev.map((recipe) =>
        recipe.id === id ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe
      )
    )
  }

  return (
    <div className="min-h-screen">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-12">
        <HeroSection />
        <Categories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        
        <section className="py-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              {activeCategory === "all" ? "All Recipes" : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Recipes`}
            </h2>
            <span className="text-sm text-muted-foreground bg-cream px-3 py-1.5 rounded-full">
              {filteredRecipes.length} {filteredRecipes.length === 1 ? "recipe" : "recipes"}
            </span>
          </div>
          <RecipeGrid recipes={filteredRecipes} onFavoriteToggle={handleFavoriteToggle} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-cream/30 py-8 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-muted-foreground text-sm">
            Made with 🍓 and lots of love • My Sweet Recipes © 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
