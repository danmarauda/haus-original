"use client"

import { useState, useEffect, useCallback } from "react" // Added useCallback
import { getMetrics, getPerformanceSummary, clearMetrics, togglePerformanceMonitoring } from "@/lib/performance"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Download, RefreshCw, AlertTriangle } from "lucide-react"

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [summary, setSummary] = useState<any>({})
  const [isMonitoring, setIsMonitoring] = useState(true) // Initialize directly
  const [activeTab, setActiveTab] = useState("summary")
  // const [refreshInterval, setRefreshInterval] = useState<number | null>(null) // Removed

  // Performance thresholds (in ms)
  const SLOW_THRESHOLD = 100
  const WARNING_THRESHOLD = 50

  // Refresh metrics - made stable with useCallback
  const refreshMetrics = useCallback(() => {
    setMetrics(getMetrics())
    setSummary(getPerformanceSummary())
  }, []) // Assuming getMetrics/getPerformanceSummary are stable or have no relevant dependencies

  // Toggle monitoring - simplified and made stable
  const handleToggleMonitoring = useCallback((enabled: boolean) => {
    setIsMonitoring(enabled)
    togglePerformanceMonitoring(enabled) // Assuming this is a stable import
  }, []) // setIsMonitoring is stable, togglePerformanceMonitoring is stable

  // Clear metrics
  const handleClearMetrics = () => {
    clearMetrics()
    refreshMetrics()
  }

  // Download metrics as JSON
  const handleDownloadMetrics = () => {
    const data = JSON.stringify({ metrics, summary }, null, 2)
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `performance-metrics-${new Date().toISOString()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Effect to manage the interval based on isMonitoring state
  useEffect(() => {
    if (!isMonitoring) {
      return // Do nothing if monitoring is off
    }

    // Monitoring is on, set up the interval
    refreshMetrics() // Call once immediately when monitoring starts/resumes
    const intervalId = window.setInterval(refreshMetrics, 2000)

    // Cleanup function to clear the interval
    return () => {
      window.clearInterval(intervalId)
    }
  }, [isMonitoring, refreshMetrics]) // Dependencies: re-run if isMonitoring or refreshMetrics changes

  // Prepare chart data (remains the same)
  const chartData = Object.entries(summary).map(([name, data]: [string, any]) => ({
    name: name.length > 15 ? name.substring(0, 15) + "..." : name,
    fullName: name,
    avgDuration: Number.parseFloat(data.avgDuration.toFixed(2)),
    maxDuration: Number.parseFloat(data.maxDuration.toFixed(2)),
    count: data.count,
  }))

  // Filter slow operations (remains the same)
  const slowOperations = Object.entries(summary)
    .filter(([_, data]: [string, any]) => data.avgDuration > WARNING_THRESHOLD)
    .sort((a, b) => (b[1] as any).avgDuration - (a[1] as any).avgDuration)
    .map(([name, data]: [string, any]) => ({
      name,
      avgDuration: Number.parseFloat(data.avgDuration.toFixed(2)),
      maxDuration: Number.parseFloat(data.maxDuration.toFixed(2)),
      count: data.count,
      isCritical: data.avgDuration > SLOW_THRESHOLD,
    }))

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Performance Dashboard</CardTitle>
            <CardDescription>Monitor application performance metrics</CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch id="monitoring" checked={isMonitoring} onCheckedChange={handleToggleMonitoring} />
              <label htmlFor="monitoring" className="text-sm">
                {isMonitoring ? "Monitoring Active" : "Monitoring Paused"}
              </label>
            </div>
            <Button variant="outline" size="sm" onClick={refreshMetrics}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-6">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="warnings" className="relative">
              Warnings
              {slowOperations.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {slowOperations.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-6">
          <TabsContent value="summary" className="mt-0">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metrics.length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Unique Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{Object.keys(summary).length}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Slow Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-500">
                      {slowOperations.filter((op) => !op.isCritical).length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Critical Operations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-500">
                      {slowOperations.filter((op) => op.isCritical).length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium">Top Operations by Duration</h3>
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Operation</th>
                        <th className="p-2 text-left font-medium">Count</th>
                        <th className="p-2 text-left font-medium">Avg Duration (ms)</th>
                        <th className="p-2 text-left font-medium">Max Duration (ms)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(summary)
                        .sort((a, b) => (b[1] as any).avgDuration - (a[1] as any).avgDuration)
                        .slice(0, 10)
                        .map(([name, data]: [string, any], index) => (
                          <tr key={index} className="border-b">
                            <td className="p-2">{name}</td>
                            <td className="p-2">{data.count}</td>
                            <td className="p-2">
                              <span
                                className={
                                  data.avgDuration > SLOW_THRESHOLD
                                    ? "text-red-500 font-medium"
                                    : data.avgDuration > WARNING_THRESHOLD
                                      ? "text-amber-500 font-medium"
                                      : ""
                                }
                              >
                                {data.avgDuration.toFixed(2)}
                              </span>
                            </td>
                            <td className="p-2">{data.maxDuration.toFixed(2)}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="chart" className="mt-0">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                  <YAxis label={{ value: "Duration (ms)", angle: -90, position: "insideLeft" }} />
                  <Tooltip
                    formatter={(value: any) => [`${value} ms`, ""]}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        return payload[0].payload.fullName
                      }
                      return label
                    }}
                  />
                  <Bar dataKey="avgDuration" fill="#8884d8" name="Avg Duration" />
                  <Bar dataKey="maxDuration" fill="#82ca9d" name="Max Duration" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="warnings" className="mt-0">
            {slowOperations.length > 0 ? (
              <div className="space-y-4">
                <div className="rounded-md border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Operation</th>
                        <th className="p-2 text-left font-medium">Count</th>
                        <th className="p-2 text-left font-medium">Avg Duration (ms)</th>
                        <th className="p-2 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slowOperations.map((op, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{op.name}</td>
                          <td className="p-2">{op.count}</td>
                          <td className="p-2">
                            <span className={op.isCritical ? "text-red-500 font-medium" : "text-amber-500 font-medium"}>
                              {op.avgDuration.toFixed(2)}
                            </span>
                          </td>
                          <td className="p-2">
                            {op.isCritical ? (
                              <div className="flex items-center text-red-500">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Critical
                              </div>
                            ) : (
                              <div className="flex items-center text-amber-500">
                                <AlertTriangle className="h-4 w-4 mr-1" />
                                Warning
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="rounded-md bg-muted p-4">
                  <h4 className="font-medium mb-2">Performance Recommendations</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Consider memoizing expensive calculations in components</li>
                    <li>Check for unnecessary re-renders in React components</li>
                    <li>Optimize data fetching and processing operations</li>
                    <li>Consider code-splitting for large components</li>
                    <li>Review event handlers for performance issues</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No performance warnings detected</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="raw" className="mt-0">
            <div className="space-y-4">
              <div className="rounded-md border overflow-auto max-h-[400px]">
                <pre className="p-4 text-xs">{JSON.stringify(metrics, null, 2)}</pre>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleClearMetrics}>
          Clear Metrics
        </Button>
        <Button variant="outline" onClick={handleDownloadMetrics}>
          <Download className="h-4 w-4 mr-2" />
          Download Metrics
        </Button>
      </CardFooter>
    </Card>
  )
}
