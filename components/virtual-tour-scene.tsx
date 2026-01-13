"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Sphere } from "@react-three/drei"
import { TextureLoader } from "three"
import * as THREE from "three"

interface VirtualTourSceneProps {
  currentRoom: string
}

function Room360({ currentRoom }: { currentRoom: string }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Room texture mapping - using placeholder images
  const roomTextures = {
    "living-room": "/placeholder-up7ii.png",
    kitchen: "/placeholder-vkgrs.png",
    "master-bedroom": "/placeholder-e9t1b.png",
    bathroom: "/placeholder-lp4w0.png",
    outdoor: "/placeholder.jpg",
  }

  const texture = useLoader(TextureLoader, roomTextures[currentRoom as keyof typeof roomTextures])

  useEffect(() => {
    if (texture) {
      texture.wrapS = THREE.RepeatWrapping
      texture.repeat.x = -1
      texture.flipY = false
    }
  }, [texture])

  useFrame((state) => {
    if (meshRef.current && !isTransitioning) {
      // Subtle auto-rotation
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <Sphere ref={meshRef} args={[500, 60, 40]} scale={[-1, 1, 1]}>
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </Sphere>
  )
}

function InfoPoint({
  position,
  title,
  description,
  onClick,
}: {
  position: [number, number, number]
  title: string
  description: string
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime
      meshRef.current.scale.setScalar(hovered ? 1.2 : 1)
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[2, 16, 16]} />
      <meshBasicMaterial color={hovered ? "#FFD166" : "#ffffff"} transparent opacity={0.8} />
    </mesh>
  )
}

export function VirtualTourScene({ currentRoom }: VirtualTourSceneProps) {
  const [selectedInfo, setSelectedInfo] = useState<string | null>(null)

  // Info points for each room
  const infoPoints = {
    "living-room": [
      {
        position: [100, 0, -100] as [number, number, number],
        title: "Entertainment Center",
        description: "Built-in entertainment unit with surround sound",
      },
      {
        position: [-80, -20, 120] as [number, number, number],
        title: "Dining Area",
        description: "Open dining space with city views",
      },
      {
        position: [0, 50, -150] as [number, number, number],
        title: "Lighting",
        description: "Designer pendant lighting and natural light",
      },
    ],
    kitchen: [
      {
        position: [120, -10, 80] as [number, number, number],
        title: "Island Bench",
        description: "Waterfall stone island with breakfast bar",
      },
      {
        position: [-100, 0, -80] as [number, number, number],
        title: "Appliances",
        description: "Premium stainless steel appliances",
      },
      {
        position: [0, -30, 140] as [number, number, number],
        title: "Storage",
        description: "Ample storage with soft-close drawers",
      },
    ],
    "master-bedroom": [
      {
        position: [80, 0, 120] as [number, number, number],
        title: "Walk-in Wardrobe",
        description: "Spacious walk-in robe with built-in storage",
      },
      {
        position: [-120, 20, -60] as [number, number, number],
        title: "Ensuite Access",
        description: "Direct access to luxury ensuite",
      },
      {
        position: [0, 40, -130] as [number, number, number],
        title: "Windows",
        description: "Floor-to-ceiling windows with garden views",
      },
    ],
    bathroom: [
      {
        position: [90, -20, 100] as [number, number, number],
        title: "Soaking Tub",
        description: "Freestanding soaking tub with city views",
      },
      {
        position: [-110, 0, -70] as [number, number, number],
        title: "Walk-in Shower",
        description: "Frameless glass shower with rainfall head",
      },
      {
        position: [0, -40, 130] as [number, number, number],
        title: "Vanity",
        description: "Double vanity with stone countertops",
      },
    ],
    outdoor: [
      {
        position: [100, -30, 90] as [number, number, number],
        title: "Outdoor Kitchen",
        description: "Built-in BBQ and outdoor kitchen area",
      },
      {
        position: [-90, 0, -110] as [number, number, number],
        title: "Garden",
        description: "Landscaped garden with native plants",
      },
      {
        position: [0, 20, 140] as [number, number, number],
        title: "Pergola",
        description: "Covered entertaining area with outdoor dining",
      },
    ],
  }

  const currentInfoPoints = infoPoints[currentRoom as keyof typeof infoPoints] || []

  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }} gl={{ antialias: true, alpha: false }}>
        <Room360 currentRoom={currentRoom} />

        {/* Info Points */}
        {currentInfoPoints.map((point, index) => (
          <InfoPoint
            key={`${currentRoom}-${index}`}
            position={point.position}
            title={point.title}
            description={point.description}
            onClick={() => setSelectedInfo(point.title)}
          />
        ))}

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={0.1}
          maxDistance={10}
          rotateSpeed={-0.5}
          zoomSpeed={0.5}
          dampingFactor={0.05}
          enableDamping={true}
        />
      </Canvas>

      {/* Info Point Details */}
      {selectedInfo && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white p-4 rounded-lg max-w-sm z-30">
          <h3 className="font-bold mb-2">{selectedInfo}</h3>
          <p className="text-sm text-gray-300">
            {currentInfoPoints.find((p) => p.title === selectedInfo)?.description}
          </p>
          <button onClick={() => setSelectedInfo(null)} className="mt-3 text-[#FFD166] text-sm hover:underline">
            Close
          </button>
        </div>
      )}

      {/* Navigation Instructions */}
      <div className="absolute top-20 left-4 bg-black/60 text-white p-3 rounded-lg text-sm max-w-xs z-20">
        <p className="font-semibold mb-1">Navigation:</p>
        <p>• Drag to look around</p>
        <p>• Scroll to zoom in/out</p>
        <p>• Click yellow dots for info</p>
      </div>
    </div>
  )
}
