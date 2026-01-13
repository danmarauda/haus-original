"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, MicOff, Send, X, Loader2 } from "lucide-react"
import { useVoiceCopilot } from "./voice-copilot-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function VoiceCopilotInterface() {
  const {
    isOpen,
    voiceState,
    transcript,
    interimTranscript,
    response,
    startListening,
    stopListening,
    toggleCopilot,
    processCopilotCommand,
    manualInput,
    setManualInput,
    isStreaming,
  } = useVoiceCopilot()

  const inputRef = useRef<HTMLInputElement>(null)
  const responseEndRef = useRef<HTMLDivElement>(null)
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Auto-scroll to bottom of response as it streams in
  useEffect(() => {
    if (isStreaming && responseEndRef.current) {
      responseEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [response, isStreaming])

  // Auto-scroll to bottom of transcript as it streams in
  useEffect(() => {
    if (voiceState === "listening" && transcriptEndRef.current) {
      transcriptEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [transcript, interimTranscript, voiceState])

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      processCopilotCommand(manualInput)
      setManualInput("")
    }
  }

  // Combine final and interim transcripts for display
  const displayTranscript = transcript + (interimTranscript ? interimTranscript : "")

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => toggleCopilot()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative mx-4 w-full max-w-2xl rounded-lg border border-white/10 bg-black p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-light uppercase tracking-[0.2em]">HAUS COPILOT</h2>
              <Button variant="ghost" size="icon" onClick={toggleCopilot}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Voice visualization */}
            <div className="mb-6 flex h-16 items-center justify-center">
              {voiceState === "listening" ? (
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-8 w-1 bg-[#D4C1B3]"
                      animate={{
                        height: [8, 16 + Math.random() * 16, 8],
                      }}
                      transition={{
                        duration: 0.5 + Math.random() * 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  ))}
                </div>
              ) : voiceState === "processing" ? (
                <Loader2 className="h-8 w-8 animate-spin text-[#D4C1B3]" />
              ) : voiceState === "speaking" ? (
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="h-8 w-1 bg-white"
                      animate={{
                        height: [8, 12 + Math.random() * 12, 8],
                      }}
                      transition={{
                        duration: 0.4 + Math.random() * 0.4,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/60">
                  {voiceState === "error" ? "Voice recognition error" : "Ask me anything about HAUS"}
                </div>
              )}
            </div>

            {/* Transcript with real-time streaming */}
            {displayTranscript && (
              <div className="mb-4 max-h-40 overflow-y-auto rounded border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-light text-white/80">
                  <span>{transcript}</span>
                  {interimTranscript && <span className="text-[#D4C1B3]/80">{interimTranscript}</span>}
                  {voiceState === "listening" && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      className="ml-1 inline-block h-4 w-1 bg-[#D4C1B3]"
                    />
                  )}
                </p>
                <div ref={transcriptEndRef} />
              </div>
            )}

            {/* Response - with streaming indicator */}
            {response && (
              <div className="mb-6 max-h-60 overflow-y-auto rounded border border-[#D4C1B3]/20 bg-[#D4C1B3]/5 p-4">
                <p className="text-sm font-light text-white">
                  {response}
                  {isStreaming && (
                    <motion.span
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                      className="ml-1 inline-block h-4 w-1 bg-[#D4C1B3]"
                    />
                  )}
                </p>
                <div ref={responseEndRef} />
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={voiceState === "listening" ? stopListening : startListening}
                  className={`flex-1 ${voiceState === "listening" ? "bg-[#D4C1B3] text-black" : ""}`}
                  disabled={voiceState === "processing" || isStreaming}
                >
                  {voiceState === "listening" ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" /> STOP LISTENING
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" /> START LISTENING
                    </>
                  )}
                </Button>
              </div>

              <div className="relative">
                <form onSubmit={handleManualSubmit} className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your question..."
                    value={manualInput}
                    onChange={(e) => setManualInput(e.target.value)}
                    className="flex-1"
                    disabled={voiceState === "processing" || isStreaming}
                  />
                  <Button type="submit" disabled={!manualInput.trim() || voiceState === "processing" || isStreaming}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Suggestions */}
            <div className="mt-6">
              <p className="mb-2 text-xs font-light uppercase tracking-[0.1em] text-white/60">TRY ASKING</p>
              <div className="flex flex-wrap gap-2">
                <SuggestionButton text="Show me luxury properties" />
                <SuggestionButton text="Navigate to my saved homes" />
                <SuggestionButton text="What's the market trend in New York?" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SuggestionButton({ text }: { text: string }) {
  const { processCopilotCommand, voiceState, isStreaming } = useVoiceCopilot()

  return (
    <button
      onClick={() => processCopilotCommand(text)}
      className="rounded border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white"
      disabled={voiceState === "processing" || isStreaming}
    >
      {text}
    </button>
  )
}
