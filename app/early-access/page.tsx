"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Footer } from "@/components/footer"

export default function EarlyAccessPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const benefits = [
    "Exclusive first access to new properties",
    "Priority virtual tours and viewings",
    "Personalized AI property recommendations",
    "Reduced fees for early adopters",
    "Direct access to our concierge team",
  ]

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      return "Email is required"
    }
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsValidating(true)

    const validationError = validateEmail(email)
    if (validationError) {
      setError(validationError)
      setIsValidating(false)
      return
    }

    // In a real app, you would send this to your API
    console.log("Submitted email:", email)
    setError("")
    setSubmitted(true)
    setIsValidating(false)
  }

  const handleEmailBlur = () => {
    if (isValidating) {
      setError(validateEmail(email))
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (isValidating) {
      setError(validateEmail(e.target.value))
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden bg-black py-24 md:py-32">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/80 to-black"></div>
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: "url('/placeholder.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(8px)",
          }}
        ></div>

        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center text-center"
          >
            <motion.h1 variants={item} className="text-4xl font-bold tracking-tight text-white md:text-6xl">
              Be Among The First
            </motion.h1>

            <motion.p variants={item} className="mt-6 max-w-2xl text-lg text-white/70">
              Join our exclusive early access program and experience the future of real estate discovery before anyone
              else.
            </motion.p>

            {!submitted ? (
              <motion.form
                variants={item}
                className="mt-10 flex w-full max-w-md flex-col gap-4 sm:flex-row"
                onSubmit={handleSubmit}
              >
                <div className="flex-grow">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className={`h-12 flex-grow bg-white/10 text-white placeholder:text-white/50 ${
                      error ? "border-red-500 focus:border-red-500" : ""
                    }`}
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    aria-invalid={!!error}
                    aria-describedby={error ? "email-error" : undefined}
                    required
                  />
                  {error && (
                    <p id="email-error" className="mt-1 text-sm text-red-500">
                      {error}
                    </p>
                  )}
                </div>
                <Button type="submit" className="h-12 px-8" disabled={!!error && isValidating}>
                  Join Waitlist <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-10 rounded-lg bg-emerald-500/20 p-4 text-emerald-300"
              >
                <Check className="mb-2 h-6 w-6" />
                <p>Thank you! You're on the list. We'll be in touch soon.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-neutral-950 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">Early Access Benefits</h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-neutral-900 border-neutral-800">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="rounded-full bg-emerald-500/20 p-2 text-emerald-400">
                    <Check className="h-5 w-5" />
                  </div>
                  <p className="text-lg text-white">{benefit}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">Launch Timeline</h2>

          <div className="mx-auto max-w-3xl">
            <div className="relative border-l border-neutral-800 pl-8">
              <div className="mb-12 relative">
                <div className="absolute -left-10 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-3 w-3" />
                </div>
                <h3 className="text-xl font-bold text-white">Phase 1: Private Alpha</h3>
                <p className="mt-2 text-neutral-400">Currently active - Limited testing with select partners</p>
              </div>

              <div className="mb-12 relative">
                <div className="absolute -left-10 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-white">
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                </div>
                <h3 className="text-xl font-bold text-white">Phase 2: Early Access</h3>
                <p className="mt-2 text-neutral-400">Q2 2023 - First access for waitlist members</p>
              </div>

              <div className="mb-12 relative">
                <div className="absolute -left-10 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-white">
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                </div>
                <h3 className="text-xl font-bold text-white">Phase 3: Public Beta</h3>
                <p className="mt-2 text-neutral-400">Q3 2023 - Open to all users with beta features</p>
              </div>

              <div className="relative">
                <div className="absolute -left-10 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-700 text-white">
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                </div>
                <h3 className="text-xl font-bold text-white">Phase 4: Full Launch</h3>
                <p className="mt-2 text-neutral-400">Q4 2023 - Complete platform with all features</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-neutral-950 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">Frequently Asked Questions</h2>

          <div className="mx-auto max-w-3xl space-y-6">
            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white">What is early access?</h3>
                <p className="mt-2 text-neutral-400">
                  Early access gives you priority use of the HAUS platform before it's available to the general public,
                  including exclusive features and personalized support.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white">Is there a cost to join?</h3>
                <p className="mt-2 text-neutral-400">
                  Early access is completely free. In fact, early adopters will receive special pricing when we launch
                  our premium features.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white">How will I be notified?</h3>
                <p className="mt-2 text-neutral-400">
                  We'll send you an email with your exclusive access link as soon as your spot in the early access
                  program is ready.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-neutral-900 border-neutral-800">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white">What regions are supported?</h3>
                <p className="mt-2 text-neutral-400">
                  We're initially launching in major metropolitan areas in the US, with plans to expand to additional
                  regions shortly after.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
