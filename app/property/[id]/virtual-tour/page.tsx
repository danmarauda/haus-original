"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Info, RotateCcw, ZoomIn, ZoomOut, Maximize } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VirtualTourScene } from "@/components/virtual-tour-scene"
import { PropertyDetailsOverlay } from "@/components/property-details-overlay"
import { mockProperties } from "@/lib/mock-data"
import Link from "next/link"

interface VirtualTourPageProps {
  params: {
    id: string
  }
}

export default function VirtualTourPage({ params }: VirtualTourPageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)
  const [currentRoom, setCurrentRoom] = useState("living-room")

  // Find the property by ID
  const property = mockProperties.find((p) => p.id === params.id) || mockProperties[0]

  // Enhanced property data with AI predictions
  const enhancedProperty = {
    ...property,
    description:
      "This stunning modern home features an open-plan design with premium finishes throughout. The gourmet kitchen boasts stone countertops and stainless steel appliances, while the master suite includes a walk-in wardrobe and ensuite. The outdoor entertaining area overlooks beautifully landscaped gardens.",
    features: [
      "Stone countertops",
      "Stainless steel appliances",
      "Walk-in wardrobe",
      "Ensuite bathroom",
      "Outdoor entertaining",
      "Landscaped gardens",
      "Double glazed windows",
      "Ducted heating",
      "Split system cooling",
      "Security system",
    ],
    neighborhood: {
      name: "Surry Hills",
      walkScore: 92,
      transitScore: 85,
      bikeScore: 78,
    },
    schools: [
      { name: "Surry Hills Public School", rating: 8.5, distance: "0.3km" },
      { name: "Sydney Secondary College", rating: 9.2, distance: "0.8km" },
      { name: "St Vincent's Primary", rating: 8.8, distance: "0.5km" },
    ],
    marketData: {
      pricePerSqFt: property.price / property.squareFeet,
      daysOnMarket: 14,
      priceHistory: [
        { date: "2024-01-15", price: property.price, event: "Listed", change: 0 },
        { date: "2023-08-20", price: property.price * 0.95, event: "Previous Sale", change: -5 },
        { date: "2022-03-10", price: property.price * 0.88, event: "Previous Sale", change: -7.4 },
        { date: "2020-11-05", price: property.price * 0.82, event: "Previous Sale", change: -6.8 },
        { date: "2019-06-15", price: property.price * 0.75, event: "Original Purchase", change: -8.5 },
      ],
      comparableProperties: [
        { address: "125 Crown St, Surry Hills", price: 1920000, sqft: 185, soldDate: "2024-01-08" },
        { address: "89 Bourke St, Surry Hills", price: 1780000, sqft: 175, soldDate: "2023-12-22" },
        { address: "156 Riley St, Surry Hills", price: 2100000, sqft: 195, soldDate: "2024-01-12" },
        { address: "67 Campbell St, Surry Hills", price: 1650000, sqft: 165, soldDate: "2023-12-18" },
      ],
      marketTrends: {
        averagePriceChange: 8.5,
        medianDaysOnMarket: 18,
        inventoryLevel: "Low",
        priceAppreciation: {
          "1year": 12.3,
          "3year": 28.7,
          "5year": 45.2,
        },
      },
      aiPredictions: {
        confidenceScore: 87,
        methodology: "Machine Learning Model trained on 50,000+ Sydney property transactions",
        lastUpdated: "2024-01-15",
        predictions: {
          "3months": {
            price: property.price * 1.02,
            change: 2.1,
            confidence: 92,
            factors: ["Low inventory", "Interest rate stability", "Infrastructure development"],
          },
          "6months": {
            price: property.price * 1.045,
            change: 4.5,
            confidence: 88,
            factors: ["Metro line completion", "Population growth", "Employment growth"],
          },
          "12months": {
            price: property.price * 1.08,
            change: 8.0,
            confidence: 82,
            factors: ["Economic recovery", "Housing shortage", "Urban development"],
          },
          "24months": {
            price: property.price * 1.15,
            change: 15.2,
            confidence: 75,
            factors: ["Long-term growth trends", "Infrastructure investment", "Demographic shifts"],
          },
        },
        riskFactors: [
          { factor: "Interest Rate Changes", impact: "High", probability: "Medium" },
          { factor: "Economic Downturn", impact: "High", probability: "Low" },
          { factor: "Oversupply", impact: "Medium", probability: "Low" },
          { factor: "Policy Changes", impact: "Medium", probability: "Medium" },
        ],
        marketDrivers: [
          { driver: "Population Growth", impact: "Positive", strength: "Strong" },
          { driver: "Infrastructure Development", impact: "Positive", strength: "Strong" },
          { driver: "Employment Growth", impact: "Positive", strength: "Medium" },
          { driver: "Interest Rates", impact: "Neutral", strength: "Medium" },
        ],
      },
    },
  }

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const rooms = [
    { id: "living-room", name: "Living Room", description: "Spacious open-plan living area" },
    { id: "kitchen", name: "Kitchen", description: "Modern gourmet kitchen" },
    { id: "master-bedroom", name: "Master Bedroom", description: "Luxurious master suite" },
    { id: "bathroom", name: "Bathroom", description: "Designer bathroom with premium fixtures" },
    { id: "outdoor", name: "Outdoor Area", description: "Private entertaining space" },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD166] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Virtual Tour...</p>
          <p className="text-gray-400 text-sm mt-2">Preparing immersive experience</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/property/${params.id}`}>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-white font-bold text-lg">{property.title}</h1>
              <p className="text-gray-300 text-sm">{property.address}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20"
              onClick={() => setShowPropertyDetails(true)}
            >
              <Info className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Maximize className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Virtual Tour Scene */}
      <VirtualTourScene currentRoom={currentRoom} />

      {/* Room Navigation */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          {rooms.map((room) => (
            <Button
              key={room.id}
              variant={currentRoom === room.id ? "default" : "ghost"}
              size="sm"
              className={`text-xs ${
                currentRoom === room.id
                  ? "bg-[#FFD166] text-black hover:bg-[#FFD166]/90"
                  : "text-white hover:bg-white/20"
              }`}
              onClick={() => setCurrentRoom(room.id)}
            >
              {room.name}
            </Button>
          ))}
        </div>

        {/* Current Room Info */}
        <div className="text-center">
          <h3 className="text-white font-semibold">{rooms.find((r) => r.id === currentRoom)?.name}</h3>
          <p className="text-gray-300 text-sm">{rooms.find((r) => r.id === currentRoom)?.description}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-4 mt-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Property Details Overlay */}
      <PropertyDetailsOverlay
        isOpen={showPropertyDetails}
        onClose={() => setShowPropertyDetails(false)}
        property={enhancedProperty}
      />
    </div>
  )
}
