"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, useProgress } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube, Loader, Maximize2 } from "lucide-react"
import Link from "next/link"
import type * as THREE from "three"

// Simple room model for the preview
function Room() {
  const mesh = useRef<THREE.Mesh>(null!)
  const { camera } = useThree()

  useEffect(() => {
    // Position camera inside the room
    camera.position.set(0, 1.6, 0)
  }, [camera])

  useFrame(() => {
    if (mesh.current) {
      // Gentle rotation for visual interest
      mesh.current.rotation.y += 0.001
    }
  })

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, -5]} receiveShadow>
        <boxGeometry args={[10, 4, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 2, 5]} receiveShadow>
        <boxGeometry args={[10, 4, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 4, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[10, 4, 0.1]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f5f5f5" />
      </mesh>

      {/* Furniture */}
      <mesh ref={mesh} position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.5, 1, 3]} />
        <meshStandardMaterial color="#D4C1B3" />
      </mesh>

      {/* Windows */}
      <mesh position={[0, 2, -4.95]} receiveShadow>
        <boxGeometry args={[3, 2, 0.1]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.2} />
      </mesh>

      {/* Decorative elements */}
      <mesh position={[-3, 1, -4.5]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[3, 0.3, 3]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.6, 32]} />
        <meshStandardMaterial color="#775544" />
      </mesh>
    </group>
  )
}

// Loading indicator
function LoadingIndicator() {
  const { progress } = useProgress()

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10">
      <Loader className="h-8 w-8 animate-spin mb-4 text-[#D4C1B3]" />
      <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#D4C1B3] transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="mt-2 text-xs uppercase tracking-wider text-white/70">
        Loading 3D Preview ({Math.round(progress)}%)
      </p>
    </div>
  )
}

interface VirtualTourPreviewProps {
  propertyId: string
}

export function VirtualTourPreview({ propertyId }: VirtualTourPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-[300px] md:h-[400px]">
      {isLoading && <LoadingIndicator />}

      <div className="absolute top-4 right-4 z-10 flex space-x-2">
        <Link href={`/property/${propertyId}/virtual-tour`}>
          <Button variant="icon" size="icon" className="h-8 w-8 bg-black/70 backdrop-blur-sm">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="absolute bottom-4 left-4 z-10">
        <div className="bg-black/70 backdrop-blur-sm px-3 py-2 text-xs uppercase tracking-wider">
          <p className="text-white/70">Drag to look around • Scroll to zoom</p>
        </div>
      </div>

      <Canvas shadows>
        <PerspectiveCamera makeDefault fov={75} position={[0, 1.6, 0]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 3, 0]} intensity={0.8} castShadow />
        <Room />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minDistance={1}
          maxDistance={5}
        />
        <Environment preset="apartment" />
      </Canvas>

      <div className="absolute bottom-4 right-4 z-10">
        <Link href={`/property/${propertyId}/virtual-tour`}>
          <Button className="bg-[#D4C1B3] text-black hover:bg-[#C0AEA0] text-xs uppercase tracking-wider">
            <Cube className="h-4 w-4 mr-2" />
            Full 3D Tour
          </Button>
        </Link>
      </div>
    </div>
  )
}
