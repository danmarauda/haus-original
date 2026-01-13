"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, Sun, Moon, User, Bell } from 'lucide-react'
import { useAuth } from "@/hooks/use-auth"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user, isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()

  // Track scroll position to add subtle effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { href: "/", label: "HOME" },
    { href: "/search", label: "SEARCH" },
    { href: "/contact", label: "CONTACT" },
    { href: "/features", label: "FEATURES" },
  ]

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false
    return pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-black p-6"
        >
          <div className="flex justify-end">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-white opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col items-center justify-center space-y-8 pt-20">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`alias-nav-link ${isActive(item.href) ? "active" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <Link href="/early-access" className="alias-nav-link" onClick={() => setIsMenuOpen(false)}>
              EARLY ACCESS
            </Link>

            {!isAuthenticated && (
              <div className="flex flex-col items-center space-y-4 mt-8">
                <Link href="/login">
                  <Button variant="outline">LOG IN</Button>
                </Link>
                <Link href="/register">
                  <Button>REGISTER</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Unified Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled ? "bg-black/95 backdrop-blur-sm" : "bg-black"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="alias-nav-container border-0">
            {/* Logo */}
            <Link href="/" className="alias-nav-logo">
              HAUS
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`alias-nav-link ${isActive(item.href) ? "active" : ""}`}
                >
                  {item.label}
                </Link>
              ))}

              <Link href="/early-access" className={`alias-nav-link ${isActive("/early-access") ? "active" : ""}`}>
                EARLY ACCESS
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {" "}
              {/* Adjusted spacing */}
              {/* Notification Icon (Desktop) */}
              <button
                className="hidden md:flex text-white/70 hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
                aria-label="Notifications"
                // onClick={() => { /* Handle notification click */ }}
              >
                <Bell className="h-5 w-5" />
              </button>
              {/* Account Icon (Desktop, conditional on auth) */}
              {isAuthenticated && (
                <Link
                  href="/profile"
                  className="hidden md:flex text-white/70 hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
                  aria-label="Account"
                >
                  <User className="h-5 w-5" />
                </Link>
              )}
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:flex text-white/70 hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-white/10"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              {/* Auth Buttons / Profile Link (Original Profile button is kept if desired) */}
              {!isAuthenticated ? (
                <div className="hidden md:flex items-center space-x-2">
                  <Link href="/login">
                    <Button variant="outline" size="sm">
                      LOG IN
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm">REGISTER</Button>
                  </Link>
                </div>
              ) : (
                // If authenticated, the User icon above links to /profile.
                // You might want to remove this explicit "PROFILE" button if the icon is sufficient.
                // For now, it's kept and will appear alongside the User icon.
                <Link href="/profile" className="hidden md:flex">
                  <Button variant="outline" size="sm">
                    PROFILE
                  </Button>
                </Link>
              )}
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white/70 hover:text-white transition-opacity"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
