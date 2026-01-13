"use client"

import React, { useState, useEffect, useRef } from 'react'
import { type Property, type SearchParams, generateMockResults } from '@/lib/types'
import { MicIcon, XIcon, SearchIcon, MapPinIcon, Building2Icon, BedIcon, DollarSignIcon, WavesIcon } from '@/components/voice-search/IconComponents'

interface EnhancedVoiceSearchProps {
  onResults: (results: Property[]) => void
  onClose: () => void
}

type VoiceState = "initializing" | "listening" | "processing" | "confirming" | "complete"

interface ExtractedKeyword {
  id: string
  text: string
  type: 'location' | 'price' | 'bedrooms' | 'amenity' | 'property_type'
  confidence: number
}

export default function EnhancedVoiceSearch({ onResults, onClose }: EnhancedVoiceSearchProps) {
  const [state, setState] = useState<VoiceState>('initializing')
  const [transcript, setTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [extractedKeywords, setExtractedKeywords] = useState<ExtractedKeyword[]>([])
  const [isListening, setIsListening] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const recognitionRef = useRef<any>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const SpeechRecognition = (typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)) || null

  // Voice confirmation phrases
  const CONFIRMATION_PHRASES = ["let's go", "lets go", "okay", "yes", "search", "find", "do it", "confirm"]

  const extractKeywords = (text: string): ExtractedKeyword[] => {
    const keywords: ExtractedKeyword[] = []
    const words = text.toLowerCase()
    const now = Date.now()

    const locations = ['sydney', 'melbourne', 'brisbane', 'bondi', 'south yarra', 'surfers paradise', 'paddington', 'fitzroy', 'newtown', 'st kilda', 'manly', 'perth', 'adelaide', 'canberra', 'darwin', 'hobart']
    locations.forEach(location => {
      if (words.includes(location)) {
        keywords.push({
          id: `location-${location}-${now}`,
          text: location.charAt(0).toUpperCase() + location.slice(1),
          type: 'location',
          confidence: 0.9
        })
      }
    })

    const propertyTypes = ['house', 'apartment', 'unit', 'townhouse', 'penthouse', 'villa', 'terrace', 'studio']
    propertyTypes.forEach(type => {
      if (words.includes(type)) {
        keywords.push({
          id: `property-${type}-${now}`,
          text: type.charAt(0).toUpperCase() + type.slice(1),
          type: 'property_type',
          confidence: 0.85
        })
      }
    })

    const priceRegex = /(\$?\d+k|\$?\d+m)/gi
    let match
    while ((match = priceRegex.exec(text)) !== null) {
      keywords.push({
        id: `price-${match[1]}-${now}`,
        text: match[1],
        type: 'price',
        confidence: 0.95
      })
    }

    const bedroomRegex = /(\d+)\s*(bed|bedroom)/gi
    while ((match = bedroomRegex.exec(text)) !== null) {
      keywords.push({
        id: `bed-${match[1]}-${now}`,
        text: `${match[1]} Bedroom${parseInt(match[1]) > 1 ? 's' : ''}`,
        type: 'bedrooms',
        confidence: 0.9
      })
    }

    const amenities = ['pool', 'garage', 'garden', 'balcony', 'gym', 'parking', 'waterfront', 'sea view', 'mountain view', 'pet friendly', 'air conditioning', 'solar panels']
    amenities.forEach(amenity => {
      if (words.includes(amenity)) {
        keywords.push({
          id: `amenity-${amenity}-${now}`,
          text: amenity.charAt(0).toUpperCase() + amenity.slice(1),
          type: 'amenity',
          confidence: 0.8
        })
      }
    })

    return keywords
  }

  const checkConfirmationPhrase = (text: string): boolean => {
    const cleanText = text.toLowerCase().trim()
    return CONFIRMATION_PHRASES.some(phrase => cleanText.includes(phrase))
  }

  const getKeywordIcon = (type: string) => {
    const iconClass = "w-4 h-4"

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
    recognition.lang = 'en-AU'

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
      setTranscript(currentFullTranscript)

      if (finalTranscriptUpdate) {
        setFinalTranscript(prev => prev + finalTranscriptUpdate)
        resetSilenceTimer()

        // Check for confirmation phrase
        if (checkConfirmationPhrase(finalTranscriptUpdate)) {
          handleSearch()
          return
        }
      }

      const newKeywords = extractKeywords(currentFullTranscript)
      setExtractedKeywords(prev => {
        const existing = prev.map(k => k.id)
        const uniqueNew = newKeywords.filter(k => !existing.includes(k.id))
        return [...prev, ...uniqueNew]
      })
    }

    recognition.onend = () => {
      setIsListening(false)
      if (state === 'listening' && finalTranscript.trim().length > 0) {
        setShowConfirm(true)
        setState('confirming')
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
    }, 2000)
  }

  const processTranscript = async () => {
    setState('processing')
    const textToProcess = finalTranscript.trim()

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

  const handleSearch = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    processTranscript()
  }

  const handleRetry = () => {
    setFinalTranscript('')
    setTranscript('')
    setExtractedKeywords([])
    setShowConfirm(false)
    setState('listening')
    initializeVoiceRecognition()
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
            {state === 'confirming' && "Ready to search?"}
            {state === 'complete' && "Finding properties..."}
          </h2>
          <p className="mt-2 text-neutral-400">
            {state === 'listening' && "Speak naturally. Say 'Let's go' to search."}
            {state === 'confirming' && "Review your criteria or search again"}
          </p>
        </div>

        {/* Orb Animation */}
        <div className="relative w-[250px] h-[250px] flex items-center justify-center mb-8">
          {isListening && (
            <>
              <div className="absolute w-56 h-56 rounded-full border border-blue-400/30 animate-pulse"></div>
              <div className="absolute w-64 h-64 rounded-full border border-blue-400/20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </>
          )}

          <div className={`relative w-32 h-32 rounded-full backdrop-blur-sm transition-all duration-500 ${
            isListening
              ? 'bg-blue-500/20 border-blue-400/40 border-2'
              : state === 'processing'
                ? 'bg-yellow-500/20 border-yellow-400/40 border-2 animate-pulse'
                : state === 'confirming'
                  ? 'bg-green-500/20 border-green-400/40 border-2'
                  : 'bg-purple-500/20 border-purple-400/40 border-2'
          }`}>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <MicIcon className={`w-8 h-8 transition-colors duration-300 ${
                isListening ? 'text-blue-400' :
                state === 'processing' ? 'text-yellow-400' :
                state === 'confirming' ? 'text-green-400' : 'text-purple-400'
              }`} />
            </div>
          </div>
        </div>

        {/* Extracted Keywords */}
        {extractedKeywords.length > 0 && (
          <div className="w-full max-w-2xl mb-6">
            <div className="flex flex-wrap justify-center gap-3">
              {extractedKeywords.slice(-8).map((keyword, index) => (
                <div
                  key={keyword.id}
                  className="flex items-center bg-neutral-800/90 border border-white/20 rounded-full px-4 py-2 text-sm font-medium text-white backdrop-blur-md animate-fadeInScale"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {getKeywordIcon(keyword.type)}
                  {keyword.text}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="w-full max-w-2xl p-6 bg-black/30 border border-white/10 rounded-xl backdrop-blur-sm mb-6">
            <p className="text-xl text-neutral-200 leading-relaxed min-h-[60px]">
              "{transcript}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        {state === 'confirming' && (
          <div className="flex items-center gap-4">
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl transition-colors flex items-center gap-2"
            >
              <XIcon className="w-4 h-4" />
              Search Again
            </button>
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors flex items-center gap-2 font-medium"
            >
              <SearchIcon className="w-4 h-4" />
              Find Properties
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
