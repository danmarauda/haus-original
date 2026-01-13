"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Sliders, ArrowLeft, ChevronDown, ChevronUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { PropertyCard } from "@/components/property-card"
import { AIProcessingVisual } from "@/components/ai-processing-visual"
import { mockProperties } from "@/lib/mock-data"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [properties, setProperties] = useState(mockProperties)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([500000, 2000000])
  const [bedrooms, setBedrooms] = useState(2)
  const [bathrooms, setBathrooms] = useState(2)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Example search queries for inspiration
  const exampleQueries = [
    "A modern three-bedroom house with a backyard, close to good schools in Melbourne",
    "Spacious apartment with city views, walking distance to cafes in Sydney CBD",
    "Quiet suburban home in Perth with a large kitchen and a pool",
    "Beachfront property in Queensland with at least 4 bedrooms",
    "Renovated terrace in Surry Hills with a courtyard",
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsProcessing(true)

    // Simulate AI processing time
    setTimeout(() => {
      setIsProcessing(false)
      setShowResults(true)
    }, 3000)
  }

  const resetSearch = () => {
    setSearchQuery("")
    setShowResults(false)
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const applyFilters = () => {
    // In a real app, this would filter the properties based on the selected criteria
    // For now, we'll just simulate it by shuffling the properties
    setProperties([...mockProperties].sort(() => Math.random() - 0.5))
    setFiltersOpen(false)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="px-4 pb-20 md:px-6">
        {/* Back button (only visible when showing results) */}
        {showResults && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6 pt-6">
            <Button variant="text" className="flex items-center space-x-2 text-white/60" onClick={resetSearch}>
              <ArrowLeft className="h-4 w-4" />
              <span>BACK TO SEARCH</span>
            </Button>
          </motion.div>
        )}

        {/* Search Section */}
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.section
              key="search-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="mx-auto max-w-4xl py-12 md:py-20"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-12 text-center"
              >
                <h1 className="text-3xl font-extralight md:text-5xl tracking-[0.3em]">DESCRIBE YOUR DREAM HOME</h1>
                <p className="mt-4 text-white/70 md:text-lg font-light">
                  Use natural language to tell us exactly what you're looking for
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleSearch}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative mx-auto max-w-2xl"
              >
                <div className="relative">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="e.g., A modern three-bedroom house with a garden, close to good schools..."
                    className="h-16 pl-12 pr-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50" />
                </div>
                <Button type="submit" className="mt-4 w-full py-6" disabled={!searchQuery.trim() || isProcessing}>
                  {isProcessing ? "PROCESSING..." : "SEARCH WITH AI"}
                </Button>
              </motion.form>

              {/* Example queries */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12"
              >
                <h3 className="mb-4 text-center text-sm font-light uppercase tracking-[0.2em] text-white/60">
                  TRY THESE EXAMPLES
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {exampleQueries.map((query, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="border border-white/10 bg-black/50 px-4 py-2 text-sm text-white/60 transition-colors hover:border-white/30 hover:text-white/80"
                      onClick={() => setSearchQuery(query)}
                    >
                      {query.length > 40 ? query.substring(0, 40) + "..." : query}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* AI Processing Visualization (only visible when processing) */}
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-16 flex flex-col items-center"
                >
                  <AIProcessingVisual />
                  <p className="mt-6 text-white/60 uppercase tracking-[0.2em] font-light">
                    OUR AI IS ANALYZING YOUR REQUIREMENTS...
                  </p>
                </motion.div>
              )}
            </motion.section>
          ) : (
            <motion.section
              key="results-section"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto max-w-7xl pt-6"
            >
              {/* Search summary and filters */}
              <div className="mb-8 flex flex-col justify-between border border-white/5 bg-black/50 p-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-light uppercase tracking-[0.1em]">SEARCH RESULTS</h2>
                  <p className="mt-1 text-sm text-white/60">Based on: "{searchQuery}"</p>
                </div>
                <div className="mt-4 flex items-center md:mt-0">
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 text-white/60 uppercase tracking-[0.1em]"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                  >
                    <Sliders className="h-4 w-4" />
                    <span>FILTERS</span>
                    {filtersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Filters panel */}
              <AnimatePresence>
                {filtersOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 overflow-hidden border border-white/5 bg-black/50 p-6"
                  >
                    <div className="grid gap-8 md:grid-cols-3">
                      <div>
                        <h3 className="mb-4 font-light uppercase tracking-[0.1em]">PRICE RANGE</h3>
                        <Slider
                          defaultValue={[priceRange[0], priceRange[1]]}
                          max={3000000}
                          step={25000}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          className="py-4"
                        />
                        <div className="flex justify-between text-sm text-white/60">
                          <span>${(priceRange[0] / 1000).toFixed(0)}k</span>
                          <span>${(priceRange[1] / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-4 font-light uppercase tracking-[0.1em]">BEDROOMS</h3>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <Button
                              key={num}
                              variant={bedrooms === num ? "default" : "outline"}
                              className={`flex-1 ${
                                bedrooms === num ? "bg-white text-black" : "border-white/30 text-white/60"
                              }`}
                              onClick={() => setBedrooms(num)}
                            >
                              {num}+
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-4 font-light uppercase tracking-[0.1em]">BATHROOMS</h3>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((num) => (
                            <Button
                              key={num}
                              variant={bathrooms === num ? "default" : "outline"}
                              className={`flex-1 ${
                                bathrooms === num ? "bg-white text-black" : "border-white/30 text-white/60"
                              }`}
                              onClick={() => setBathrooms(num)}
                            >
                              {num}+
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                      <Button
                        variant="outline"
                        className="uppercase tracking-[0.1em] text-white/60"
                        onClick={() => setFiltersOpen(false)}
                      >
                        CANCEL
                      </Button>
                      <Button className="uppercase tracking-[0.1em]" onClick={applyFilters}>
                        APPLY FILTERS
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* AI-enhanced matches section */}
              <div className="mb-12">
                <div className="mb-6 flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-[#D4C1B3]" />
                  <h2 className="text-xl font-light uppercase tracking-[0.1em]">AI-ENHANCED MATCHES</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {properties.slice(0, 3).map((property) => (
                    <PropertyCard key={property.id} property={property} enhanced={true} />
                  ))}
                </div>
              </div>

              {/* Additional matches */}
              <div>
                <h2 className="mb-6 text-xl font-light uppercase tracking-[0.1em]">ADDITIONAL PROPERTIES</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {properties.slice(3).map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
