"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type VoiceState = "idle" | "listening" | "processing" | "speaking" | "error"

interface VoiceCopilotContextType {
  isOpen: boolean
  voiceState: VoiceState
  transcript: string
  interimTranscript: string
  response: string
  isEnabled: boolean
  toggleCopilot: () => void
  startListening: () => void
  stopListening: () => void
  processCopilotCommand: (text: string) => Promise<void>
  setManualInput: (text: string) => void
  manualInput: string
  isStreaming: boolean
}

const VoiceCopilotContext = createContext<VoiceCopilotContextType | undefined>(undefined)

export function VoiceCopilotProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [voiceState, setVoiceState] = useState<VoiceState>("idle")
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [response, setResponse] = useState("")
  const [isEnabled, setIsEnabled] = useState(true)
  const [manualInput, setManualInput] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)

  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      // @ts-ignore - webkitSpeechRecognition is not in the types
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = ""
        let interimTranscript = ""

        // Process results, separating final from interim
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript
          } else {
            interimTranscript += event.results[i][0].transcript
          }
        }

        // Update state with both types of transcripts
        if (finalTranscript) {
          setTranscript((prev) => prev + finalTranscript)
        }
        setInterimTranscript(interimTranscript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error)
        setVoiceState("error")
        toast({
          title: "Voice Recognition Error",
          description: `Error: ${event.error}. Please try again.`,
          variant: "destructive",
        })
      }

      recognitionRef.current.onend = () => {
        if (voiceState === "listening") {
          const finalText = transcript + interimTranscript
          if (finalText.trim()) {
            processCopilotCommand(finalText)
          } else {
            setVoiceState("idle")
          }
          setInterimTranscript("")
        }
      }
    } else {
      setIsEnabled(false)
      console.warn("Speech recognition not supported in this browser")
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [transcript, interimTranscript, voiceState])

  // Initialize audio for speech synthesis
  useEffect(() => {
    audioRef.current = new Audio()

    audioRef.current.onended = () => {
      setVoiceState("idle")
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  const toggleCopilot = () => {
    setIsOpen((prev) => !prev)
    if (!isOpen) {
      setVoiceState("idle")
      setTranscript("")
      setInterimTranscript("")
      setResponse("")
    }
  }

  const startListening = () => {
    if (!isEnabled) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition. Please use the text input instead.",
        variant: "destructive",
      })
      return
    }

    setVoiceState("listening")
    setTranscript("")
    setInterimTranscript("")

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start()
      } catch (error) {
        console.error("Error starting speech recognition", error)
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
  }

  const processCopilotCommand = async (text: string) => {
    if (!text.trim()) return

    setVoiceState("processing")
    setResponse("")
    setIsStreaming(true)

    try {
      // Call the Groq API route with streaming
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: text }),
      })

      if (!response.ok) {
        let errorText = `Server responded with status ${response.status}`
        try {
          const text = await response.text() // Read the raw response text first
          try {
            // Try to parse as JSON
            const errorPayload = JSON.parse(text)
            if (errorPayload && (errorPayload.message || errorPayload.error)) {
              errorText = errorPayload.message || errorPayload.error
            } else if (text) {
              // If not structured JSON error, but text exists, use truncated text
              errorText = text.substring(0, 200) + (text.length > 200 ? "..." : "")
            }
          } catch (jsonError) {
            // Not JSON, use the raw text if available and not too long
            if (text) {
              errorText = text.substring(0, 200) + (text.length > 200 ? "..." : "")
            }
          }
        } catch (e) {
          // Failed to get response body, stick to status code and status text
          errorText = `Server responded with status ${response.status} ${response.statusText || ""}`
        }
        // Construct a more informative error message
        const detailedErrorMessage = `API Error (${response.status}): ${errorText}`
        throw new Error(detailedErrorMessage)
      }

      if (!response.body) {
        throw new Error("Response body is null")
      }

      // Process the streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let actionData: any = null

      setVoiceState("speaking")

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        // Decode the chunk and append to response
        const chunk = decoder.decode(value, { stream: true })

        // Check if the chunk contains action data (JSON)
        try {
          const jsonMatch = chunk.match(/\{[\s\S]*"type"[\s\S]*\}/)
          if (jsonMatch) {
            const jsonStr = jsonMatch[0]
            actionData = JSON.parse(jsonStr)

            // Remove the JSON from the displayed response
            const cleanChunk = chunk.replace(jsonStr, "")
            setResponse((prev) => prev + cleanChunk)
          } else {
            setResponse((prev) => prev + chunk)
          }
        } catch (e) {
          // If not valid JSON, just append the chunk
          setResponse((prev) => prev + chunk)
        }
      }

      setIsStreaming(false)

      // Handle navigation if action data was found
      if (actionData?.type === "navigate" && actionData.path) {
        setTimeout(() => {
          router.push(actionData.path)
        }, 1500)
      }

      // Text-to-speech would go here in a full implementation
      // For now, we'll just set the state back to idle after a delay
      setTimeout(() => {
        setVoiceState("idle")
      }, 3000)
    } catch (error) {
      console.error("Error processing command:", error) // Log the full error object
      setVoiceState("error")

      let displayErrorMessage = "I'm sorry, I couldn't process your request. Please try again."
      let toastDescription = "There was an error processing your request. Please try again."

      if (error instanceof Error) {
        // Use the (potentially more detailed) message from the Error object
        displayErrorMessage = `I'm sorry, an error occurred: ${error.message}`
        toastDescription = error.message
      }

      setResponse(displayErrorMessage)
      setIsStreaming(false)
      toast({
        title: "Processing Error",
        description: toastDescription,
        variant: "destructive",
      })
    }
  }

  return (
    <VoiceCopilotContext.Provider
      value={{
        isOpen,
        voiceState,
        transcript,
        interimTranscript,
        response,
        isEnabled,
        toggleCopilot,
        startListening,
        stopListening,
        processCopilotCommand,
        manualInput,
        setManualInput,
        isStreaming,
      }}
    >
      {children}
    </VoiceCopilotContext.Provider>
  )
}

export function useVoiceCopilot() {
  const context = useContext(VoiceCopilotContext)
  if (context === undefined) {
    throw new Error("useVoiceCopilot must be used within a VoiceCopilotProvider")
  }
  return context
}
