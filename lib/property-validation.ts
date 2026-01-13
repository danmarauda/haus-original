import type { Property } from "./mock-data"

/**
 * Type guard to check if a value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

/**
 * Type guard to check if a property has the minimum required fields
 */
export function isValidProperty(property: unknown): property is Property {
  if (!isObject(property)) return false

  // Check for required primitive fields
  const hasRequiredFields =
    typeof property.id === "string" &&
    typeof property.title === "string" &&
    typeof property.address === "string" &&
    typeof property.price === "number"

  if (!hasRequiredFields) return false

  // Check for nested objects
  if (!isObject(property.location)) return false
  if (property.features && !isObject(property.features)) return false
  if (property.systems && !isObject(property.systems)) return false

  return true
}

/**
 * Creates a default property object with safe values
 */
export function createDefaultProperty(): Property {
  return {
    id: "unknown",
    title: "Unknown Property",
    address: "Address not available",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    squareFeet: 0,
    images: [],
    location: {
      address: "Address not available",
    },
    features: {
      kitchen: "Standard",
      flooring: "Standard",
      outdoorSpace: "None",
    },
    systems: {
      heating: "Not specified",
      cooling: "Not specified",
      parking: "Not specified",
    },
  }
}

/**
 * Sanitizes a property object by ensuring all expected fields exist
 * and have appropriate types
 */
export function sanitizeProperty(property: unknown): Property {
  if (!isValidProperty(property)) {
    console.warn("Invalid property data detected, using default values", property)
    return createDefaultProperty()
  }

  // Create a sanitized copy with all expected fields
  const sanitized: Property = {
    ...createDefaultProperty(),
    ...property,
    // Ensure nested objects exist
    location: {
      ...createDefaultProperty().location,
      ...(isObject(property.location) ? property.location : {}),
    },
    features: {
      ...createDefaultProperty().features,
      ...(isObject(property.features) ? property.features : {}),
    },
    systems: {
      ...createDefaultProperty().systems,
      ...(isObject(property.systems) ? property.systems : {}),
    },
  }

  // Ensure numeric values are actually numbers
  sanitized.price = typeof property.price === "number" ? property.price : 0
  sanitized.bedrooms = typeof property.bedrooms === "number" ? property.bedrooms : 0
  sanitized.bathrooms = typeof property.bathrooms === "number" ? property.bathrooms : 0
  sanitized.squareFeet = typeof property.squareFeet === "number" ? property.squareFeet : 0

  // Ensure arrays are actually arrays
  sanitized.images = Array.isArray(property.images) ? property.images : []

  return sanitized
}

/**
 * Validates an array of properties and returns only the valid ones
 */
export function validateProperties(properties: unknown[]): Property[] {
  if (!Array.isArray(properties)) {
    console.error("Expected an array of properties but received:", properties)
    return []
  }

  return properties.map((property) => sanitizeProperty(property))
}

/**
 * Gets a safe property value with a fallback
 */
export function getPropertyValue<T>(property: Property, path: string, fallback: T): T {
  try {
    const keys = path.split(".")
    let value: any = property

    for (const key of keys) {
      if (value === undefined || value === null) return fallback
      value = value[key as keyof typeof value]
    }

    return value === undefined || value === null ? fallback : (value as T)
  } catch (error) {
    console.warn(`Error accessing property path: ${path}`, error)
    return fallback
  }
}

/**
 * Formats a property value for display
 */
export function formatPropertyValue(value: unknown, type: "price" | "area" | "count" | "text"): string {
  if (value === undefined || value === null) {
    return "N/A"
  }

  switch (type) {
    case "price":
      return typeof value === "number"
        ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value)
        : "N/A"

    case "area":
      return typeof value === "number" ? `${value.toLocaleString()} sq ft` : "N/A"

    case "count":
      return typeof value === "number" ? value.toString() : "N/A"

    case "text":
    default:
      return typeof value === "string" ? value : "N/A"
  }
}
