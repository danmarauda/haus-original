"use client"

import type React from "react"

import { useCallback, useContext, createContext, useState, useRef, useMemo } from "react"

type PerformanceMetric = {
  componentName: string
  operationName: string
  duration: number
  timestamp: number
}

type PerformanceContextType = {
  metrics: PerformanceMetric[]
  addMetric: (metric: PerformanceMetric) => void
  clearMetrics: () => void
}

const PerformanceContext = createContext<PerformanceContextType | null>(null)

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])

  const addMetric = useCallback((metric: PerformanceMetric) => {
    setMetrics((prev) => [...prev, metric])
  }, [])

  const clearMetrics = useCallback(() => {
    setMetrics([])
  }, [])

  const value = useMemo(() => ({ metrics, addMetric, clearMetrics }), [metrics, addMetric, clearMetrics])

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>
}

export function usePerformanceMonitor(componentName: string) {
  const context = useContext(PerformanceContext)
  const isMounted = useRef(true)

  // If no context is available, provide a no-op implementation
  // This prevents errors when the component is used outside of a PerformanceProvider
  const noopMeasure = useCallback(<T extends (...args: any[]) => any>(fn: T, operationName: string): T => {
    return ((...args: Parameters<T>) => fn(...args)) as T
  }, [])

  const measure = useMemo(() => {
    // If the context is not available, return a no-op implementation
    if (!context) {
      return noopMeasure
    }

    return <T extends (...args: any[]) => any>(fn: T, operationName: string): T => {
      return ((...args: Parameters<T>) => {
        if (!isMounted.current) return fn(...args)

        const start = performance.now()
        const result = fn(...args)
        const end = performance.now()
        const duration = end - start

        // Only add the metric if the component is still mounted
        if (isMounted.current) {
          context.addMetric({
            componentName,
            operationName,
            duration,
            timestamp: Date.now(),
          })
        }

        return result
      }) as T
    }
  }, [componentName, context, isMounted, noopMeasure])

  return { measure }
}
