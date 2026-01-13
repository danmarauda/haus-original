"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await login(email, password)
      router.push("/dashboard")
    } catch (err) {
      setError("Invalid email or password. Please try again.")
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
          <h1 className="text-3xl font-bold">LOG IN</h1>
          <p className="mt-2 text-minimal-text-secondary">
            Welcome back. Enter your credentials to access your account.
          </p>
        </div>

        <div className="rounded-none border border-minimal-border bg-minimal-card p-8">
          {error && (
            <div className="mb-6 rounded-none border border-red-500 bg-red-500/10 p-4 text-red-500">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="rounded-none border-minimal-border data-[state=checked]:bg-minimal-accent data-[state=checked]:border-minimal-accent"
                />
                <label htmlFor="remember" className="text-sm">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" className="text-sm text-minimal-accent hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full rounded-none bg-minimal-accent text-minimal-background hover:bg-minimal-accent/90 uppercase tracking-wider"
              disabled={isLoading}
            >
              {isLoading ? "LOGGING IN..." : "LOG IN"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-minimal-text-secondary">
              Don't have an account?{" "}
              <Link href="/register" className="text-minimal-accent hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
