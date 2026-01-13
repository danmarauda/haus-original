"use client"

import { useVoiceCopilot } from "./voice-copilot-provider"
import { Mic } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function VoiceCopilotButton() {
  const { toggleCopilot, voiceState, isStreaming } = useVoiceCopilot()

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-40"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
    >
      <Button
        onClick={toggleCopilot}
        disabled={voiceState === "processing" || isStreaming}
        className="h-14 w-14 rounded-full bg-[#D4C1B3] p-0 text-black shadow-lg hover:bg-[#D4C1B3]/90"
      >
        <Mic className="h-6 w-6" />
        {(voiceState === "listening" || voiceState === "speaking") && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#D4C1B3]"
            initial={{ scale: 1 }}
            animate={{ scale: 1.4, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
          />
        )}
      </Button>
    </motion.div>
  )
}
