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

  const difficultyColors = {
    Easy: "bg-emerald-100 text-emerald-700",
    Medium: "bg-amber-100 text-amber-700",
    Hard: "bg-rose-100 text-rose-700",
  }

  return (
    <article
      className="group relative bg-card rounded-3xl overflow-hidden shadow-soft transition-all duration-500 hover:shadow-marshmallow-hover hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        <img
          src={recipe.image}
          alt={recipe.title}
          className={`w-full h-full object-cover transition-all duration-700 ${
            isHovered ? "scale-110" : "scale-100"
          } ${imageLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Skeleton loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-cream to-cream-dark animate-pulse" />
        )}

        {/* Favorite Button */}
        <button
          onClick={() => onFavoriteToggle?.(recipe.id)}
          className={`absolute top-3 right-3 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 ${
            recipe.isFavorite
              ? "bg-primary text-primary-foreground scale-100"
              : "bg-white/80 backdrop-blur-sm text-muted-foreground hover:bg-white hover:text-primary"
          } ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 sm:opacity-100 sm:translate-y-0"}`}
        >
          <Heart className={`w-5 h-5 transition-transform duration-300 ${recipe.isFavorite ? "fill-current scale-110" : ""}`} />
        </button>

        {/* Difficulty Badge */}
        <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[recipe.difficulty]} transition-all duration-300 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 sm:opacity-100 sm:translate-y-0"}`}>
          {recipe.difficulty}
        </span>

        {/* Decorative strawberry dots */}
        <div className="absolute bottom-3 right-3 flex gap-1">
          <span className="w-2 h-2 rounded-full bg-primary/60" />
          <span className="w-2 h-2 rounded-full bg-primary/40" />
          <span className="w-2 h-2 rounded-full bg-primary/20" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="font-bold text-foreground text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {recipe.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
          {recipe.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium">{recipe.time}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">{recipe.servings}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-foreground">{recipe.rating}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
