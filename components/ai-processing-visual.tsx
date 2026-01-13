"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export function AIProcessingVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 300
    canvas.height = 300

    // Particles array
    const particles: {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      opacity: number
    }[] = []

    // Create particles
    for (let i = 0; i < 100; i++) {
      const size = Math.random() * 2 + 0.5
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: i % 5 === 0 ? "#D4C1B3" : "#FFFFFF",
        opacity: Math.random() * 0.5 + 0.1,
      })
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw center circle
      ctx.beginPath()
      ctx.arc(canvas.width / 2, canvas.height / 2, 30, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(212, 193, 179, 0.1)"
      ctx.fill()
      ctx.strokeStyle = "rgba(212, 193, 179, 0.3)"
      ctx.stroke()

      // Draw particles
      particles.forEach((particle) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particle.color === "#D4C1B3" ? "212, 193, 179" : "255, 255, 255"}, ${particle.opacity})`
        ctx.fill()

        // Update particle position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX = -particle.speedX
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY = -particle.speedY
        }

        // Draw lines to center for some particles
        if (Math.random() < 0.1) {
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(canvas.width / 2, canvas.height / 2)
          ctx.strokeStyle = `rgba(${particle.color === "#D4C1B3" ? "212, 193, 179" : "255, 255, 255"}, 0.05)`
          ctx.stroke()
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      // Cleanup if needed
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <canvas ref={canvasRef} className="h-[300px] w-[300px]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-16 w-16 rounded-full border border-[#D4C1B3]/30 border-t-[#D4C1B3] animate-spin"></div>
      </div>
    </motion.div>
  )
}
