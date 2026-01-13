"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useConversation } from "@/components/conversation-provider"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Loader2 } from "lucide-react"

export default function ComparisonChat() {
  const { messages, isLoading, addMessage } = useConversation()
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Memoize the submit handler to avoid recreating it on every render
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (input.trim() === "") return

      // Add user message
      addMessage(input, "user")
      setInput("")

      // Simulate AI response
      setTimeout(() => {
        addMessage(
          "Based on your preferences, I recommend focusing on the property with better school districts if you have children, or the one with the lower price per square foot if investment potential is your priority.",
          "ai",
        )
      }, 1000)
    },
    [input, addMessage],
  )

  // Memoize the keydown handler to avoid recreating it on every render
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        handleSubmit(e as unknown as React.FormEvent)
      }
    },
    [handleSubmit],
  )

  // Memoize the rendered messages to avoid recalculating on every render
  const renderedMessages = useMemo(() => {
    return messages.map((message) => (
      <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[80%] rounded-lg p-3 ${
            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <p className="text-sm">{message.content}</p>
        </div>
      </div>
    ))
  }, [messages])

  return (
    <div className="flex flex-col h-[600px] border rounded-md overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-medium">AI Property Assistant</h3>
        <p className="text-sm text-muted-foreground">Ask questions about these properties</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {renderedMessages}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about these properties..."
          className="min-h-[60px] resize-none"
          onKeyDown={handleKeyDown}
        />
        <Button type="submit" size="icon" disabled={isLoading || input.trim() === ""}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
