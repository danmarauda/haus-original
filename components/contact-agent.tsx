"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, Phone, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ContactAgentProps {
  property: any
}

export function ContactAgent({ property }: ContactAgentProps) {
  const [contactMethod, setContactMethod] = useState<"message" | "call" | "tour">("message")
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send the form data to your backend
    setFormSubmitted(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-[#2D2F32] bg-[#1F2124] p-6"
    >
      <h3 className="text-xl font-semibold">Contact Agent</h3>

      <div className="mt-4 flex items-center">
        <div className="relative h-12 w-12 overflow-hidden rounded-full">
          <Image src="/agent-profile.png" alt="Real estate agent" fill className="object-cover" />
        </div>
        <div className="ml-3">
          <div className="font-medium">Sarah Johnson</div>
          <div className="text-sm text-[#A0A3A7]">OpenHaus Premier Agent</div>
        </div>
      </div>

      {!formSubmitted ? (
        <>
          <div className="mt-6 grid grid-cols-3 gap-2">
            <Button
              variant={contactMethod === "message" ? "default" : "outline"}
              className={`flex flex-col items-center py-3 ${
                contactMethod === "message" ? "bg-[#FFD166] text-[#121315]" : "border-[#2D2F32] text-[#A0A3A7]"
              }`}
              onClick={() => setContactMethod("message")}
            >
              <MessageSquare className="mb-1 h-4 w-4" />
              <span className="text-xs">Message</span>
            </Button>
            <Button
              variant={contactMethod === "call" ? "default" : "outline"}
              className={`flex flex-col items-center py-3 ${
                contactMethod === "call" ? "bg-[#FFD166] text-[#121315]" : "border-[#2D2F32] text-[#A0A3A7]"
              }`}
              onClick={() => setContactMethod("call")}
            >
              <Phone className="mb-1 h-4 w-4" />
              <span className="text-xs">Call</span>
            </Button>
            <Button
              variant={contactMethod === "tour" ? "default" : "outline"}
              className={`flex flex-col items-center py-3 ${
                contactMethod === "tour" ? "bg-[#FFD166] text-[#121315]" : "border-[#2D2F32] text-[#A0A3A7]"
              }`}
              onClick={() => setContactMethod("tour")}
            >
              <Calendar className="mb-1 h-4 w-4" />
              <span className="text-xs">Tour</span>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <Input
              type="text"
              placeholder="Your name"
              className="bg-[#2C2F33] text-[#E9EAEC] focus:border-[#FFD166]"
              required
            />
            <Input
              type="email"
              placeholder="Your email"
              className="bg-[#2C2F33] text-[#E9EAEC] focus:border-[#FFD166]"
              required
            />
            <Input
              type="tel"
              placeholder="Your phone (e.g., 04XX XXX XXX)"
              className="bg-[#2C2F33] text-[#E9EAEC] focus:border-[#FFD166]"
            />

            {contactMethod === "message" && (
              <Textarea
                placeholder={`I'm interested in ${property.title}. Please contact me with more information.`}
                className="h-24 bg-[#2C2F33] text-[#E9EAEC] focus:border-[#FFD166]"
                required
              />
            )}

            {contactMethod === "tour" && (
              <div className="space-y-4">
                <div className="text-sm text-[#A0A3A7]">Preferred tour date and time:</div>
                <div className="grid grid-cols-2 gap-4">
                  <Input type="date" className="bg-[#2C2F33] text-[#E9EAEC] focus:border-[#FFD166]" required />
                  <Input type="time" className="bg-[#2C2F33] text-[#E9EAEC] focus:border-[#FFD166]" required />
                </div>
              </div>
            )}

            <Button type="submit" className="w-full bg-[#FFD166] text-[#121315] hover:bg-[#FFD166]/90">
              {contactMethod === "message"
                ? "Send Message"
                : contactMethod === "call"
                  ? "Request Call"
                  : "Schedule Tour"}
            </Button>
          </form>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 rounded-md bg-[#2D2F32]/50 p-6 text-center"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD166]/20">
            <div className="text-[#FFD166]">
              {contactMethod === "message" ? (
                <MessageSquare className="h-6 w-6" />
              ) : contactMethod === "call" ? (
                <Phone className="h-6 w-6" />
              ) : (
                <Calendar className="h-6 w-6" />
              )}
            </div>
          </div>
          <h4 className="mt-4 text-lg font-medium">Thank You!</h4>
          <p className="mt-2 text-[#A0A3A7]">
            {contactMethod === "message"
              ? "Your message has been sent. Sarah will contact you shortly."
              : contactMethod === "call"
                ? "Sarah will call you soon to discuss this property."
                : "Your tour request has been received. We'll confirm the details soon."}
          </p>
          <Button
            className="mt-6 bg-transparent text-[#FFD166] hover:bg-[#FFD166]/10"
            onClick={() => setFormSubmitted(false)}
          >
            Send Another Request
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
