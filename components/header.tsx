"use client"

import { useState } from "react"
import { Search, Menu, X, Heart, ChefHat } from "lucide-react"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-pink-400 flex items-center justify-center shadow-soft transition-transform duration-300 hover:scale-105">
              <ChefHat className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-foreground">
              My Sweet Recipes
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink active>Home</NavLink>
            <NavLink>Favorites</NavLink>
            <NavLink>Collections</NavLink>
            <NavLink>About</NavLink>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-64 h-10 pl-10 pr-4 rounded-2xl bg-cream border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300"
              />
            </div>
            <button className="w-10 h-10 rounded-2xl bg-strawberry-light flex items-center justify-center hover:bg-primary/20 transition-all duration-300 hover:scale-105">
              <Heart className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-2xl bg-cream flex items-center justify-center transition-all duration-300"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Search */}
        <div className="sm:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-2xl bg-cream border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-300"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            <MobileNavLink active>Home</MobileNavLink>
            <MobileNavLink>Favorites</MobileNavLink>
            <MobileNavLink>Collections</MobileNavLink>
            <MobileNavLink>About</MobileNavLink>
          </nav>
        )}
      </div>
    </header>
  )
}

function NavLink({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <a
      href="#"
      className={`px-4 py-2 rounded-2xl font-medium text-sm transition-all duration-300 ${
        active
          ? "bg-primary text-primary-foreground shadow-soft"
          : "text-muted-foreground hover:text-foreground hover:bg-cream"
      }`}
    >
      {children}
    </a>
  )
}

function MobileNavLink({ children, active }: { children: React.ReactNode; active?: boolean }) {
  return (
    <a
      href="#"
      className={`px-4 py-3 rounded-2xl font-medium transition-all duration-300 ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-cream"
      }`}
    >
      {children}
    </a>
  )
}
