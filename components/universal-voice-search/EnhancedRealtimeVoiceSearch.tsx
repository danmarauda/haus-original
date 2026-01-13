"use client"

import React, { useState, useEffect, useRef } from 'react'
import { type Property } from '@/lib/types'
import { MicIcon, XIcon, SettingsIcon, VolumeIcon, SparklesIcon } from '@/components/voice-search/IconComponents'
import { OpenAIRealtimeService } from '@/lib/services/OpenAIRealtimeService'
import { AustralianPropertyService } from '@/lib/services/AustralianPropertyService'

interface EnhancedRealtimeVoiceSearchProps {
  onResults: (results: Property[]) => void
  onClose: () => void
}

type ConnectionState = "connecting" | "connected" | "listening" | "speaking" | "processing" | "error"

const VOICES = [
  { id: 'cedar', name: 'Cedar', description: 'Warm and friendly' },
  { id: 'marin', name: 'Marin', description: 'Professional and clear' },
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced' },
  { id: 'echo', name: 'Echo', description: 'Deep and resonant' },
  { id: 'shimmer', name: 'Shimmer', description: 'Soft and gentle' },
]

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
]

export default function EnhancedRealtimeVoiceSearch({ onResults, onClose }: EnhancedRealtimeVoiceSearchProps) {
  const [state, setState] = useState<ConnectionState>('connecting')
  const [transcript, setTranscript] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [selectedVoice, setSelectedVoice] = useState('cedar')
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(12).fill(5))
  const [apiKey, setApiKey] = useState('')

  const serviceRef = useRef<OpenAIRealtimeService | null>(null)
  const propertyServiceRef = useRef<AustralianPropertyService | null>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    propertyServiceRef.current = new AustralianPropertyService()

    const storedApiKey = localStorage.getItem('openai_api_key')
    if (storedApiKey) {
      setApiKey(storedApiKey)
      initializeService(storedApiKey)
    } else {
      setState('error')
    }

    return () => {
      if (serviceRef.current) {
        serviceRef.current.disconnect()
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const initializeService = async (key: string) => {
    try {
      const service = new OpenAIRealtimeService({
        apiKey: key,
        voice: selectedVoice as any,
        language: selectedLanguage
      })

      serviceRef.current = service

      // Set up event handlers
      service.on('session_ready', () => {
        setState('connected')
        startRecording()
      })

      service.on('speech_started', () => {
        setState('listening')
      })

      service.on('speech_stopped', () => {
        setState('processing')
      })

      service.on('transcript_delta', (event: any) => {
        if (event.delta) {
          setTranscript(prev => prev + event.delta)
        }
      })

      service.on('response_started', () => {
        setState('speaking')
      })

      service.on('response_complete', () => {
        setState('connected')
        startRecording()
      })

      service.on('property_search_requested', async (event: any) => {
        const { searchParams } = event
        await handlePropertySearch(searchParams)
      })

      service.on('error', (error: any) => {
        console.error('Realtime service error:', error)
        setState('error')
      })

      await service.initialize()

    } catch (error) {
      console.error('Failed to initialize service:', error)
      setState('error')
    }
  }

  const startRecording = async () => {
    if (serviceRef.current) {
      await serviceRef.current.startRecording()
      startAudioVisualization()
    }
  }

  const stopRecording = () => {
    if (serviceRef.current) {
      serviceRef.current.stopRecording()
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const handlePropertySearch = async (searchParams: any) => {
    if (!propertyServiceRef.current) return

    try {
      const result = await propertyServiceRef.current.searchProperties(searchParams)

      // Send results back to AI
      if (serviceRef.current) {
        serviceRef.current.sendFunctionResult(result.properties.length > 0 ? 'success' : 'no_results', {
          count: result.properties.length,
          properties: result.properties.slice(0, 5).map(p => ({
            title: p.title,
            price: p.price,
            location: `${p.suburb}, ${p.state}`,
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms
          }))
        })
      }

      // Also update UI
      setTimeout(() => {
        onResults(result.properties)
      }, 1000)

    } catch (error) {
      console.error('Property search error:', error)
    }
  }

  const startAudioVisualization = () => {
    const animate = () => {
      setAudioLevels(prev => prev.map(() => Math.random() * 40 + 5))
      animationRef.current = requestAnimationFrame(animate)
    }
    animate()
  }

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId)
    if (serviceRef.current) {
      serviceRef.current.changeVoice(voiceId as any)
    }
  }

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode)
    if (serviceRef.current) {
      serviceRef.current.changeLanguage(languageCode)
    }
  }

  const handleApiKeySave = (key: string) => {
    localStorage.setItem('openai_api_key', key)
    setApiKey(key)
    setShowSettings(false)
    initializeService(key)
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-neutral-950">
      <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-neutral-400 hover:text-white z-10 transition-colors">
        <XIcon className="w-6 h-6" />
      </button>

      <button
        onClick={() => setShowSettings(!showSettings)}
        className="absolute top-4 left-4 sm:top-6 sm:left-6 text-neutral-400 hover:text-white z-10 transition-colors"
      >
        <SettingsIcon className="w-6 h-6" />
      </button>

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto px-6">
        {/* State Header */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <SparklesIcon className="w-6 h-6 text-blue-400" />
            <h2 className="text-3xl sm:text-4xl font-medium text-white tracking-tight">
              {state === 'connecting' && "Connecting to AI..."}
              {state === 'connected' && "Connected - Start speaking"}
              {state === 'listening' && "Listening..."}
              {state === 'speaking' && "AI is speaking..."}
              {state === 'processing' && "Processing..."}
              {state === 'error' && "Connection Error"}
            </h2>
          </div>
          <p className="text-neutral-400">
            {state === 'connected' && "Tell me what you're looking for in a property"}
            {state === 'listening' && "I'm listening to your requirements"}
            {state === 'speaking' && "Hear the AI response"}
            {state === 'error' && "Please check your API key in settings"}
          </p>
        </div>

        {/* Audio Visualization */}
        {(state === 'listening' || state === 'speaking') && (
          <div className="flex items-center justify-center gap-1 mb-8 h-32">
            {audioLevels.map((level, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-75"
                style={{ height: `${level}%` }}
              />
            ))}
          </div>
        )}

        {/* Central Orb */}
        <div className="relative w-[200px] h-[200px] flex items-center justify-center mb-8">
          {state === 'listening' && (
            <>
              <div className="absolute w-48 h-48 rounded-full border-2 border-blue-400/30 animate-listeningPulse"></div>
              <div className="absolute w-56 h-56 rounded-full border border-blue-400/20 animate-listeningPulse" style={{ animationDelay: '0.3s' }}></div>
            </>
          )}

          {state === 'speaking' && (
            <>
              <div className="absolute w-48 h-48 rounded-full border-2 border-purple-400/30 animate-pulse"></div>
              <div className="absolute w-56 h-56 rounded-full border border-purple-400/20 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            </>
          )}

          <div className={`relative w-28 h-28 rounded-full backdrop-blur-sm transition-all duration-500 ${
            state === 'listening'
              ? 'bg-blue-500/30 border-blue-400/50 border-2'
              : state === 'speaking'
                ? 'bg-purple-500/30 border-purple-400/50 border-2'
                : state === 'processing'
                  ? 'bg-yellow-500/20 border-yellow-400/40 border-2 animate-processingSpin'
                  : 'bg-green-500/20 border-green-400/40 border-2'
          }`}>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              {state === 'listening' ? (
                <MicIcon className="w-10 h-10 text-blue-400" />
              ) : state === 'speaking' ? (
                <VolumeIcon className="w-10 h-10 text-purple-400" />
              ) : (
                <SparklesIcon className="w-10 h-10 text-green-400" />
              )}
            </div>
          </div>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="w-full max-w-2xl p-4 bg-black/30 border border-white/10 rounded-lg backdrop-blur-sm mb-4">
            <p className="text-sm text-neutral-400 mb-1">You said:</p>
            <p className="text-lg text-neutral-200">{transcript}</p>
          </div>
        )}

        {aiResponse && (
          <div className="w-full max-w-2xl p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-blue-400 mb-1">AI Response:</p>
            <p className="text-lg text-neutral-200">{aiResponse}</p>
          </div>
        )}
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute inset-0 bg-neutral-950/95 backdrop-blur-sm z-20 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-semibold text-white">Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-neutral-400 hover:text-white"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* API Key */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-neutral-400 mb-2">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-3 bg-neutral-800 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:border-blue-400"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Your API key is stored locally in your browser
              </p>
            </div>

            {/* Voice Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-neutral-400 mb-3">
                AI Voice
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VOICES.map(voice => (
                  <button
                    key={voice.id}
                    onClick={() => handleVoiceChange(voice.id)}
                    className={`p-4 rounded-lg border transition-all ${
                      selectedVoice === voice.id
                        ? 'bg-blue-500/20 border-blue-400/50 text-white'
                        : 'bg-neutral-800 border-white/10 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    <div className="font-medium">{voice.name}</div>
                    <div className="text-xs text-neutral-400">{voice.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-neutral-400 mb-3">
                Language
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {LANGUAGES.map(language => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`p-3 rounded-lg border text-sm transition-all ${
                      selectedLanguage === language.code
                        ? 'bg-blue-500/20 border-blue-400/50 text-white'
                        : 'bg-neutral-800 border-white/10 text-neutral-300 hover:bg-neutral-700'
                    }`}
                  >
                    {language.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button
                onClick={() => handleApiKeySave(apiKey)}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Save & Connect
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes listeningPulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }
        .animate-listeningPulse {
          animation: listeningPulse 1.5s ease-in-out infinite;
        }
        @keyframes processingSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-processingSpin {
          animation: processingSpin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}
