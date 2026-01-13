"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound, Scale, X } from "lucide-react"
import FeaturedPropertiesCarousel from "@/components/featured-properties-carousel"
import FeatureCards from "@/components/feature-cards"
import FeatureShowcase from "@/components/feature-showcase"
import { HeroWithVoiceSearch } from "@/components/hero-with-voice-search"

export default function Page() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
  }

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
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section with Voice Search */}
      <HeroWithVoiceSearch />

      {/* Introduction Section */}
      <section className="bg-[#0A0A0A] px-6 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <Button className="bg-white text-black hover:bg-[#F8F2EB] px-8 py-6">BEGIN YOUR AI-POWERED SEARCH</Button>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl">
          <FeaturedPropertiesCarousel />

          <div className="px-6 mt-12">
            {" "}
            {/* Changed mb-12 to mt-12 for spacing after the carousel */}
            <h2 className="alias-section-title">FEATURED PROPERTIES</h2>
          </div>

          <div className="mt-8 px-6 flex justify-center">
            <Link href="/search">
              <Button variant="text" className="uppercase tracking-wider">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <FeatureCards />

      {/* Feature Showcase Section */}
      <FeatureShowcase />

      {/* Problem Statement Section */}
      <section className="bg-[#0A0A0A] px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="alias-section-title mx-auto">NAVIGATING THE OLD MARKET IS OVERWHELMING.</h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: <X className="h-6 w-6" />, text: "ENDLESS, IRRELEVANT LISTINGS." },
              { icon: <Scale className="h-6 w-6" />, text: "EXORBITANT, OPAQUE FEES." },
              { icon: <KeyRound className="h-6 w-6" />, text: "HIDDEN GEMS REMAIN UNSEEN." },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center space-y-4">
                <div className="bg-black/50 border border-white/5 p-4 text-white/50">{item.icon}</div>
                <p className="text-white/70 tracking-wider text-sm uppercase">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#0A0A0A] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="alias-section-title mx-auto text-center mb-16">HOW HAUS WORKS</h2>

          <div className="grid gap-12 md:gap-8 md:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 text-[#D4C1B3]">
                <span className="text-xl font-light">01</span>
              </div>
              <h4 className="mb-3 text-lg tracking-widest uppercase">DESCRIBE</h4>
              <p className="text-white/70">Tell us what you're looking for in plain English, not just tick boxes.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 text-[#D4C1B3]">
                <span className="text-xl font-light">02</span>
              </div>
              <h4 className="mb-3 text-lg tracking-widest uppercase">DISCOVER</h4>
              <p className="text-white/70">
                Explore AI-curated properties that match your stated and unstated preferences.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 text-[#D4C1B3]">
                <span className="text-xl font-light">03</span>
              </div>
              <h4 className="mb-3 text-lg tracking-widest uppercase">VISUALIZE</h4>
              <p className="text-white/70">
                Experience properties virtually through immersive 3D tours and simulations.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 text-[#D4C1B3]">
                <span className="text-xl font-light">04</span>
              </div>
              <h4 className="mb-3 text-lg tracking-widest uppercase">DECIDE</h4>
              <p className="text-white/70">
                Make confident decisions with AI-powered analytics and transparent information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0A0A0A] px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl uppercase mb-6 tracking-widest">EXPERIENCE THE FUTURE OF REAL ESTATE.</h2>

          <p className="mt-6 text-white/70 md:text-lg">
            Join the haus.com.ai waitlist for early access and be the first to redefine your property journey.
          </p>

          <div className="mt-10">
            {!isSubmitted ? (
              <form
                onSubmit={handleSubmit}
                className="mx-auto flex max-w-md flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
              >
                <div className="flex-grow">
                  <Input
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit">REQUEST EARLY ACCESS</Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/50 border border-white/10 p-4 text-[#D4C1B3] uppercase tracking-wider"
              >
                THANK YOU! WE'LL BE IN TOUCH.
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-white/30"></div>
              <span className="text-sm text-white/50 tracking-wider uppercase">HAUS.COM.AI</span>
            </div>

            <div className="flex space-x-6 text-xs text-white/40 uppercase tracking-wider">
              <Link href="#" className="hover:text-white/70 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white/70 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-white/70 transition-colors">
                Contact Us
              </Link>
            </div>

            <div className="text-xs text-white/40 uppercase tracking-wider">
              © {new Date().getFullYear()} HAUS.COM.AI. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
