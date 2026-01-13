"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!agreeTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy")
      return
    }

    setIsLoading(true)

    try {
      await register(name, email, password)
      router.push("/dashboard")
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">CREATE ACCOUNT</h1>
          <p className="mt-2 text-minimal-text-secondary">Join OpenHaus.ai to discover your perfect property.</p>
        </div>

        <div className="rounded-none border border-minimal-border bg-minimal-card p-8">
          {error && (
            <div className="mb-6 rounded-none border border-red-500 bg-red-500/10 p-4 text-red-500">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-minimal-text-secondary" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="rounded-none bg-minimal-surface border-minimal-border pl-10 focus:border-minimal-accent"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-minimal-text-secondary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="rounded-none bg-minimal-surface border-minimal-border pl-10 focus:border-minimal-accent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-minimal-text-secondary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="rounded-none bg-minimal-surface border-minimal-border pl-10 pr-10 focus:border-minimal-accent"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-minimal-text-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-minimal-text-secondary" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="rounded-none bg-minimal-surface border-minimal-border pl-10 focus:border-minimal-accent"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                className="rounded-none border-minimal-border data-[state=checked]:bg-minimal-accent data-[state=checked]:border-minimal-accent"
              />
              <label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link href="/terms" className="text-minimal-accent hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-minimal-accent hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 uppercase tracking-wider"
              disabled={isLoading}
            >
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-minimal-text-secondary">
              Already have an account?{" "}
              <Link href="/login" className="text-minimal-accent hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
