import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "RecipeHaven - Discover Your Next Favorite Recipe",
  description: "Explore our curated collection of delicious recipes from around the world",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
        <Script id="animation-script">
          {`
            function handleIntersection(entries, observer) {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  entry.target.classList.add('visible');
                  observer.unobserve(entry.target);
                }
              });
            }
            
            document.addEventListener('DOMContentLoaded', function() {
              const observer = new IntersectionObserver(handleIntersection, {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
              });
              
              document.querySelectorAll('section').forEach(section => {
                section.classList.add('animate-on-scroll');
                observer.observe(section);
              });
            });
          `}
        </Script>
      </body>
    </html>
  )
}
