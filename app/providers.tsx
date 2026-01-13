"use client"

import type React from "react"

import { ThemeProvider } from "@/components/theme-provider"
import { VoiceCopilotProvider } from "@/components/voice-copilot/voice-copilot-provider"
import { VoiceCopilotButton } from "@/components/voice-copilot/voice-copilot-button"
import { VoiceCopilotInterface } from "@/components/voice-copilot/voice-copilot-interface"
import { AuthProvider } from "@/hooks/use-auth"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      themes={["dark", "darker", "darkest"]}
      disableTransitionOnChange
    >
      <AuthProvider>
        <VoiceCopilotProvider>
          {children}
          <VoiceCopilotButton />
          <VoiceCopilotInterface />
        </VoiceCopilotProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
