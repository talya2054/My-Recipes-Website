"use client"

import { useState } from "react"
import { Heart, Clock, Users, Star } from "lucide-react"

export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  time: string
  servings: number
  rating: number
  category: string
  difficulty: "Easy" | "Medium" | "Hard"
  isFavorite?: boolean
}

interface RecipeCardProps {
  recipe: Recipe
  onFavoriteToggle?: (id: string) => void
}

export function RecipeCard({ recipe, onFavoriteToggle }: RecipeCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const difficultyConfig = {
    Easy: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
    Medium: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" },
    Hard: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-100" },
  }

  const difficulty = difficultyConfig[recipe.difficulty]

  return (
    <article
      className="group relative bg-card rounded-3xl overflow-hidden shadow-soft transition-all duration-700 ease-marshmallow hover:shadow-marshmallow-hover hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <img
          src={recipe.image}
          alt={recipe.title}
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
            isHovered ? "scale-110" : "scale-100"
          } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-cream to-cream-dark animate-pulse" />
        )}

        {/* Soft overlay on hover */}
        <div className={`absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            onFavoriteToggle?.(recipe.id)
          }}
          className={`absolute top-4 right-4 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-500 ease-marshmallow ${
            recipe.isFavorite
              ? "bg-primary text-primary-foreground shadow-marshmallow scale-100"
              : "bg-card/90 backdrop-blur-sm text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:scale-110"
          } ${isHovered || recipe.isFavorite ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 sm:opacity-100 sm:translate-y-0"}`}
        >
          <Heart className={`w-5 h-5 transition-all duration-500 ${recipe.isFavorite ? "fill-current scale-110" : ""}`} />
        </button>

        {/* Difficulty Badge */}
        <span className={`absolute top-4 left-4 px-3.5 py-1.5 rounded-xl text-xs font-bold ${difficulty.bg} ${difficulty.text} border ${difficulty.border} shadow-soft transition-all duration-500 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 sm:opacity-100 sm:translate-y-0"}`}>
          {recipe.difficulty}
        </span>

        {/* Decorative corner elements */}
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary/70 shadow-sm animate-pulse-soft" />
          <span className="w-2.5 h-2.5 rounded-full bg-primary/50 shadow-sm animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
          <span className="w-2.5 h-2.5 rounded-full bg-primary/30 shadow-sm animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6">
        <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-500">
          {recipe.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-5 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        {/* Meta Info - Marshmallow style chips */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cream rounded-xl">
              <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">{recipe.time}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-cream rounded-xl">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-foreground">{recipe.servings}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-strawberry-light rounded-xl">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-foreground">{recipe.rating}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
