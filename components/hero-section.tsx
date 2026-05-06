"use client"

import { Sparkles, Heart } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative py-10 sm:py-14 overflow-hidden">
      {/* Background decorations - soft pastel blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-strawberry-light/60 to-transparent rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-cream-dark/60 to-transparent rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-2xl animate-float" />
      
      {/* Floating strawberry decoration */}
      <div className="absolute top-8 right-8 sm:right-16 lg:right-24 hidden sm:block">
        <div className="relative animate-float">
          <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl bg-gradient-to-br from-primary to-strawberry-dark shadow-marshmallow flex items-center justify-center">
            <span className="text-2xl lg:text-3xl">🍓</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-cream rounded-xl shadow-soft flex items-center justify-center">
            <Heart className="w-3 h-3 text-primary fill-primary" />
          </div>
        </div>
      </div>
      
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-strawberry-light text-primary text-sm font-bold mb-5 shadow-soft animate-scale-in">
          <Sparkles className="w-4 h-4 animate-pulse-soft" />
          <span>Welcome to your cozy kitchen</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-5">
          <span className="text-balance">Discover</span>{" "}
          <span className="relative inline-block">
            <span className="text-primary">Delicious</span>
            <svg className="absolute -bottom-1 left-0 w-full h-2 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0 8 Q 25 2, 50 8 T 100 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
          <br className="hidden sm:block" />
          <span className="text-muted-foreground">Recipes</span>
        </h1>
        
        <p className="text-muted-foreground text-base sm:text-lg max-w-xl leading-relaxed mb-8">
          From sweet strawberry treats to savory comfort dishes, find your next 
          favorite recipe in our lovingly curated collection.
        </p>

        {/* Stats cards - marshmallow style */}
        <div className="flex flex-wrap gap-4 sm:gap-5">
          <StatCard value="150+" label="Recipes" icon="📖" delay={0} />
          <StatCard value="50+" label="Baking" icon="🧁" delay={100} />
          <StatCard value="4.9" label="Rating" icon="⭐" delay={200} />
        </div>
      </div>
    </section>
  )
}

function StatCard({ value, label, icon, delay }: { value: string; label: string; icon: string; delay: number }) {
  return (
    <div 
      className="flex items-center gap-3 px-5 py-4 bg-card rounded-2xl shadow-soft hover:shadow-marshmallow hover:-translate-y-1 hover:scale-105 transition-all duration-500 ease-marshmallow animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="w-11 h-11 rounded-xl bg-strawberry-light flex items-center justify-center text-lg">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-xl sm:text-2xl font-bold text-foreground leading-none">{value}</span>
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
      </div>
    </div>
  )
}
