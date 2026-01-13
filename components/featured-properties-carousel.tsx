"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, MapPin, Bed, Bath, Square, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { mockProperties } from "@/lib/mock-data"
import { PropertyDetailModal } from "@/components/property-detail-modal"

export default function FeaturedPropertiesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<(typeof mockProperties)[0] | null>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  const featuredProperties = mockProperties.slice(0, 5)

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProperties.length)
    resetAutoPlay()
  }

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredProperties.length) % featuredProperties.length)
    resetAutoPlay()
  }

  const handleDotClick = (index: number) => {
    setDirection(index > currentIndex ? 1 : -1)
    setCurrentIndex(index)
    resetAutoPlay()
  }

  const resetAutoPlay = () => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }

    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setDirection(1)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProperties.length)
      }, 5000)
    }
  }

  const handleQuickView = () => {
    setSelectedProperty(featuredProperties[currentIndex])
    // Pause autoplay when modal is open
    setIsAutoPlaying(false)
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }
  }

  const handleCloseModal = () => {
    setSelectedProperty(null)
    // Resume autoplay when modal is closed
    setIsAutoPlaying(true)
  }

  useEffect(() => {
    resetAutoPlay()

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [isAutoPlaying])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <>
      <div className="relative w-full overflow-hidden">
        <div className="relative h-[500px] md:h-[600px] w-full">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              <div className="grid h-full grid-cols-1 md:grid-cols-2 gap-0">
                {/* Image */}
                <div className="relative h-[300px] md:h-full">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <img
                    src={
                      featuredProperties[currentIndex].images[0] ||
                      "/placeholder.svg?height=600&width=800&query=australian+luxury+property+exterior" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt={featuredProperties[currentIndex].title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 z-20 bg-black/50 backdrop-blur-sm px-4 py-2">
                    <p className="text-white font-light tracking-wider">
                      {formatPrice(featuredProperties[currentIndex].price)}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="bg-[#0A0A0A] p-8 md:p-12 flex flex-col justify-center">
                  <h3 className="text-2xl md:text-3xl uppercase tracking-widest mb-4">
                    {featuredProperties[currentIndex].title}
                  </h3>

                  <div className="flex items-center text-white/70 mb-6">
                    <MapPin className="h-4 w-4 mr-2" />
                    <p className="text-sm">{featuredProperties[currentIndex].address}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="flex flex-col items-center border border-white/10 p-3">
                      <Bed className="h-5 w-5 mb-2 text-[#D4C1B3]" />
                      <p className="text-sm text-white/70">{featuredProperties[currentIndex].bedrooms} Beds</p>
                    </div>
                    <div className="flex flex-col items-center border border-white/10 p-3">
                      <Bath className="h-5 w-5 mb-2 text-[#D4C1B3]" />
                      <p className="text-sm text-white/70">{featuredProperties[currentIndex].bathrooms} Baths</p>
                    </div>
                    <div className="flex flex-col items-center border border-white/10 p-3">
                      <Square className="h-5 w-5 mb-2 text-[#D4C1B3]" />
                      <p className="text-sm text-white/70">{featuredProperties[currentIndex].squareFeet} Sq Ft</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-white/70">
                      {featuredProperties[currentIndex].tags?.join(" • ") || "Luxury • Modern • Smart Home"}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-col sm:flex-row gap-4">
                    <Link href={`/property/${featuredProperties[currentIndex].id}`}>
                      <Button variant="outline" className="border-white/20 hover:border-white/60 w-full sm:w-auto">
                        VIEW PROPERTY
                      </Button>
                    </Link>
                    <Button
                      variant="text"
                      className="flex items-center gap-2 w-full sm:w-auto justify-center"
                      onClick={handleQuickView}
                    >
                      <Eye className="h-4 w-4" />
                      QUICK VIEW
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2 z-30">
          {featuredProperties.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white scale-125" : "bg-white/30"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-all"
          aria-label="Previous property"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-all"
          aria-label="Next property"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-sm px-3 py-1 text-xs uppercase tracking-wider hover:bg-black/70 transition-all"
          aria-label={isAutoPlaying ? "Pause slideshow" : "Play slideshow"}
        >
          {isAutoPlaying ? "Pause" : "Play"}
        </button>
      </div>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal property={selectedProperty} isOpen={!!selectedProperty} onClose={handleCloseModal} />
      )}
    </>
  )
}
