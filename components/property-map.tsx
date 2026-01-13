"use client"

import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

interface PropertyMapProps {
  latitude: number
  longitude: number
  address: string
}

export function PropertyMap({ latitude, longitude, address }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mapRef.current) return

    // In a real application, this would use a mapping API like Google Maps or Mapbox
    // For this demo, we'll create a stylized placeholder map
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = mapRef.current.clientWidth
    canvas.height = 300

    // Draw dark styled map background
    ctx.fillStyle = "#1A1C1E"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines for "streets"
    ctx.strokeStyle = "#2D2F32"
    ctx.lineWidth = 1

    // Horizontal streets
    for (let y = 20; y < canvas.height; y += 40) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Vertical streets
    for (let x = 20; x < canvas.width; x += 40) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    // Draw some "blocks" in slightly different colors
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const width = Math.random() * 80 + 40
      const height = Math.random() * 80 + 40

      ctx.fillStyle = i % 3 === 0 ? "#232527" : "#1D1F21"
      ctx.fillRect(x, y, width, height)
    }

    // Draw "water" feature
    ctx.fillStyle = "#1E2A38"
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.7, canvas.height * 0.6, 100, 70, 0, 0, Math.PI * 2)
    ctx.fill()

    // Draw "park" feature
    ctx.fillStyle = "#1E2E1E"
    ctx.beginPath()
    ctx.ellipse(canvas.width * 0.3, canvas.height * 0.3, 60, 40, 0, 0, Math.PI * 2)
    ctx.fill()

    // Draw property location marker
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Pulsing circle
    ctx.fillStyle = "rgba(255, 209, 102, 0.2)"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "rgba(255, 209, 102, 0.4)"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "#FFD166"
    ctx.beginPath()
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
    ctx.fill()

    // Add the canvas to the map container
    mapRef.current.innerHTML = ""
    mapRef.current.appendChild(canvas)

    // Add location marker overlay
    const marker = document.createElement("div")
    marker.className = "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#FFD166]"
    marker.innerHTML = `
      <div class="flex flex-col items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <div class="mt-1 rounded-md bg-[#121315]/80 px-2 py-1 text-xs text-white backdrop-blur-sm">Property Location</div>
      </div>
    `
    mapRef.current.appendChild(marker)
  }, [latitude, longitude])

  return (
    <div className="rounded-lg border border-[#2D2F32] bg-[#1F2124] p-4">
      <div className="relative h-[300px] w-full overflow-hidden rounded-lg" ref={mapRef}>
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2D2F32] border-t-[#FFD166]"></div>
        </div>
      </div>
      <div className="mt-4 flex items-center text-[#A0A3A7]">
        <MapPin className="mr-2 h-4 w-4" />
        <span>{address}</span>
      </div>
    </div>
  )
}
