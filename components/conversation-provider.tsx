"use client"

import type React from "react"
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react"
import { getProperties } from "@/lib/mock-data" // Assuming Property type is also here or imported
import type { Property } from "@/lib/mock-data"

type Message = {
  id: string
  role: "user" | "ai"
  content: string
}

type ConversationContextType = {
  messages: Message[]
  isLoading: boolean
  highlightDifferences: boolean
  addMessage: (content: string, role: "user" | "ai") => void
  compareProperties: (propertyIds: string[]) => void
  setHighlightDifferences: (value: boolean | ((prevState: boolean) => boolean)) => void
  clearConversation: () => void
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined)

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [highlightDifferences, _setHighlightDifferences] = useState(false) // Renamed internal setter

  // Ensure setHighlightDifferences exposed by context is stable
  const setHighlightDifferences = useCallback((value: boolean | ((prevState: boolean) => boolean)) => {
    _setHighlightDifferences(value)
  }, []) // _setHighlightDifferences from useState is stable, so empty dependency array

  const addMessage = useCallback((content: string, role: "user" | "ai") => {
    setMessages((prevMessages) => [...prevMessages, { id: Date.now().toString(), role, content }])
  }, [])

  const getPropertyDetails = useCallback((propertyId: string): Partial<Property> | null => {
    const allProperties = getProperties()
    const property = allProperties.find((p) => p.id === propertyId)
    if (!property) return null
    return {
      // Return only a subset of details relevant for comparison, or the full object
      id: property.id,
      title: property.title,
      price: property.price,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      squareFeet: property.squareFeet,
      // Add other relevant fields
    }
  }, [])

  const compareProperties = useCallback(
    async (propertyIds: string[]) => {
      setIsLoading(true)
      const propertiesToCompare = propertyIds.map(getPropertyDetails).filter(Boolean)

      if (propertiesToCompare.length === 0) {
        addMessage("No properties selected or details found for comparison.", "ai")
        setIsLoading(false)
        return
      }

      const prompt = `Compare these properties: ${propertiesToCompare
        .map((p) => p?.title)
        .join(", ")}. Focus on key differences and value.`
      addMessage(prompt, "user")

      // Simulate AI response for comparison
      try {
        // In a real scenario, you'd call your AI service here
        // For now, simulate a delay and a generic response
        await new Promise((resolve) => setTimeout(resolve, 1500))

        let aiResponse = "Based on the comparison:\n"
        propertiesToCompare.forEach((p) => {
          if (p) {
            aiResponse += `- ${p.title}: Priced at $${p.price?.toLocaleString()}, with ${p.bedrooms} beds and ${
              p.bathrooms
            } baths, offering ${p.squareFeet} sq ft.\n`
          }
        })
        if (propertiesToCompare.length > 1) {
          aiResponse += "\nConsider your priorities: budget, size, or specific features when choosing."
        } else {
          aiResponse += "\nThis property offers a solid set of features for its price."
        }
        addMessage(aiResponse, "ai")
      } catch (error) {
        console.error("Error comparing properties:", error)
        addMessage("Sorry, I encountered an error trying to compare the properties.", "ai")
      } finally {
        setIsLoading(false)
      }
    },
    [addMessage, getPropertyDetails],
  )

  const clearConversation = useCallback(() => {
    setMessages([])
  }, [])

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      addMessage("Hi! How can I help you compare these properties today?", "ai")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once on mount

  const contextValue = useMemo(
    () => ({
      messages,
      isLoading,
      highlightDifferences,
      addMessage,
      compareProperties,
      setHighlightDifferences, // This is now the stable useCallback-wrapped version
      clearConversation,
    }),
    [
      messages,
      isLoading,
      highlightDifferences, // The boolean value
      addMessage, // Stable callback
      compareProperties, // Stable callback
      setHighlightDifferences, // Stable callback (from the useCallback above)
      clearConversation, // Stable callback
    ],
  )

  return <ConversationContext.Provider value={contextValue}>{children}</ConversationContext.Provider>
}

export function useConversation() {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error("useConversation must be used within a ConversationProvider")
  }
  return context
}
