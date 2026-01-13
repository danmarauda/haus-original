"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PropertyGalleryProps {
  images: string[]
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  return (
    <div className="relative">
      {/* Main Gallery */}
      <div className="relative h-[300px] w-full overflow-hidden md:h-[500px]">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative h-full w-full"
          >
            <Image
              src={
                images[currentIndex] || "/placeholder.svg?height=500&width=700&query=australian+property+interior+view"
              }
              alt={`Property image ${currentIndex + 1}`}
              fill
              className="object-cover"
              priority={currentIndex === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-[#121315]/70 text-white backdrop-blur-sm hover:bg-[#121315]"
          onClick={prevImage}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-[#121315]/70 text-white backdrop-blur-sm hover:bg-[#121315]"
          onClick={nextImage}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        {/* Fullscreen Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 h-10 w-10 rounded-full bg-[#121315]/70 text-white backdrop-blur-sm hover:bg-[#121315]"
          onClick={toggleFullscreen}
        >
          <Maximize2 className="h-5 w-5" />
        </Button>

        {/* Image Counter */}
        <div className="absolute bottom-4 right-4 rounded-full bg-[#121315]/70 px-3 py-1 text-sm text-white backdrop-blur-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="mx-auto -mt-12 max-w-7xl px-6">
        <div className="relative z-10 flex space-x-2 overflow-x-auto pb-4">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                index === currentIndex ? "border-[#FFD166]" : "border-transparent"
              }`}
            >
              <Image
                src={image || "/placeholder.svg?height=80&width=128&query=australian+property+thumbnail"}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            onClick={toggleFullscreen}
          >
            <div className="relative h-[90vh] w-[90vw]">
              <Image
                src={
                  images[currentIndex] ||
                  "/placeholder.svg?height=1080&width=1920&query=fullscreen+australian+property+view"
                }
                alt={`Property image ${currentIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 h-10 w-10 rounded-full bg-[#121315]/70 text-white backdrop-blur-sm hover:bg-[#121315]"
              onClick={toggleFullscreen}
            >
              <Maximize2 className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-[#121315]/70 text-white backdrop-blur-sm hover:bg-[#121315]"
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full bg-[#121315]/70 text-white backdrop-blur-sm hover:bg-[#121315]"
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
