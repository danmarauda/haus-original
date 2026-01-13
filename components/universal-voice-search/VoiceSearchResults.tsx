"use client"

import React, { useState } from 'react'
import { type Property, type SearchParams } from '@/lib/types'
import { ModernPropertyCard } from '@/components/modern-property-card/ModernPropertyCard'
import { XIcon, SparklesIcon, TrendingUpIcon, MapPinIcon, LightbulbIcon, FilterIcon } from '@/components/voice-search/IconComponents'

interface VoiceSearchResultsProps {
  results: Property[]
  params: SearchParams
  onClose: () => void
}

type TabType = 'properties' | 'insights' | 'suggestions'

export default function VoiceSearchResults({ results, params, onClose }: VoiceSearchResultsProps) {
  const [activeTab, setActiveTab] = useState<TabType>('properties')
  const [savedProperties, setSavedProperties] = useState<Set<string>>(new Set())

  const handleSaveProperty = (property: Property) => {
    setSavedProperties(prev => {
      const newSet = new Set(prev)
      if (newSet.has(property.id)) {
        newSet.delete(property.id)
      } else {
        newSet.add(property.id)
      }
      return newSet
    })
  }

  const getSearchSummary = () => {
    const parts: string[] = []
    if (params.location) parts.push(`in ${params.location}`)
    if (params.propertyType) parts.push(params.propertyType)
    if (params.bedroomsMin) parts.push(`${params.bedroomsMin}+ beds`)
    if (params.priceMin || params.priceMax) {
      const price = params.priceMin && params.priceMax
        ? `$${(params.priceMin / 1000).toFixed(0)}k - $${(params.priceMax / 1000).toFixed(0)}k`
        : params.priceMin
          ? `$${(params.priceMin / 1000).toFixed(0)}k+`
          : `Up to $${(params.priceMax! / 1000).toFixed(0)}k`
      parts.push(price)
    }
    return parts.join(' · ')
  }

  const getMarketInsights = () => {
    const avgPrice = results.length > 0
      ? results.reduce((sum, p) => sum + p.price, 0) / results.length
      : 0

    const locationCounts = results.reduce((acc, p) => {
      const loc = p.location
      acc[loc] = (acc[loc] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topLocations = Object.entries(locationCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([loc, count]) => ({ location: loc, count }))

    return {
      avgPrice,
      totalListings: results.length,
      topLocations,
      priceRange: results.length > 0 ? {
        min: Math.min(...results.map(p => p.price)),
        max: Math.max(...results.map(p => p.price))
      } : null
    }
  }

  const getSuggestions = () => {
    const suggestions: string[] = []

    if (results.length === 0) {
      suggestions.push('Try expanding your search area')
      suggestions.push('Consider increasing your price range')
      suggestions.push('Reduce the number of required amenities')
    } else if (results.length < 5) {
      suggestions.push('Try nearby suburbs for more options')
      suggestions.push('Consider removing some filters')
    } else {
      suggestions.push('Refine by adding specific amenities')
      suggestions.push('Sort by price or newest listings')
    }

    return suggestions
  }

  const insights = getMarketInsights()
  const suggestions = getSuggestions()

  return (
    <div className="relative w-full h-full flex flex-col bg-neutral-950 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-white/10 bg-neutral-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SparklesIcon className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">Search Results</h2>
                <p className="text-sm text-neutral-400">
                  {results.length} properties found {getSearchSummary() && `· ${getSearchSummary()}`}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-neutral-400 hover:text-white"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab('properties')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'properties'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              Properties ({results.length})
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'insights'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <TrendingUpIcon className="w-4 h-4" />
                Market Insights
              </span>
            </button>
            <button
              onClick={() => setActiveTab('suggestions')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'suggestions'
                  ? 'bg-blue-600 text-white'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              <span className="flex items-center gap-2">
                <LightbulbIcon className="w-4 h-4" />
                Tips
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          {activeTab === 'properties' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map(property => (
                <ModernPropertyCard
                  key={property.id}
                  property={property}
                  onSave={handleSaveProperty}
                  isSaved={savedProperties.has(property.id)}
                />
              ))}
            </div>
          )}

          {activeTab === 'insights' && (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Average Price */}
              <div className="p-6 bg-neutral-800/50 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <TrendingUpIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Market Overview</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Average Price</p>
                    <p className="text-2xl font-bold text-white">
                      ${insights.avgPrice > 0 ? (insights.avgPrice / 1000000).toFixed(2) : '0.00'}M
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400 mb-1">Total Listings</p>
                    <p className="text-2xl font-bold text-white">{insights.totalListings}</p>
                  </div>
                </div>
                {insights.priceRange && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-sm text-neutral-400 mb-2">Price Range</p>
                    <div className="flex items-center justify-between">
                      <span className="text-white">${(insights.priceRange.min / 1000000).toFixed(2)}M</span>
                      <div className="flex-grow mx-4 h-2 bg-neutral-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-full"></div>
                      </div>
                      <span className="text-white">${(insights.priceRange.max / 1000000).toFixed(2)}M</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Top Locations */}
              <div className="p-6 bg-neutral-800/50 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <MapPinIcon className="w-5 h-5 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Top Locations</h3>
                </div>
                <div className="space-y-3">
                  {insights.topLocations.map(({ location, count }, i) => (
                    <div key={location} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-neutral-400">{i + 1}.</span>
                        <span className="text-white">{location}</span>
                      </div>
                      <span className="text-neutral-400">{count} properties</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="max-w-3xl mx-auto">
              <div className="p-6 bg-neutral-800/50 border border-white/10 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <LightbulbIcon className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Search Tips</h3>
                </div>
                <ul className="space-y-3">
                  {suggestions.map((suggestion, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-neutral-300">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 p-6 bg-blue-500/10 border border-blue-400/20 rounded-xl">
                <h4 className="text-white font-medium mb-2">Voice Search Tips</h4>
                <ul className="space-y-2 text-sm text-neutral-300">
                  <li>• Be specific about locations and suburbs</li>
                  <li>• Mention your budget as "under $1M" or "between $500k and $800k"</li>
                  <li>• Include bedroom count like "3 bedrooms" or "3 beds"</li>
                  <li>• Add desired amenities like "pool", "garage", or "garden"</li>
                  <li>• Use confirmation phrases like "let's go" or "search" to execute</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
