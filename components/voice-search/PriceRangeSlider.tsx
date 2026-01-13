"use client"

import * as React from "react"

const cn = (...inputs: (string | undefined | null | false)[]) => {
  return inputs.filter(Boolean).join(" ")
}

const valueToPercent = (value: number, min: number, max: number) => {
  if (max === min) return 0
  return ((value - min) / (max - min)) * 100
}

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1).replace(/\.0$/, "")}M`
  }
  if (value >= 1000) {
    return `$${Math.round(value / 1000)}k`
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface PriceRangeSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[]
  value?: [number, number]
  onValueChange?: (value: [number, number]) => void
  listingType?: "For Sale" | "For Rent" | "For Lease"
}

export const PriceRangeSlider = React.forwardRef<HTMLDivElement, PriceRangeSliderProps>(
  ({ className, data, value: controlledValue, onValueChange, listingType, ...props }, ref) => {
    const isRent = listingType === "For Rent" || listingType === "For Lease"
    const effectiveMin = isRent ? 500 : 100000
    const effectiveMax = isRent ? 15000 : 10000000
    const effectiveStep = isRent ? 100 : 50000

    const defaultValue: [number, number] = [controlledValue?.[0] ?? effectiveMin, controlledValue?.[1] ?? effectiveMax]
    const [localValues, setLocalValues] = React.useState<[number, number]>(defaultValue)

    React.useEffect(() => {
      setLocalValues(controlledValue ?? [effectiveMin, effectiveMax])
    }, [controlledValue, effectiveMin, effectiveMax])

    const [isMinThumbDragging, setIsMinThumbDragging] = React.useState(false)
    const [isMaxThumbDragging, setIsMaxThumbDragging] = React.useState(false)

    const sliderRef = React.useRef<HTMLDivElement>(null)

    const [minVal, maxVal] = localValues
    const minPercent = valueToPercent(minVal, effectiveMin, effectiveMax)
    const maxPercent = valueToPercent(maxVal, effectiveMin, effectiveMax)

    const handleValueChange = React.useCallback(
      (newValues: [number, number]) => {
        setLocalValues(newValues)
        if (onValueChange) {
          onValueChange(newValues)
        }
      },
      [onValueChange]
    )

    React.useEffect(() => {
      const handleMouseMove = (event: MouseEvent | TouchEvent) => {
        if (!sliderRef.current) return
        if (!isMinThumbDragging && !isMaxThumbDragging) return

        const clientX = "touches" in event ? event.touches[0].clientX : event.clientX
        const rect = sliderRef.current.getBoundingClientRect()
        const percent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
        let newValue = Math.round((effectiveMin + (percent / 100) * (effectiveMax - effectiveMin)) / effectiveStep) * effectiveStep

        newValue = Math.max(effectiveMin, Math.min(effectiveMax, newValue))

        if (isMinThumbDragging) {
          handleValueChange([Math.min(newValue, maxVal - effectiveStep), maxVal])
        }
        if (isMaxThumbDragging) {
          handleValueChange([minVal, Math.max(newValue, minVal + effectiveStep)])
        }
      }

      const handleMouseUp = () => {
        setIsMinThumbDragging(false)
        setIsMaxThumbDragging(false)
      }

      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("touchmove", handleMouseMove, { passive: false })
      document.addEventListener("mouseup", handleMouseUp)
      document.addEventListener("touchend", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("touchmove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.removeEventListener("touchend", handleMouseUp)
      }
    }, [isMinThumbDragging, isMaxThumbDragging, effectiveMin, effectiveMax, effectiveStep, minVal, maxVal, handleValueChange])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, thumb: "min" | "max") => {
      let newMinValue = minVal
      let newMaxValue = maxVal

      if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault()
        if (thumb === "min") newMinValue = Math.max(effectiveMin, minVal - effectiveStep)
        else newMaxValue = Math.max(minVal + effectiveStep, maxVal - effectiveStep)
      } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault()
        if (thumb === "min") newMinValue = Math.min(maxVal - effectiveStep, minVal + effectiveStep)
        else newMaxValue = Math.min(effectiveMax, maxVal + effectiveStep)
      } else if (e.key === "Home") {
        e.preventDefault()
        if (thumb === "min") newMinValue = effectiveMin
        else newMaxValue = minVal + effectiveStep
      } else if (e.key === "End") {
        e.preventDefault()
        if (thumb === "min") newMinValue = maxVal - effectiveStep
        else newMaxValue = effectiveMax
      }

      handleValueChange([newMinValue, newMaxValue])
    }

    return (
      <div className={cn("w-full", className)} {...props} ref={ref}>
        <div className="relative w-full h-12" ref={sliderRef}>
          <div className="absolute inset-0 flex items-end gap-px">
            {data.map((value, index) => {
              const barPercent = (index / (data.length - 1)) * 100
              const isInRange = barPercent >= minPercent && barPercent <= maxPercent
              return (
                <div
                  key={index}
                  className={cn(
                    "w-full rounded-t-sm transition-colors duration-300",
                    isInRange ? "bg-blue-600" : "bg-white/10"
                  )}
                  style={{ height: `${value * 100}%` }}
                />
              )
            })}
          </div>

          <div className="relative h-full">
            <button
              role="slider"
              aria-valuemin={effectiveMin}
              aria-valuemax={maxVal - effectiveStep}
              aria-valuenow={minVal}
              aria-label="Minimum price"
              onMouseDown={(e) => { e.preventDefault(); setIsMinThumbDragging(true) }}
              onTouchStart={(e) => { e.preventDefault(); setIsMinThumbDragging(true) }}
              onKeyDown={(e) => handleKeyDown(e, "min")}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-neutral-100 rounded-full border-2 border-blue-500 shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
              style={{ left: `${minPercent}%` }}
            />
            <button
              role="slider"
              aria-valuemin={minVal + effectiveStep}
              aria-valuemax={effectiveMax}
              aria-valuenow={maxVal}
              aria-label="Maximum price"
              onMouseDown={(e) => { e.preventDefault(); setIsMaxThumbDragging(true) }}
              onTouchStart={(e) => { e.preventDefault(); setIsMaxThumbDragging(true) }}
              onKeyDown={(e) => handleKeyDown(e, "max")}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-neutral-100 rounded-full border-2 border-blue-500 shadow-sm cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
              style={{ left: `${maxPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 items-center gap-4 mt-2">
          <div className="bg-white/5 p-2 rounded-lg text-center border border-transparent">
            <p className="text-xs text-neutral-400">Minimum</p>
            <p className="text-sm font-semibold text-neutral-100">
              {formatCurrency(minVal)}
            </p>
          </div>
          <div className="bg-white/5 p-2 rounded-lg text-center border border-transparent">
            <p className="text-xs text-neutral-400">Maximum</p>
            <p className="text-sm font-semibold text-neutral-100">
              {formatCurrency(maxVal)}
            </p>
          </div>
        </div>
      </div>
    )
  }
)

PriceRangeSlider.displayName = "PriceRangeSlider"
