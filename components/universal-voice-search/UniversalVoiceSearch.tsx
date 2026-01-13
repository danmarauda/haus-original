"use client"

import React, { useState, useEffect } from 'react'
import { type Property } from '@/lib/types'
import { MicIcon, XIcon, SparklesIcon, WavesIcon } from '@/components/voice-search/IconComponents'
import InstantVoiceSearch from './InstantVoiceSearch'
import EnhancedVoiceSearch from './EnhancedVoiceSearch'
import EnhancedRealtimeVoiceSearch from './EnhancedRealtimeVoiceSearch'

interface UniversalVoiceSearchProps {
  onResults: (results: Property[], params: any) => void
  onClose: () => void
}

type VoiceSearchMode = 'realtime' | 'enhanced' | 'instant' | 'classic'

interface VoiceSearchOption {
  id: VoiceSearchMode
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
  requirements?: string
  features: string[]
}

const VOICE_SEARCH_OPTIONS: VoiceSearchOption[] = [
  {
    id: 'realtime',
    name: 'OpenAI Realtime',
    description: 'Natural voice-to-voice conversations',
    icon: SparklesIcon,
    badge: 'PREMIUM',
    requirements: 'OpenAI API Key required',
    features: [
      'Natural conversation with AI',
      'Real-time voice interaction',
      'Australian property expertise',
      'Multi-language support',
      'Voice activity detection'
    ]
  },
  {
    id: 'enhanced',
    name: 'Enhanced Voice',
    description: 'Advanced speech processing with keyword extraction',
    icon: WavesIcon,
    features: [
      'Real-time keyword extraction',
      'Visual feedback during speech',
      'Voice confirmation commands',
      'Intelligent pause detection',
      'AI-powered parameter extraction'
    ]
  },
  {
    id: 'instant',
    name: 'Instant Voice',
    description: 'Fast voice-to-search with live visualization',
    icon: MicIcon,
    features: [
      'Instant voice processing',
      'Live keyword visualization',
      'Automatic search execution',
      'Minimal interaction required',
      'Quick property discovery'
    ]
  },
  {
    id: 'classic',
    name: 'Classic Voice',
    description: 'Traditional voice search with structured display',
    icon: WavesIcon,
    features: [
      'Structured parameter extraction',
      'Visual parameter confirmation',
      'Step-by-step processing',
      'Reliable and stable',
      'Google Gemini powered'
    ]
  }
]

export default function UniversalVoiceSearch({ onResults, onClose }: UniversalVoiceSearchProps) {
  const [selectedMode, setSelectedMode] = useState<VoiceSearchMode>('instant')
  const [showModeSelector, setShowModeSelector] = useState(true)

  const handleModeSelect = (mode: VoiceSearchMode) => {
    setSelectedMode(mode)
    setShowModeSelector(false)
  }

  const handleBackToSelector = () => {
    setShowModeSelector(true)
  }

  const renderModeSelector = () => {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-neutral-950">
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

        <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-neutral-400 hover:text-white z-10 transition-colors">
          <XIcon className="w-6 h-6" />
        </button>

        <div className="relative z-10 max-w-4xl w-full mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight mb-4">
              Choose Your Voice Search Experience
            </h2>
            <p className="text-lg text-neutral-400">
              Select the voice search mode that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {VOICE_SEARCH_OPTIONS.map((option) => {
              const IconComponent = option.icon

              return (
                <div
                  key={option.id}
                  onClick={() => handleModeSelect(option.id)}
                  className="relative p-6 bg-neutral-800/30 border border-white/10 rounded-xl backdrop-blur-sm cursor-pointer transition-all hover:bg-neutral-700/30 hover:border-white/20 group"
                >
                  {option.badge && (
                    <div className="absolute -top-2 -right-2 px-2 py-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-full">
                      {option.badge}
                    </div>
                  )}

                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-neutral-700/50 rounded-lg group-hover:bg-neutral-600/50 transition-colors">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {option.name}
                      </h3>
                      <p className="text-neutral-400 text-sm mb-2">
                        {option.description}
                      </p>
                      {option.requirements && (
                        <p className="text-amber-400 text-xs">
                          {option.requirements}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-medium text-neutral-300 uppercase tracking-wider">
                      Features
                    </div>
                    {option.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-neutral-300">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        {feature}
                      </div>
                    ))}
                    {option.features.length > 3 && (
                      <div className="text-xs text-neutral-500">
                        +{option.features.length - 3} more features
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                      Select This Mode →
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-neutral-500">
              All modes support property search with natural language
            </p>
          </div>
        </div>
      </div>
    )
  }

  const renderSelectedMode = () => {
    switch (selectedMode) {
      case 'instant':
        return <InstantVoiceSearch onResults={onResults} onClose={onClose} />
      case 'enhanced':
        return <EnhancedVoiceSearch onResults={onResults} onClose={onClose} />
      case 'realtime':
        return <EnhancedRealtimeVoiceSearch onResults={onResults} onClose={onClose} />
      case 'classic':
        // For now, classic uses the enhanced component
        // In the future, this could be a separate implementation
        return <EnhancedVoiceSearch onResults={onResults} onClose={onClose} />
      default:
        return renderModeSelector()
    }
  }

  if (showModeSelector) {
    return renderModeSelector()
  }

  return renderSelectedMode()
}
