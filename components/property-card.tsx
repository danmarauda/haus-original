import Link from "next/link"
import { Heart, Share2, MapPin, Bed, Bath, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    address: string
    price: number
    bedrooms: number
    bathrooms: number
    squareFeet: number
    images: string[]
    matchScore?: number
  }
  enhanced?: boolean
  compact?: boolean
}

export function PropertyCard({ property, enhanced = false, compact = false }: PropertyCardProps) {
  if (compact) {
    return (
      <Link href={`/property/${property.id}`}>
        <div className="flex overflow-hidden border border-white/5 bg-[rgba(0,0,0,0.2)] transition-all duration-300 hover:border-white/15 hover:translate-y-[-2px]">
          <div className="relative h-24 w-24 flex-shrink-0">
            <img
              src={property.images[0] || "/placeholder.svg?height=96&width=96&query=australian+house+thumbnail"}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-3">
            <div>
              <h3 className="text-sm uppercase tracking-[0.1em] font-light line-clamp-1">{property.title}</h3>
              <div className="mt-1 flex items-center text-xs text-white/60">
                <MapPin className="mr-1 h-3 w-3" />
                <span className="line-clamp-1">{property.address}</span>
              </div>
            </div>
            <div className="mt-2 flex justify-between text-xs">
              <span className="font-light">${property.price.toLocaleString()}</span>
              <div className="flex items-center space-x-2 text-white/60">
                <span>{property.bedrooms} bd</span>
                <span>•</span>
                <span>{property.bathrooms} ba</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Card className={cn("h-full flex flex-col", enhanced && "border-[#D4C1B3]/30")}>
      <Link href={`/property/${property.id}`} className="block relative">
        <div className="aspect-[4/3] w-full overflow-hidden">
          <img
            src={property.images[0] || "/placeholder.svg?height=300&width=400&query=australian+house+exterior"}
            alt={property.title}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Overlay buttons */}
        <div className="absolute right-3 top-3 flex space-x-2">
          <Button variant="icon" size="icon" className="h-8 w-8 bg-black/70 backdrop-blur-sm">
            <Heart className="h-4 w-4" />
          </Button>
          <Button variant="icon" size="icon" className="h-8 w-8 bg-black/70 backdrop-blur-sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Match score badge for enhanced properties */}
        {enhanced && property.matchScore && (
          <div className="absolute left-0 top-3 bg-[#D4C1B3] px-3 py-1 text-xs uppercase tracking-[0.1em] font-light text-black">
            {property.matchScore}% MATCH
          </div>
        )}

        {/* Price tag */}
        <div className="absolute bottom-3 left-0 bg-black/70 px-4 py-1 text-sm uppercase tracking-[0.1em] font-light backdrop-blur-sm">
          ${property.price.toLocaleString()}
        </div>
      </Link>

      <CardContent className="flex-1">
        <h3 className="text-base uppercase tracking-[0.1em] font-light mt-2">{property.title}</h3>

        <div className="mt-2 flex items-center text-sm text-white/60">
          <MapPin className="mr-1 h-3 w-3" />
          <span>{property.address}</span>
        </div>

        <div className="mt-4 flex justify-between">
          <div className="flex items-center text-sm text-white/70">
            <Bed className="mr-1 h-4 w-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center text-sm text-white/70">
            <Bath className="mr-1 h-4 w-4" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center text-sm text-white/70">
            <Square className="mr-1 h-4 w-4" />
            <span>{property.squareFeet.toLocaleString()} sqm</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`/property/${property.id}`} className="w-full">
          <Button variant="text" className="w-full justify-center">
            VIEW DETAILS
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
