"use client"
import { useMemo } from "react"
import type { Property } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useConversation } from "@/components/conversation-provider"
import { Check, X, HelpCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { validateProperties, getPropertyValue, formatPropertyValue } from "@/lib/property-validation"

type PropertyComparisonTableProps = {
  properties: Property[]
  onRemoveProperty: (id: string) => void
}

export default function PropertyComparisonTable({ properties, onRemoveProperty }: PropertyComparisonTableProps) {
  const { highlightDifferences, setHighlightDifferences, compareProperties } = useConversation()

  // Validate properties to ensure they have all required fields
  const validatedProperties = useMemo(() => {
    return validateProperties(properties)
  }, [properties])

  // Check if any properties were invalid
  const hasInvalidProperties = validatedProperties.length !== properties.length

  // Memoize the property values for each key to avoid recalculating on every render
  const propertyValues = useMemo(() => {
    const values: Record<string, any[]> = {
      price: [],
      bedrooms: [],
      bathrooms: [],
      squareFeet: [],
      yearBuilt: [],
      propertyType: [],
      "features.kitchen": [],
      "features.flooring": [],
      "features.outdoorSpace": [],
      "systems.heating": [],
      "systems.cooling": [],
      "systems.parking": [],
    }

    // Pre-calculate all values for each property
    validatedProperties.forEach((property) => {
      values.price.push(getPropertyValue(property, "price", 0))
      values.bedrooms.push(getPropertyValue(property, "bedrooms", 0))
      values.bathrooms.push(getPropertyValue(property, "bathrooms", 0))
      values.squareFeet.push(getPropertyValue(property, "squareFeet", 0))
      values.yearBuilt.push(getPropertyValue(property, "yearBuilt", 0))
      values.propertyType.push(getPropertyValue(property, "propertyType", ""))
      values["features.kitchen"].push(getPropertyValue(property, "features.kitchen", ""))
      values["features.flooring"].push(getPropertyValue(property, "features.flooring", ""))
      values["features.outdoorSpace"].push(getPropertyValue(property, "features.outdoorSpace", ""))
      values["systems.heating"].push(getPropertyValue(property, "systems.heating", ""))
      values["systems.cooling"].push(getPropertyValue(property, "systems.cooling", ""))
      values["systems.parking"].push(getPropertyValue(property, "systems.parking", ""))
    })

    return values
  }, [validatedProperties])

  // Memoize the better values calculation to avoid recalculating on every render
  const betterValues = useMemo(() => {
    if (!highlightDifferences) return {}

    const better: Record<string, any> = {}

    // Calculate better values for each key
    Object.entries(propertyValues).forEach(([key, values]) => {
      // Skip if any value is undefined, null, or not a number for numeric comparisons
      if (key === "price" || key === "bedrooms" || key === "bathrooms" || key === "squareFeet") {
        if (values.some((v) => typeof v !== "number")) return

        if (key === "price") {
          // For price, lower is better
          const minValue = Math.min(...(values as number[]))
          better[key] = minValue
        } else {
          // For bedrooms, bathrooms, squareFeet, higher is better
          const maxValue = Math.max(...(values as number[]))
          better[key] = maxValue
        }
      }
    })

    return better
  }, [propertyValues, highlightDifferences])

  // Trigger AI comparison
  const handleCompareWithAI = () => {
    compareProperties(validatedProperties.map((p) => p.id))
  }

  if (validatedProperties.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">No properties selected for comparison.</p>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Switch id="highlight-differences" checked={highlightDifferences} onCheckedChange={setHighlightDifferences} />
          <label htmlFor="highlight-differences" className="text-sm">
            Highlight differences
          </label>
        </div>
        <Button onClick={handleCompareWithAI} variant="outline" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          Analyze with AI
        </Button>
      </div>

      {hasInvalidProperties && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          <p className="text-sm">
            Some properties had missing or invalid data. Default values have been used where necessary.
          </p>
        </div>
      )}

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left p-3 bg-muted/50 sticky left-0 min-w-[180px]">Property</th>
            {validatedProperties.map((property) => (
              <th key={property.id} className="p-3 min-w-[250px]">
                <div className="flex flex-col items-center">
                  <div className="relative w-full h-40 mb-2 bg-muted">
                    <img
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => onRemoveProperty(property.id)}
                      className="absolute top-2 right-2 bg-background/80 p-1 rounded-full"
                      aria-label="Remove property"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <Link href={`/property/${property.id}`} className="text-sm font-medium hover:underline">
                    {property.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {getPropertyValue(property, "location.address", "Address not available")}
                  </p>
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* Basic Information */}
          <tr className="bg-muted/30">
            <td colSpan={validatedProperties.length + 1} className="p-3 font-medium sticky left-0 bg-muted/30">
              Basic Information
            </td>
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Price</td>
            {validatedProperties.map((property) => {
              const price = getPropertyValue(property, "price", 0)
              const isBetter = betterValues.price === price

              return (
                <td
                  key={`${property.id}-price`}
                  className={cn("p-3 border-b text-center", isBetter && "text-green-600 font-medium")}
                >
                  {formatPropertyValue(price, "price")}
                  {isBetter && <Check className="inline h-4 w-4 ml-1" />}
                </td>
              )
            })}
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Bedrooms</td>
            {validatedProperties.map((property) => {
              const bedrooms = getPropertyValue(property, "bedrooms", 0)
              const isBetter = betterValues.bedrooms === bedrooms

              return (
                <td
                  key={`${property.id}-bedrooms`}
                  className={cn("p-3 border-b text-center", isBetter && "text-green-600 font-medium")}
                >
                  {formatPropertyValue(bedrooms, "count")}
                  {isBetter && <Check className="inline h-4 w-4 ml-1" />}
                </td>
              )
            })}
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Bathrooms</td>
            {validatedProperties.map((property) => {
              const bathrooms = getPropertyValue(property, "bathrooms", 0)
              const isBetter = betterValues.bathrooms === bathrooms

              return (
                <td
                  key={`${property.id}-bathrooms`}
                  className={cn("p-3 border-b text-center", isBetter && "text-green-600 font-medium")}
                >
                  {formatPropertyValue(bathrooms, "count")}
                  {isBetter && <Check className="inline h-4 w-4 ml-1" />}
                </td>
              )
            })}
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Square Footage</td>
            {validatedProperties.map((property) => {
              const squareFeet = getPropertyValue(property, "squareFeet", 0)
              const isBetter = betterValues.squareFeet === squareFeet

              return (
                <td
                  key={`${property.id}-sqft`}
                  className={cn("p-3 border-b text-center", isBetter && "text-green-600 font-medium")}
                >
                  {formatPropertyValue(squareFeet, "area")}
                  {isBetter && <Check className="inline h-4 w-4 ml-1" />}
                </td>
              )
            })}
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Year Built</td>
            {validatedProperties.map((property) => (
              <td key={`${property.id}-year`} className="p-3 border-b text-center">
                {formatPropertyValue(getPropertyValue(property, "yearBuilt", null), "text")}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Property Type</td>
            {validatedProperties.map((property) => (
              <td key={`${property.id}-type`} className="p-3 border-b text-center">
                {formatPropertyValue(getPropertyValue(property, "propertyType", null), "text")}
              </td>
            ))}
          </tr>

          {/* Features */}
          <tr className="bg-muted/30">
            <td colSpan={validatedProperties.length + 1} className="p-3 font-medium sticky left-0 bg-muted/30">
              Features
            </td>
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Kitchen</td>
            {validatedProperties.map((property) => (
              <td key={`${property.id}-kitchen`} className="p-3 border-b text-center">
                {formatPropertyValue(getPropertyValue(property, "features.kitchen", "Standard"), "text")}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Flooring</td>
            {validatedProperties.map((property) => (
              <td key={`${property.id}-flooring`} className="p-3 border-b text-center">
                {formatPropertyValue(getPropertyValue(property, "features.flooring", "Standard"), "text")}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Outdoor Space</td>
            {validatedProperties.map((property) => (
              <td key={`${property.id}-outdoor`} className="p-3 border-b text-center">
                {formatPropertyValue(getPropertyValue(property, "features.outdoorSpace", "None"), "text")}
              </td>
            ))}
          </tr>

          {/* Systems */}
          <tr className="bg-muted/30">
            <td colSpan={validatedProperties.length + 1} className="p-3 font-medium sticky left-0 bg-muted/30">
              Systems
            </td>
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Heating</td>
            {validatedProperties.map((property) => (
              <td key={`${property.id}-heating`} className="p-3 border-b text-center">
                {formatPropertyValue(getPropertyValue(property, "systems.heating", "Not specified"), "text")}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Cooling</td>
            {validatedProperties.map((property) => (
              <td key={`${property.id}-cooling`} className="p-3 border-b text-center">
                {formatPropertyValue(getPropertyValue(property, "systems.cooling", "Not specified"), "text")}
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 border-b sticky left-0 bg-background">Parking</td>
            {validatedProperties.map((property) => (
              <td key={`${property.id}-parking`} className="p-3 border-b text-center">
                {formatPropertyValue(getPropertyValue(property, "systems.parking", "Not specified"), "text")}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
