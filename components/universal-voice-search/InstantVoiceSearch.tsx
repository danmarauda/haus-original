"use client"

import React, { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { type Property, type SearchParams, generateMockResults } from '@/lib/types'
import { MicIcon, MapPinIcon, Building2Icon, BedIcon, DollarSignIcon, TreesIcon, WavesIcon, CarIcon } from '@/components/voice-search/IconComponents'

interface InstantVoiceSearchProps {
  onResults: (results: Property[]) => void
  onClose: () => void
}

type VoiceState = "initializing" | "listening" | "processing" | "complete"

interface LiveKeyword {
  id: string
  text: string
  type: 'location' | 'price' | 'bedrooms' | 'amenity' | 'property_type'
}

export default function InstantVoiceSearch({ onResults, onClose }: InstantVoiceSearchProps) {
  const [state, setState] = useState<VoiceState>('initializing')
  const [liveTranscript, setLiveTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [liveKeywords, setLiveKeywords] = useState<LiveKeyword[]>([])
  const [isListening, setIsListening] = useState(false)

  const recognitionRef = useRef<any>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const SpeechRecognition = (typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) || null

  const extractLiveKeywords = (text: string): LiveKeyword[] => {
    if (!text.trim()) return []

    const keywords: LiveKeyword[] = []
    const words = text.toLowerCase()
    const now = Date.now()

    const locations = ['sydney', 'melbourne', 'brisbane', 'bondi', 'south yarra', 'surfers paradise', 'paddington']
    locations.forEach(location => {
      if (words.includes(location)) {
        keywords.push({
          id: `location-${location}`,
          text: location.charAt(0).toUpperCase() + location.slice(1),
          type: 'location'
        })
      }
    })

    const propertyTypes = ['house', 'apartment', 'unit', 'townhouse', 'penthouse', 'villa']
    propertyTypes.forEach(type => {
      if (words.includes(type)) {
        keywords.push({
          id: `property-${type}`,
          text: type.charAt(0).toUpperCase() + type.slice(1),
          type: 'property_type'
        })
      }
    })

    const priceRegex = /(\$?\d+k|\$?\d+m)/gi
    let match
    while ((match = priceRegex.exec(text)) !== null) {
      keywords.push({
        id: `price-${match[1]}`,
        text: match[1],
        type: 'price'
      })
    }

    const bedroomRegex = /(\d+)\s*(bed|bedroom)/gi
    while ((match = bedroomRegex.exec(text)) !== null) {
      keywords.push({
        id: `bed-${match[1]}`,
        text: `${match[1]} Bedroom${parseInt(match[1]) > 1 ? 's' : ''}`,
        type: 'bedrooms'
      })
    }

    const amenities = ['pool', 'garage', 'garden', 'balcony', 'gym', 'parking']
    amenities.forEach(amenity => {
      if (words.includes(amenity)) {
        keywords.push({
          id: `amenity-${amenity}`,
          text: amenity.charAt(0).toUpperCase() + amenity.slice(1),
          type: 'amenity'
        })
      }
    })

    return keywords
  }

  const getKeywordIcon = (type: string) => {
    const iconClass = "w-4 h-4 mr-2"

    switch(type) {
      case 'location':
        return <MapPinIcon className={`${iconClass} text-blue-400`} />
      case 'property_type':
        return <Building2Icon className={`${iconClass} text-green-400`} />
      case 'bedrooms':
        return <BedIcon className={`${iconClass} text-purple-400`} />
      case 'price':
        return <DollarSignIcon className={`${iconClass} text-yellow-400`} />
      case 'amenity':
        return <WavesIcon className={`${iconClass} text-cyan-400`} />
      default:
        return <WavesIcon className={`${iconClass} text-gray-400`} />
    }
  }

  const initializeVoiceRecognition = () => {
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported.")
      onClose()
      return false
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
      setState('listening')
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscriptUpdate = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        if (result.isFinal) {
          finalTranscriptUpdate += result[0].transcript + ' '
        } else {
          interimTranscript += result[0].transcript
        }
      }

      const currentFullTranscript = finalTranscript + finalTranscriptUpdate + interimTranscript
      setLiveTranscript(currentFullTranscript)

      if (finalTranscriptUpdate) {
        setFinalTranscript(prev => prev + finalTranscriptUpdate)
        resetSilenceTimer()
      }

      const newKeywords = extractLiveKeywords(currentFullTranscript)
      setLiveKeywords(prev => {
        const existing = prev.map(k => k.id)
        const uniqueNew = newKeywords.filter(k => !existing.includes(k.id))
        return [...prev, ...uniqueNew]
      })
    }

    recognition.onend = () => {
      setIsListening(false)
      if (state === 'listening' && (finalTranscript.trim().length > 0 || liveTranscript.trim().length > 0)) {
        processCompleteTranscript()
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      if (event.error === 'no-speech') {
        onClose()
      }
    }

    recognitionRef.current = recognition
    recognition.start()
    return true
  }

  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
    }

    silenceTimeoutRef.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop()
      }
    }, 3000)
  }

  const processCompleteTranscript = async () => {
    setState('processing')
    const textToProcess = finalTranscript.trim() || liveTranscript.trim()

    if (textToProcess.length < 5) {
      onClose()
      return
    }

    try {
      const response = await fetch('/api/voice/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToProcess })
      })

      const data = await response.json()
      const params: SearchParams = data

      setState('complete')

      setTimeout(() => {
        const results = generateMockResults(params)
        onResults(results)
      }, 800)

    } catch (error) {
      console.error("Error processing transcript:", error)
      onClose()
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeVoiceRecognition()
    }, 500)

    return () => {
      clearTimeout(timer)
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-neutral-400 hover:text-white z-10 transition-colors text-2xl leading-none">
        ×
      </button>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">
            {state === 'initializing' && "Initializing..."}
            {state === 'listening' && "Listening..."}
            {state === 'processing' && "Processing your request..."}
            {state === 'complete' && "Finding properties..."}
          </h2>
        </div>

        <div className="relative w-[300px] h-[300px] flex items-center justify-center mb-8">
          {isListening && (
            <>
              <div className="absolute w-64 h-64 rounded-full border border-blue-400/30 animate-pulse"></div>
              <div className="absolute w-72 h-72 rounded-full border border-blue-400/20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}

          <div className={`relative w-40 h-40 rounded-full backdrop-blur-sm transition-all duration-500 ${
            isListening
              ? 'bg-blue-500/20 border-blue-400/40 border-2'
              : state === 'processing'
                ? 'bg-yellow-500/20 border-yellow-400/40 border-2 animate-pulse'
                : 'bg-green-500/20 border-green-400/40 border-2'
          }`}>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MicIcon className={`w-10 h-10 transition-colors duration-300 ${
                isListening ? 'text-blue-400' :
                state === 'processing' ? 'text-yellow-400' : 'text-green-400'
              }`} />
            </div>
          </div>

          {liveKeywords.map((keyword, index) => {
            const angle = (index / Math.max(liveKeywords.length, 1)) * 2 * Math.PI
            const radius = 100
            const x = radius * Math.cos(angle)
            const y = radius * Math.sin(angle)

            return (
              <div
                key={keyword.id}
                className="absolute"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                }}
              >
                <div className="flex items-center bg-neutral-800/90 border border-white/20 rounded-full px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
                  {getKeywordIcon(keyword.type)}
                  {keyword.text}
                </div>
              </div>
            )
          })}
        </div>

        {liveTranscript && (
          <div className="w-full max-w-2xl p-4 bg-black/30 border border-white/10 rounded-lg backdrop-blur-sm">
            <p className="text-neutral-200 leading-relaxed">
              "{liveTranscript}"
            </p>
          </div>
        )}
      </div>

      {state === 'listening' && (
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-sm text-neutral-400">
            Speak naturally. I'll detect keywords as you talk.
          </p>
        </div>
      )}
    </div>
  )
}
