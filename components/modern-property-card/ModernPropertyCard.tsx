"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { type Property } from '@/lib/types'
import { BedIcon, BathIcon, CarIcon, RulerIcon, HeartIcon, MapPinIcon, CalendarIcon, BuildingIcon } from '@/components/voice-search/IconComponents'

interface ModernPropertyCardProps {
  property: Property
  onSave?: (property: Property) => void
  isSaved?: boolean
}

export function ModernPropertyCard({ property, onSave, isSaved = false }: ModernPropertyCardProps) {
  const [saved, setSaved] = useState(isSaved)
  const [imageError, setImageError] = useState(false)

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSaved(!saved)
    if (onSave) onSave(property)
  }

  const formatPrice = (price: number): string => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`
    }
    return `$${price}`
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:shadow-xl hover:shadow-black/50">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-800">
        {!imageError && property.imageUrl ? (
          <Image
            src={property.imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-neutral-800 to-neutral-900">
            <BuildingIcon className="w-16 h-16 text-neutral-700" />
          </div>
        )}

        {/* Tag */}
        {property.tag && (
          <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm border border-white/10">
            {property.tag.text}
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="absolute right-3 top-3 rounded-full bg-black/60 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-black/80 border border-white/10"
        >
          <HeartIcon className={`w-5 h-5 transition-colors ${saved ? "fill-red-500 text-red-500" : ""}`} />
        </button>

        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-medium text-neutral-900 hover:bg-white transition-colors">
              View Details
            </button>
            <button className="px-4 py-2 bg-black/60 backdrop-blur-sm rounded-lg text-sm font-medium text-white hover:bg-black/80 transition-colors border border-white/10">
              <MapPinIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                {property.title}
              </h3>
              <p className="text-sm text-neutral-400 truncate mt-1">{property.location}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-white">{formatPrice(property.price)}</p>
              {property.listingType && (
                <p className="text-xs text-neutral-500 mt-0.5">{property.listingType}</p>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        {property.details && (
          <p className="text-sm text-neutral-400 mb-4 line-clamp-2">{property.details}</p>
        )}

        {/* Features Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {property.bedrooms !== undefined && (
            <div className="flex flex-col items-center p-2 bg-neutral-800/50 rounded-lg">
              <BedIcon className="w-4 h-4 text-blue-400 mb-1" />
              <span className="text-xs font-medium text-white">{property.bedrooms}</span>
              <span className="text-[10px] text-neutral-500">Beds</span>
            </div>
          )}
          {property.bathrooms !== undefined && (
            <div className="flex flex-col items-center p-2 bg-neutral-800/50 rounded-lg">
              <BathIcon className="w-4 h-4 text-green-400 mb-1" />
              <span className="text-xs font-medium text-white">{property.bathrooms}</span>
              <span className="text-[10px] text-neutral-500">Baths</span>
            </div>
          )}
          {property.parking !== undefined && property.parking > 0 && (
            <div className="flex flex-col items-center p-2 bg-neutral-800/50 rounded-lg">
              <CarIcon className="w-4 h-4 text-purple-400 mb-1" />
              <span className="text-xs font-medium text-white">{property.parking}</span>
              <span className="text-[10px] text-neutral-500">Parking</span>
            </div>
          )}
          {property.size && (
            <div className="flex flex-col items-center p-2 bg-neutral-800/50 rounded-lg">
              <RulerIcon className="w-4 h-4 text-yellow-400 mb-1" />
              <span className="text-xs font-medium text-white">{property.size}</span>
              <span className="text-[10px] text-neutral-500">Size</span>
            </div>
          )}
        </div>

        {/* Amenities Tags */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {property.amenities.slice(0, 4).map((amenity, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-neutral-800/50 border border-white/5 rounded-full text-xs text-neutral-400"
              >
                {amenity}
              </span>
            ))}
            {property.amenities.length > 4 && (
              <span className="px-2.5 py-1 bg-neutral-800/50 border border-white/5 rounded-full text-xs text-neutral-500">
                +{property.amenities.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Agent Info */}
        {property.agent && (
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                {property.agent.name.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-medium text-white">{property.agent.name}</p>
                <p className="text-[10px] text-neutral-500">Agent</p>
              </div>
            </div>
            {property.listedDate && (
              <div className="flex items-center gap-1.5 text-[10px] text-neutral-500">
                <CalendarIcon className="w-3 h-3" />
                <span>{new Date(property.listedDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500" />
    </div>
  )
}
