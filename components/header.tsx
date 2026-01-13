"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  return (
    <header className="alias-nav-container">
      <div className="alias-nav-logo">HAUS</div>
      <nav className="hidden md:flex items-center space-x-8">
        <Link href="/" className={`alias-nav-link ${pathname === "/" ? "active" : ""}`}>
          Home
        </Link>
        <Link href="/search" className={`alias-nav-link ${pathname === "/search" ? "active" : ""}`}>
          Search
        </Link>
        <Link href="/compare" className={`alias-nav-link ${pathname === "/compare" ? "active" : ""}`}>
          Compare
        </Link>
        <Link href="/contact" className={`alias-nav-link ${pathname === "/contact" ? "active" : ""}`}>
          Contact
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <Link href="/login" className="alias-btn-text">
          Login
        </Link>
        <Link href="/register" className="alias-btn alias-btn-primary">
          Register
        </Link>
      </div>
    </header>
  )
}
