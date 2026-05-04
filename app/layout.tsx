import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "My Sweet Recipes",
  description: "A cozy recipe collection for your kitchen adventures",
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
