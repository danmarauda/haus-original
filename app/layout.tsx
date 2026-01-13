import type React from "react"
import "./globals.css"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { MainNav } from "@/components/main-nav"
import { Providers } from "./providers"
import { VoiceCopilotButton } from "@/components/voice-copilot/voice-copilot-button"
import { VoiceCopilotInterface } from "@/components/voice-copilot/voice-copilot-interface"

export const metadata = {
  title: "HAUS' | Premium Real Estate Platform",
  description: "Discover exceptional properties with HAUS', the premium real estate platform.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-minimal-background text-minimal-text-primary font-sans">
        <Providers>
          <MainNav />
          <main className="pt-[73px]">
            {" "}
            {/* Add padding top to account for fixed MainNav height */}
            {children}
          </main>
          <VoiceCopilotButton />
          <VoiceCopilotInterface />
        </Providers>
      </body>
    </html>
  )
}
