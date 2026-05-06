"use client"

import { useState } from "react"
import { Search, Menu, X, Heart, Cherry } from "lucide-react"

interface HeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function Header({ searchQuery, onSearchChange }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-strawberry-light/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-strawberry-dark flex items-center justify-center shadow-marshmallow transition-all duration-500 group-hover:scale-110 group-hover:shadow-marshmallow-hover group-hover:rotate-6">
              <Cherry className="w-5 h-5 text-primary-foreground" />
              {/* Decorative dots */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cream rounded-full border-2 border-primary" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg sm:text-xl text-foreground leading-tight">
                Strawberry Kitchen
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Cozy recipes for happy hearts
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink active>Home</NavLink>
            <NavLink>Favorites</NavLink>
            <NavLink>Collections</NavLink>
            <NavLink>About</NavLink>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden sm:flex items-center gap-3">
            <div className={`relative transition-all duration-500 ease-marshmallow ${searchFocused ? 'scale-105' : ''}`}>
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${searchFocused ? 'text-primary' : 'text-muted-foreground'}`} />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-56 lg:w-64 h-11 pl-11 pr-4 rounded-2xl bg-cream border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 focus:bg-card focus:shadow-soft transition-all duration-500"
              />
            </div>
            <button className="relative w-11 h-11 rounded-2xl bg-strawberry-light flex items-center justify-center hover:bg-primary hover:shadow-marshmallow transition-all duration-500 ease-marshmallow hover:scale-110 group">
              <Heart className="w-5 h-5 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center shadow-soft">
                3
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-11 h-11 rounded-2xl bg-cream flex items-center justify-center transition-all duration-500 hover:bg-strawberry-light hover:scale-105 active:scale-95"
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-cream border-2 border-transparent text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/30 focus:bg-card focus:shadow-soft transition-all duration-500"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
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
      className={`px-4 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-500 ease-marshmallow ${
        active
          ? "bg-primary text-primary-foreground shadow-marshmallow scale-105"
          : "text-muted-foreground hover:text-foreground hover:bg-strawberry-light hover:scale-105"
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
      className={`px-5 py-3.5 rounded-2xl font-semibold transition-all duration-500 ${
        active
          ? "bg-primary text-primary-foreground shadow-marshmallow"
          : "text-muted-foreground hover:text-foreground hover:bg-strawberry-light"
      }`}
    >
      {children}
    </a>
  )
}
