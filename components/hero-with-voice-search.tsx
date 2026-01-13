"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { VoiceSearch } from "@/components/voice-search/VoiceSearch"
import { PropertyCard } from "@/components/voice-search/PropertyCard"
import { type Property, type SearchParams } from "@/lib/types"
import { X, ChevronRight } from "lucide-react"

export function HeroWithVoiceSearch() {
  const [showVoiceSearch, setShowVoiceSearch] = useState(false)
  const [searchResults, setSearchResults] = useState<Property[]>([])
  const [searchParams, setSearchParams] = useState<SearchParams>({})

  const handleStartSearch = () => {
    setShowVoiceSearch(true)
  }

  const handleCloseSearch = () => {
    setShowVoiceSearch(false)
    setSearchResults([])
    setSearchParams({})
  }

  const handleResults = (results: Property[], params: SearchParams) => {
    setSearchResults(results)
    setShowVoiceSearch(false)
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
    <div className="relative min-h-screen bg-black">
      {/* Background animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="h-full w-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
          {[...Array(20)].map((_, i) => (
            <motion.circle
              key={i}
              cx={Math.random() * 100}
              cy={Math.random() * 100}
              r={Math.random() * 0.5 + 0.2}
              fill={i % 3 === 0 ? "#D4C1B3" : "#4A5568"}
              initial={{ opacity: 0.3 }}
              animate={{
                cx: [Math.random() * 100, Math.random() * 100],
                cy: [Math.random() * 100, Math.random() * 100],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
          {[...Array(15)].map((_, i) => (
            <motion.line
              key={`line-${i}`}
              x1={Math.random() * 100}
              y1={Math.random() * 100}
              x2={Math.random() * 100}
              y2={Math.random() * 100}
              stroke={i % 4 === 0 ? "#D4C1B3" : "#2A2A2A"}
              strokeWidth="0.1"
              initial={{ opacity: 0.1 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: Math.random() * 15 + 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          ))}
        </svg>
      </div>

      {/* Decorative lines */}
      <div className="alias-decorative-line h-[400px] left-[100px] top-[280px]"></div>
      <div className="alias-decorative-line h-[300px] right-[180px] top-[380px]"></div>
      <div className="alias-decorative-line h-[250px] left-[500px] top-[180px]"></div>

      {/* Main Content */}
      <div className="relative px-6 py-20 md:py-32">
        <div className="relative mx-auto max-w-5xl text-center">
          <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
            <motion.h1
              variants={item}
              className="text-4xl font-extralight leading-tight md:text-6xl lg:text-7xl tracking-[0.3em]"
            >
              A REVOLUTION
              <br />
              IN REAL ESTATE.
            </motion.h1>

            <motion.p variants={item} className="text-white/60 max-w-2xl mx-auto">
              Discover your perfect property with AI-powered voice search. Simply speak naturally and let our advanced AI find properties that match your exact requirements.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleStartSearch}
                className="inline-flex items-center justify-center gap-3 rounded-full bg-[#D4C1B3] px-8 py-4 text-lg font-medium text-black transition-all hover:bg-[#D4C1B3]/90 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" opacity="0" />
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
                Start Voice Search
              </button>

              <button className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 px-8 py-4 text-lg font-medium text-white transition-all hover:bg-white/5">
                Learn More
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#0A0A0A] px-6 py-16"
          >
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="alias-section-title">Search Results</h2>
                <button
                  onClick={handleCloseSearch}
                  className="text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Search Modal */}
      <AnimatePresence>
        {showVoiceSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={handleCloseSearch}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-8 z-50 bg-black rounded-2xl overflow-hidden"
            >
              <button
                onClick={handleCloseSearch}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <VoiceSearch
                onResults={handleResults}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
