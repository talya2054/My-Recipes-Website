"use client"

import { Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-8 sm:py-12 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-200/30 to-transparent rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-strawberry-light text-primary text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Welcome to your cozy kitchen</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4">
          Discover <span className="text-primary">Delicious</span> Recipes
          <br className="hidden sm:block" />
          <span className="text-muted-foreground"> for Every Occasion</span>
        </h1>
        
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          From sweet treats to savory delights, find your next favorite dish in our 
          carefully curated collection of homemade recipes.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-6 sm:gap-10 mt-8">
          <StatItem value="150+" label="Recipes" />
          <StatItem value="50+" label="Baking Ideas" />
          <StatItem value="4.9" label="Avg Rating" />
        </div>
      </div>
    </section>
  )
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-2xl sm:text-3xl font-bold text-foreground">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}
