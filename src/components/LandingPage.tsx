import type React from "react"
import { SignInButton, SignUpButton } from "@clerk/clerk-react"

const LandingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12">
      <h1 className="text-4xl font-bold mb-6 text-vercel-text-primary">Welcome to Our Platform</h1>
      <p className="text-lg mb-8 text-vercel-text-secondary max-w-xl">
        Sign in or create an account to access your personalized dashboard and explore all the features we offer.
      </p>
      <div className="space-x-4">
        <SignInButton mode="modal">
          <button className="px-6 py-3 bg-vercel-accent text-black font-semibold hover:bg-vercel-accent-hover transition duration-150 ease-in-out rounded-md">
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button className="px-6 py-3 bg-gray-700 text-vercel-text-primary font-semibold hover:bg-gray-600 transition duration-150 ease-in-out rounded-md">
            Sign Up
          </button>
        </SignUpButton>
      </div>
    </div>
  )
}

export default LandingPage
