import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Strawberry Kitchen | Cozy Recipe Collection",
  description: "A cozy, strawberry-themed recipe collection for your kitchen adventures. Discover delicious baking and cooking recipes.",
}

export const viewport: Viewport = {
  themeColor: "#e7869a",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-background">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
