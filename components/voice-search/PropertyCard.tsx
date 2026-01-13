"use client"

import { useState } from "react"
import Image from "next/image"
import { Property } from "@/lib/types"
import { Eye, Route, Heart } from "lucide-react"

interface PropertyCardProps {
  property: Property
  onSave?: (property: Property) => void
  isSaved?: boolean
}

export function PropertyCard({ property, onSave, isSaved = false }: PropertyCardProps) {
  const [saved, setSaved] = useState(isSaved)

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSaved(!saved)
    if (onSave) onSave(property)
  }

  return (
    <div className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-[#D4C1B3]/50 hover:shadow-lg hover:shadow-[#D4C1B3]/10">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.imageUrl}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {property.tag && (
          <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {property.tag.text}
          </div>
        )}
        <button
          onClick={handleSave}
          className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">{property.title}</h3>
            <p className="text-sm text-white/60">{property.location}</p>
          </div>
          <p className="text-xl font-bold text-[#D4C1B3]">
            {typeof property.price === 'number'
              ? (property.price >= 1000000
                  ? `$${(property.price / 1000000).toFixed(2)}M`
                  : `$${(property.price / 1000).toFixed(0)}K`)
              : property.price}
          </p>
        </div>

        <p className="mb-3 text-sm text-white/70">{property.details}</p>

        <div className="flex items-center gap-2">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10">
            {property.button.icon === 'eye' ? <Eye className="h-4 w-4" /> : <Route className="h-4 w-4" />}
            {property.button.text}
          </button>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
    </div>
  )
}
