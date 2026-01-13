"use client"

import { useState, useEffect } from "react"
import { PerformanceDashboard } from "@/components/performance-dashboard"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"

// Demo component with artificial performance issues
function SlowComponent() {
  const { measure } = usePerformanceMonitor("SlowComponent")
  const [count, setCount] = useState(0)

  // Artificially slow function
  const slowCalculation = measure(() => {
    const start = performance.now()
    while (performance.now() - start < 50) {
      // Busy wait to simulate CPU-intensive work
    }
    return count * 2
  }, "slowCalculation")

  // Even slower function
  const verySlowCalculation = measure(() => {
    const start = performance.now()
    while (performance.now() - start < 150) {
      // Busy wait to simulate CPU-intensive work
    }
    return count * 3
  }, "verySlowCalculation")

  // Calculate values
  const doubleCount = slowCalculation()
  const tripleCount = verySlowCalculation()

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">Demo Component (Artificially Slow)</h3>
      <p className="mb-2">Count: {count}</p>
      <p className="mb-2">Double Count: {doubleCount}</p>
      <p className="mb-4">Triple Count: {tripleCount}</p>
      <Button onClick={() => setCount((c) => c + 1)}>Increment</Button>
    </div>
  )
}

// Optimized version of the slow component
function OptimizedComponent() {
  const { measure } = usePerformanceMonitor("OptimizedComponent")
  const [count, setCount] = useState(0)

  // Memoized calculation
  const doubleCount = measure(() => {
    return count * 2
  }, "optimizedCalculation")

  // Another calculation with useMemo
  const tripleCount = measure(() => {
    return count * 3
  }, "anotherOptimizedCalculation")

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">Optimized Component</h3>
      <p className="mb-2">Count: {count}</p>
      <p className="mb-2">Double Count: {doubleCount}</p>
      <p className="mb-4">Triple Count: {tripleCount}</p>
      <Button onClick={() => setCount((c) => c + 1)}>Increment</Button>
    </div>
  )
}

export default function PerformancePage() {
  const { toggleMonitoring, isEnabled } = usePerformanceMonitor("PerformancePage")
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    // Enable monitoring by default
    toggleMonitoring(true)
  }, [toggleMonitoring])

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-widest mb-2">Performance Monitoring</h1>
        <p className="text-muted-foreground">Monitor application performance and identify bottlenecks</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="demo">Demo Components</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <PerformanceDashboard />
        </TabsContent>

        <TabsContent value="demo" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <SlowComponent />
            <OptimizedComponent />
          </div>

          <div className="mt-8 p-4 bg-muted rounded-md">
            <h3 className="font-medium mb-2">How to Use Performance Monitoring</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                Import the <code className="bg-muted-foreground/20 px-1 rounded">usePerformanceMonitor</code> hook in
                your component
              </li>
              <li>
                Use the <code className="bg-muted-foreground/20 px-1 rounded">measure</code> function to wrap expensive
                operations
              </li>
              <li>Check the Performance Dashboard to identify bottlenecks</li>
              <li>Optimize components with high render times or slow operations</li>
            </ol>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
