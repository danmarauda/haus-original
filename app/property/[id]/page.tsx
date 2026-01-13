"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Sparkles,
  X,
  Menu,
  VideoIcon as Video3d,
  BarChart2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PropertyMap } from "@/components/property-map"
import { PropertyGallery } from "@/components/property-gallery"
import { AIPropertyInsights } from "@/components/ai-property-insights"
import { ContactAgent } from "@/components/contact-agent"
import { PropertyCard } from "@/components/property-card"
import { mockProperties } from "@/lib/mock-data"

export default function PropertyPage() {
  const router = useRouter()
  const { id } = useParams() as { id: string }
  const [property, setProperty] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [similarProperties, setSimilarProperties] = useState<any[]>([])

  useEffect(() => {
    // In a real app, this would be an API call to fetch the property details
    const fetchedProperty = mockProperties.find((p) => p.id === id)

    if (fetchedProperty) {
      setProperty({
        ...fetchedProperty,
        description:
          "This stunning modern lakeside villa offers breathtaking views and luxurious living spaces. Featuring floor-to-ceiling windows that frame the picturesque lake, this property seamlessly blends indoor and outdoor living. The open-concept main floor includes a gourmet kitchen with high-end appliances, a spacious dining area, and a living room with a fireplace. The primary suite boasts a private balcony, walk-in closet, and a spa-like bathroom. Additional features include a home office, media room, and a beautifully landscaped garden with direct lake access.",
        yearBuilt: 2019,
        lotSize: "0.5 acres",
        propertyType: "Single Family Home",
        parkingSpaces: 2,
        heating: "Forced air, Radiant",
        cooling: "Central air",
        appliances: ["Refrigerator", "Dishwasher", "Range/Oven", "Microwave", "Washer", "Dryer"],
        outdoorFeatures: ["Deck", "Patio", "Garden", "Lake access"],
        indoorFeatures: ["Fireplace", "Walk-in closets", "Home office", "Media room"],
        schools: [
          { name: "Lakeview Elementary", rating: 9, distance: "0.8 miles" },
          { name: "Westlake Middle School", rating: 8, distance: "1.2 miles" },
          { name: "Northside High School", rating: 9, distance: "1.5 miles" },
        ],
        neighborhood: {
          name: "Lakeview Heights",
          walkScore: 82,
          transitScore: 75,
          bikeScore: 88,
        },
        latitude: 47.6205,
        longitude: -122.3493,
        images: [
          "/placeholder.jpg",
          "/placeholder-up7ii.png",
          "/placeholder-vkgrs.png",
          "/placeholder-e9t1b.png",
          "/placeholder-lp4w0.png",
        ],
      })

      // Get similar properties (excluding the current one)
      const similar = mockProperties.filter((p) => p.id !== id).slice(0, 3)

      setSimilarProperties(similar)
    }

    setLoading(false)
  }, [id])

  const addToComparison = () => {
    if (!property) return

    // Get current comparison IDs from localStorage or create empty array
    const currentIds = localStorage.getItem("comparisonIds")
      ? JSON.parse(localStorage.getItem("comparisonIds") || "[]")
      : []

    // Add this property if not already in the list
    if (!currentIds.includes(property.id)) {
      const newIds = [...currentIds, property.id]
      localStorage.setItem("comparisonIds", JSON.stringify(newIds))
    }

    // Navigate to comparison page
    router.push(
      `/compare?ids=${currentIds.includes(property.id) ? currentIds.join(",") : [...currentIds, property.id].join(",")}`,
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#121315]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#2D2F32] border-t-[#FFD166]"></div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#121315] px-4 text-center">
        <h1 className="text-2xl font-bold text-[#E9EAEC]">Property Not Found</h1>
        <p className="mt-2 text-[#A0A3A7]">The property you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-6 bg-[#FFD166] text-[#121315]" onClick={() => router.push("/search")}>
          Back to Search
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#121315] text-[#E9EAEC]">
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col bg-[#121315] p-6"
        >
          <div className="flex justify-end">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="text-[#E9EAEC]">
              <X className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center space-y-8 pt-20">
            <Link href="/" className="text-xl hover:text-[#FFD166]">
              Home
            </Link>
            <Link href="/search" className="text-xl hover:text-[#FFD166]">
              Search
            </Link>
            <Link href="#" className="text-xl hover:text-[#FFD166]">
              Saved
            </Link>
            <Link href="#" className="text-xl hover:text-[#FFD166]">
              Account
            </Link>
            <Button className="mt-8 bg-[#FFD166] text-[#121315] hover:bg-[#FFD166]/90">Contact Agent</Button>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-2 w-2 rounded-full bg-[#FFD166]"></div>
          <span className="font-medium tracking-wider">OPENHAUS.AI</span>
        </Link>
        <div className="hidden items-center space-x-8 md:flex">
          <Link href="/" className="text-sm hover:text-[#FFD166]">
            Home
          </Link>
          <Link href="/search" className="text-sm hover:text-[#FFD166]">
            Search
          </Link>
          <Link href="#" className="text-sm hover:text-[#FFD166]">
            Saved
          </Link>
          <Link href="#" className="text-sm hover:text-[#FFD166]">
            Account
          </Link>
          <Button variant="outline" className="rounded-md border-[#FFD166] text-[#FFD166] hover:bg-[#FFD166]/10">
            Contact Agent
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </header>

      <main className="pb-20">
        {/* Back button */}
        <div className="px-6">
          <Button
            variant="ghost"
            className="mb-6 flex items-center space-x-2 text-[#A0A3A7] hover:text-[#E9EAEC]"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to search</span>
          </Button>
        </div>

        {/* Property Gallery */}
        <PropertyGallery images={property.images} />

        {/* Property Header */}
        <div className="mx-auto max-w-7xl px-6">
          <div className="mt-8 flex flex-col justify-between md:flex-row md:items-start">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">{property.title}</h1>
              <div className="mt-2 flex items-center text-[#A0A3A7]">
                <MapPin className="mr-2 h-4 w-4" />
                <span>{property.address}</span>
              </div>
            </div>
            <div className="mt-4 flex space-x-4 md:mt-0">
              <Button
                variant="outline"
                className="flex items-center space-x-2 border-[#2D2F32]"
                onClick={() => setIsFavorite(!isFavorite)}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                <span>{isFavorite ? "Saved" : "Save"}</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2 border-[#2D2F32]">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
              <Button
                variant="outline"
                className="flex items-center space-x-2 border-[#2D2F32]"
                onClick={addToComparison}
              >
                <BarChart2 className="h-4 w-4" />
                <span>Compare</span>
              </Button>
            </div>
          </div>

          {/* Virtual Tour Button */}
          <div className="mt-6">
            <Link href={`/property/${id}/virtual-tour`}>
              <Button className="flex w-full items-center justify-center space-x-2 bg-[#FFD166] text-[#121315] hover:bg-[#FFD166]/90 md:w-auto">
                <Video3d className="h-5 w-5" />
                <span>Explore Virtual Tour</span>
              </Button>
            </Link>
          </div>

          {/* Price and Key Details */}
          <div className="mt-6 flex flex-wrap items-center justify-between rounded-lg border border-[#2D2F32] bg-[#1F2124] p-6">
            <div>
              $<span className="text-3xl font-bold">{property.price.toLocaleString()}</span>
            </div>
            <div className="mt-4 flex space-x-8 md:mt-0">
              <div className="flex items-center">
                <Bed className="mr-2 h-5 w-5 text-[#A0A3A7]" />
                <span>
                  <strong>{property.bedrooms}</strong> Beds
                </span>
              </div>
              <div className="flex items-center">
                <Bath className="mr-2 h-5 w-5 text-[#A0A3A7]" />
                <span>
                  <strong>{property.bathrooms}</strong> Baths
                </span>
              </div>
              <div className="flex items-center">
                <Square className="mr-2 h-5 w-5 text-[#A0A3A7]" />
                <span>
                  <strong>{property.squareFeet.toLocaleString()}</strong> sqm
                </span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {/* Left Column - Property Details */}
            <div className="md:col-span-2">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-4 bg-[#1F2124]">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="location">Location</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0">
                  <div className="rounded-lg border border-[#2D2F32] bg-[#1F2124] p-6">
                    <h2 className="text-xl font-semibold">Property Description</h2>
                    <p className="mt-4 leading-relaxed text-[#A0A3A7]">{property.description}</p>

                    <div className="mt-8">
                      <h3 className="text-lg font-medium">AI-Powered Insights</h3>
                      <AIPropertyInsights property={property} />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  <div className="rounded-lg border border-[#2D2F32] bg-[#1F2124] p-6">
                    <h2 className="text-xl font-semibold">Property Details</h2>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <div>
                        <h3 className="mb-4 font-medium">Basic Information</h3>
                        <ul className="space-y-3 text-[#A0A3A7]">
                          <li className="flex justify-between">
                            <span>Property Type</span>
                            <span className="text-[#E9EAEC]">{property.propertyType}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Year Built</span>
                            <span className="text-[#E9EAEC]">{property.yearBuilt}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Lot Size</span>
                            <span className="text-[#E9EAEC]">{property.lotSize}</span>{" "}
                            {/* Assuming lotSize in mock data is already string with sqm or ha */}
                          </li>
                          <li className="flex justify-between">
                            <span>Parking</span>
                            <span className="text-[#E9EAEC]">{property.parkingSpaces} spaces</span>
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="mb-4 font-medium">Systems</h3>
                        <ul className="space-y-3 text-[#A0A3A7]">
                          <li className="flex justify-between">
                            <span>Heating</span>
                            <span className="text-[#E9EAEC]">{property.heating}</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Cooling</span>
                            <span className="text-[#E9EAEC]">{property.cooling}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-0">
                  <div className="rounded-lg border border-[#2D2F32] bg-[#1F2124] p-6">
                    <h2 className="text-xl font-semibold">Property Features</h2>

                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <div>
                        <h3 className="mb-4 font-medium">Indoor Features</h3>
                        <ul className="space-y-2 text-[#A0A3A7]">
                          {property.indoorFeatures.map((feature: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-[#FFD166]"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <h3 className="mb-4 mt-8 font-medium">Appliances</h3>
                        <ul className="space-y-2 text-[#A0A3A7]">
                          {property.appliances.map((appliance: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-[#FFD166]"></div>
                              {appliance}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="mb-4 font-medium">Outdoor Features</h3>
                        <ul className="space-y-2 text-[#A0A3A7]">
                          {property.outdoorFeatures.map((feature: string, index: number) => (
                            <li key={index} className="flex items-center">
                              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-[#FFD166]"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="location" className="mt-0">
                  <div className="rounded-lg border border-[#2D2F32] bg-[#1F2124] p-6">
                    <h2 className="text-xl font-semibold">Location & Neighborhood</h2>

                    <div className="mt-6">
                      <PropertyMap
                        latitude={property.latitude}
                        longitude={property.longitude}
                        address={property.address}
                      />
                    </div>

                    <div className="mt-8">
                      <h3 className="mb-4 font-medium">Neighborhood: {property.neighborhood.name}</h3>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-md bg-[#2D2F32] p-4 text-center">
                          <div className="text-2xl font-bold text-[#FFD166]">{property.neighborhood.walkScore}</div>
                          <div className="mt-1 text-sm text-[#A0A3A7]">Walk Score</div>
                        </div>
                        <div className="rounded-md bg-[#2D2F32] p-4 text-center">
                          <div className="text-2xl font-bold text-[#FFD166]">{property.neighborhood.transitScore}</div>
                          <div className="mt-1 text-sm text-[#A0A3A7]">Transit Score</div>
                        </div>
                        <div className="rounded-md bg-[#2D2F32] p-4 text-center">
                          <div className="text-2xl font-bold text-[#FFD166]">{property.neighborhood.bikeScore}</div>
                          <div className="mt-1 text-sm text-[#A0A3A7]">Bike Score</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="mb-4 font-medium">Nearby Schools</h3>
                      <div className="space-y-4">
                        {property.schools.map((school: any, index: number) => (
                          <div key={index} className="flex items-center justify-between rounded-md bg-[#2D2F32] p-4">
                            <div>
                              <div className="font-medium">{school.name}</div>
                              <div className="text-sm text-[#A0A3A7]">{school.distance}</div>
                            </div>
                            <div className="rounded-full bg-[#FFD166] px-2 py-1 text-sm font-medium text-[#121315]">
                              {school.rating}/10
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Contact and Similar Properties */}
            <div>
              <ContactAgent property={property} />

              <div className="mt-8">
                <h3 className="mb-6 flex items-center text-xl font-semibold">
                  <Sparkles className="mr-2 h-5 w-5 text-[#FFD166]" />
                  Similar Properties
                </h3>
                <div className="space-y-6">
                  {similarProperties.map((similarProperty) => (
                    <PropertyCard key={similarProperty.id} property={similarProperty} compact={true} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
