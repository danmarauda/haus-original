import type React from "react"
import { UserButton, SignedIn } from "@clerk/clerk-react"

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-vercel-bg">
      <header className="py-4 px-6 border-b border-vercel-border sticky top-0 z-50 bg-vercel-bg">
        <div className="container mx-auto flex justify-between items-center max-w-screen-xl">
          <a href="/" className="flex items-center">
            <img
              src="https://app.picaos.com/solo-dark.svg"
              alt="Logo"
              className="h-8 w-auto" // Adjust height as needed
            />
          </a>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-6 max-w-screen-xl">{children}</main>
      <footer className="py-6 text-center border-t border-vercel-border">
        <p className="text-vercel-text-secondary text-sm">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </footer>
    </div>
  )
}

export default Layout
