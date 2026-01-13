"use client"

import { useState, useEffect, useMemo, useCallback } from "react" // Added useCallback
import { useSearchParams } from "next/navigation"
import { getProperties } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { ConversationProvider } from "@/components/conversation-provider"
import PropertyComparisonTable from "@/components/property-comparison-table"
import ComparisonChat from "@/components/comparison-chat"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"

export default function ComparePage() {
  const searchParams = useSearchParams()
  const [selectedPropertyIds, setSelectedPropertyIds] = useState<string[]>([])
  const { measure } = usePerformanceMonitor("ComparePage")

  // Fetch properties only once
  const allProperties = useMemo(() => getProperties(), [])

  // Get selected properties from URL params
  useEffect(() => {
    const ids = searchParams.get("ids")?.split(",") || []
    setSelectedPropertyIds(ids)
  }, [searchParams])

  // Filter properties based on selected IDs
  const selectedProperties = useMemo(() => {
    return allProperties.filter((property) => selectedPropertyIds.includes(property.id))
  }, [allProperties, selectedPropertyIds])

  // Remove a property from comparison - stabilized with useCallback
  const handleRemoveProperty = useCallback((id: string) => {
    setSelectedPropertyIds((prev) => prev.filter((propId) => propId !== id))
  }, []) // setSelectedPropertyIds is stable

  return (
    <ConversationProvider>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/search" legacyBehavior>
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-widest">Property Comparison</h1>
            <p className="text-muted-foreground">Compare details side by side to make an informed decision</p>
          </div>
        </div>

        {selectedProperties.length === 0 ? (
          <div className="text-center p-12 border rounded-md">
            <h2 className="text-xl font-medium mb-2">No properties selected</h2>
            <p className="text-muted-foreground mb-4">
              Select properties from the search page to compare them side by side
            </p>
            <Link href="/search" legacyBehavior>
              <Button>Go to Search</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PropertyComparisonTable properties={selectedProperties} onRemoveProperty={handleRemoveProperty} />
            </div>
            <div>
              <ComparisonChat />
            </div>
          </div>
        )}
      </div>
    </ConversationProvider>
  )
}
