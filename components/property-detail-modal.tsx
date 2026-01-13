"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Info,
  Home,
  Maximize2,
  CuboidIcon as Cube,
} from "lucide-react"
import Link from "next/link"
import { VirtualTourPreview } from "@/components/virtual-tour-preview"

interface PropertyDetailModalProps {
  property: {
    id: string
    title: string
    address: string
    price: number
    bedrooms: number
    bathrooms: number
    squareFeet: number
    description?: string
    yearBuilt?: number
    lotSize?: string
    parkingSpaces?: number
    propertyType?: string
    images: string[]
    tags?: string[]
    features?: string[]
    matchScore?: number
  }
  isOpen: boolean
  onClose: () => void
}

export function PropertyDetailModal({ property, isOpen, onClose }: PropertyDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 bg-[#0A0A0A] border-white/10 text-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 h-full">
          {/* Image Gallery or 3D Tour */}
          <div className="relative h-[300px] md:h-full">
            {activeTab !== "3d-tour" ? (
              <>
                <div className="absolute inset-0">
                  <img
                    src={
                      property.images[activeImageIndex] || "/placeholder.svg?height=600&width=800&query=luxury+property"
                    }
                    alt={`${property.title} - Image ${activeImageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Image Navigation */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {property.images.slice(0, 5).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === activeImageIndex ? "bg-white scale-125" : "bg-white/30"
                      }`}
                      aria-label={`View image ${index + 1}`}
                    />
                  ))}
                </div>

                {/* Overlay buttons */}
                <div className="absolute right-4 top-4 flex space-x-2">
                  <Button variant="icon" size="icon" className="h-8 w-8 bg-black/70 backdrop-blur-sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="icon" size="icon" className="h-8 w-8 bg-black/70 backdrop-blur-sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Match score badge */}
                {property.matchScore && (
                  <div className="absolute left-0 top-4 bg-[#D4C1B3] px-3 py-1 text-xs uppercase tracking-[0.1em] font-light text-black">
                    {property.matchScore}% MATCH
                  </div>
                )}

                {/* Price tag */}
                <div className="absolute bottom-12 left-0 bg-black/70 px-4 py-1 text-sm uppercase tracking-[0.1em] font-light backdrop-blur-sm">
                  {formatPrice(property.price)}
                </div>

                {/* 3D Tour Button */}
                <Button
                  className="absolute bottom-4 right-4 bg-[#D4C1B3] text-black hover:bg-[#C0AEA0] text-xs uppercase tracking-wider"
                  onClick={() => setActiveTab("3d-tour")}
                >
                  <Cube className="h-4 w-4 mr-2" />
                  Preview 3D Tour
                </Button>
              </>
            ) : (
              <VirtualTourPreview propertyId={property.id} />
            )}
          </div>

          {/* Property Details */}
          <div className="p-6 overflow-y-auto max-h-[80vh] md:max-h-[600px]">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl uppercase tracking-widest font-light">{property.title}</DialogTitle>
              <DialogDescription className="flex items-center text-white/70">
                <MapPin className="h-3 w-3 mr-1" />
                {property.address}
              </DialogDescription>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full mb-4 bg-black/30">
                <TabsTrigger value="overview" className="flex-1 uppercase text-xs tracking-wider">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="features" className="flex-1 uppercase text-xs tracking-wider">
                  Features
                </TabsTrigger>
                <TabsTrigger value="details" className="flex-1 uppercase text-xs tracking-wider">
                  Details
                </TabsTrigger>
                <TabsTrigger value="3d-tour" className="flex-1 uppercase text-xs tracking-wider">
                  3D Tour
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center border border-white/10 p-3">
                    <Bed className="h-5 w-5 mb-2 text-[#D4C1B3]" />
                    <p className="text-sm text-white/70">{property.bedrooms} Beds</p>
                  </div>
                  <div className="flex flex-col items-center border border-white/10 p-3">
                    <Bath className="h-5 w-5 mb-2 text-[#D4C1B3]" />
                    <p className="text-sm text-white/70">{property.bathrooms} Baths</p>
                  </div>
                  <div className="flex flex-col items-center border border-white/10 p-3">
                    <Square className="h-5 w-5 mb-2 text-[#D4C1B3]" />
                    <p className="text-sm text-white/70">{property.squareFeet} Sq Ft</p>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-white/70 text-sm">
                    {property.description ||
                      "This exceptional property offers a perfect blend of luxury and comfort. Featuring modern design elements, premium finishes, and thoughtfully designed spaces, this home provides an unparalleled living experience in a prime location."}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm uppercase tracking-wider mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {(property.tags || ["Luxury", "Modern", "Smart Home", "Energy Efficient"]).map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-white/20 text-white/70">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(
                    property.features || [
                      "Floor-to-ceiling windows",
                      "Custom Italian kitchen",
                      "Heated floors",
                      "Smart home system",
                      "Wine cellar",
                      "Home theater",
                      "Outdoor kitchen",
                      "Infinity pool",
                      "EV charging station",
                      "Solar panels",
                    ]
                  ).map((feature, index) => (
                    <div key={index} className="flex items-center py-2">
                      <div className="h-1 w-1 bg-[#D4C1B3] mr-2"></div>
                      <span className="text-sm text-white/70">{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Home className="h-4 w-4 text-[#D4C1B3]" />
                      <div>
                        <p className="text-xs text-white/50 uppercase">Property Type</p>
                        <p className="text-sm">{property.propertyType || "Single Family"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-[#D4C1B3]" />
                      <div>
                        <p className="text-xs text-white/50 uppercase">Year Built</p>
                        <p className="text-sm">{property.yearBuilt || "2022"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Maximize2 className="h-4 w-4 text-[#D4C1B3]" />
                      <div>
                        <p className="text-xs text-white/50 uppercase">Lot Size</p>
                        <p className="text-sm">{property.lotSize || "0.25 acres"}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-[#D4C1B3]" />
                      <div>
                        <p className="text-xs text-white/50 uppercase">Parking</p>
                        <p className="text-sm">{property.parkingSpaces || "2"} spaces</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="3d-tour" className="mt-0">
                <div className="md:hidden">
                  <VirtualTourPreview propertyId={property.id} />
                </div>

                <div className="mt-6">
                  <h4 className="text-sm uppercase tracking-wider mb-2">About This 3D Tour</h4>
                  <p className="text-white/70 text-sm mb-4">
                    Experience this property in immersive 3D. Navigate through rooms, explore details, and get a
                    realistic sense of the space before visiting in person.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="border border-white/10 p-4">
                      <h5 className="text-xs uppercase tracking-wider mb-2 text-[#D4C1B3]">Tour Features</h5>
                      <ul className="space-y-2">
                        <li className="text-sm text-white/70 flex items-center">
                          <div className="h-1 w-1 bg-[#D4C1B3] mr-2"></div>
                          360° room views
                        </li>
                        <li className="text-sm text-white/70 flex items-center">
                          <div className="h-1 w-1 bg-[#D4C1B3] mr-2"></div>
                          Interactive floor plan
                        </li>
                        <li className="text-sm text-white/70 flex items-center">
                          <div className="h-1 w-1 bg-[#D4C1B3] mr-2"></div>
                          Measurement tools
                        </li>
                      </ul>
                    </div>

                    <div className="border border-white/10 p-4">
                      <h5 className="text-xs uppercase tracking-wider mb-2 text-[#D4C1B3]">Full Tour Benefits</h5>
                      <ul className="space-y-2">
                        <li className="text-sm text-white/70 flex items-center">
                          <div className="h-1 w-1 bg-[#D4C1B3] mr-2"></div>
                          Furniture placement
                        </li>
                        <li className="text-sm text-white/70 flex items-center">
                          <div className="h-1 w-1 bg-[#D4C1B3] mr-2"></div>
                          Day/night lighting
                        </li>
                        <li className="text-sm text-white/70 flex items-center">
                          <div className="h-1 w-1 bg-[#D4C1B3] mr-2"></div>
                          VR compatibility
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Link href={`/property/${property.id}/virtual-tour`} className="w-full">
                  <Button className="w-full bg-[#D4C1B3] text-black hover:bg-[#C0AEA0]">
                    <Cube className="h-4 w-4 mr-2" />
                    EXPLORE FULL 3D TOUR
                  </Button>
                </Link>
              </TabsContent>
            </Tabs>

            {activeTab !== "3d-tour" && (
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href={`/property/${property.id}`} className="flex-1">
                  <Button className="w-full" variant="default">
                    VIEW FULL DETAILS
                  </Button>
                </Link>
                <Button variant="outline" className="border-white/20 hover:border-white/60">
                  SCHEDULE VIEWING
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
