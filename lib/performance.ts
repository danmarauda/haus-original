// Performance monitoring utilities

// Store performance metrics
type PerformanceMetric = {
  name: string
  startTime: number
  duration: number
  component?: string
  info?: Record<string, any>
}

// Global metrics store
let metrics: PerformanceMetric[] = []
let isMonitoringEnabled = true

// Enable or disable monitoring
export const togglePerformanceMonitoring = (enabled: boolean) => {
  isMonitoringEnabled = enabled
}

// Start measuring a performance metric
export const startMeasure = (name: string, component?: string, info?: Record<string, any>) => {
  if (!isMonitoringEnabled) return name

  const id = `${name}-${Date.now()}`
  performance.mark(id)
  return id
}

// End measuring a performance metric
export const endMeasure = (id: string, component?: string, info?: Record<string, any>) => {
  if (!isMonitoringEnabled) return

  try {
    const endMarkId = `${id}-end`
    performance.mark(endMarkId)
    performance.measure(id, id, endMarkId)

    const entries = performance.getEntriesByName(id, "measure")
    if (entries.length) {
      const entry = entries[0]
      metrics.push({
        name: id.split("-")[0], // Extract the base name
        startTime: entry.startTime,
        duration: entry.duration,
        component,
        info,
      })

      // Clean up marks
      performance.clearMarks(id)
      performance.clearMarks(endMarkId)
      performance.clearMeasures(id)
    }
  } catch (error) {
    console.error("Error measuring performance:", error)
  }
}

// Measure a function execution time
export const measureFunction = <T extends (...args: any[]) => any>(fn: T, name: string, component?: string): T => {
  if (!isMonitoringEnabled) return fn

  return ((...args: Parameters<T>) => {
    const id = startMeasure(name, component)
    try {
      const result = fn(...args)

      // Handle promises
      if (result instanceof Promise) {
        return result.finally(() => {
          endMeasure(id, component)
        })
      }

      endMeasure(id, component)
      return result
    } catch (error) {
      endMeasure(id, component, { error: true })
      throw error
    }
  }) as T
}

// Get all collected metrics
export const getMetrics = () => {
  return [...metrics]
}

// Clear all metrics
export const clearMetrics = () => {
  metrics = []
}

// Track component render time using React Profiler
export const onRenderCallback = (
  id: string,
  phase: "mount" | "update",
  actualDuration: number,
  baseDuration: number,
  startTime: number,
  commitTime: number,
) => {
  if (!isMonitoringEnabled) return

  metrics.push({
    name: `render-${id}`,
    startTime,
    duration: actualDuration,
    component: id,
    info: { phase, baseDuration, commitTime },
  })
}

// Track web vitals
export const reportWebVitals = ({
  id,
  name,
  label,
  value,
}: {
  id: string
  name: string
  label: string
  value: number
}) => {
  if (!isMonitoringEnabled) return

  metrics.push({
    name: `webvital-${name}`,
    startTime: Date.now(),
    duration: value,
    info: { id, label },
  })
}

// Get performance summary
export const getPerformanceSummary = () => {
  const summary: Record<string, { count: number; totalDuration: number; avgDuration: number; maxDuration: number }> = {}

  metrics.forEach((metric) => {
    const name = metric.name
    if (!summary[name]) {
      summary[name] = { count: 0, totalDuration: 0, avgDuration: 0, maxDuration: 0 }
    }

    summary[name].count++
    summary[name].totalDuration += metric.duration
    summary[name].avgDuration = summary[name].totalDuration / summary[name].count
    summary[name].maxDuration = Math.max(summary[name].maxDuration, metric.duration)
  })

  return summary
}
