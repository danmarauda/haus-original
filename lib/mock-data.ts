export const mockProperties = [
  {
    id: "prop-aus-1",
    title: "Chic Inner-City Terrace",
    address: "123 Surry Hills Rd, Sydney, NSW",
    price: 1850000, // AUD
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 180, // sqm
    images: ["/placeholder.svg?height=400&width=600"],
    matchScore: 95,
    tags: ["Heritage", "Renovated", "Courtyard"],
    location: {
      address: "123 Surry Hills Rd, Sydney, NSW",
    },
    features: {
      kitchen: "Modern Gas Kitchen",
      flooring: "Polished Timber",
      outdoorSpace: "Private Courtyard",
    },
    systems: {
      heating: "Ducted Air Con",
      cooling: "Ducted Air Con",
      parking: "Street Permit",
    },
    yearBuilt: 1910,
    propertyType: "Terrace House",
    lotSize: "200 sqm",
  },
  {
    id: "prop-aus-2",
    title: "Beachside Apartment with Ocean Views",
    address: "45 Esplanade, Bondi Beach, NSW",
    price: 2200000, // AUD
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 120, // sqm
    images: ["/placeholder.svg?height=400&width=600"],
    matchScore: 92,
    tags: ["Ocean Views", "Luxury", "Balcony"],
    location: {
      address: "45 Esplanade, Bondi Beach, NSW",
    },
    features: {
      kitchen: "Gourmet Kitchen",
      flooring: "Tile & Carpet",
      outdoorSpace: "Large Balcony",
    },
    systems: {
      heating: "Reverse Cycle Air Con",
      cooling: "Reverse Cycle Air Con",
      parking: "Secure Underground Space",
    },
    yearBuilt: 2015,
    propertyType: "Apartment / Unit",
    lotSize: "N/A",
  },
  {
    id: "prop-aus-3",
    title: "Spacious Queenslander Family Home",
    address: "78 Paddington Tce, Brisbane, QLD",
    price: 1550000, // AUD
    bedrooms: 4,
    bathrooms: 3,
    squareFeet: 280, // sqm
    images: ["/placeholder.svg?height=400&width=600"],
    matchScore: 88,
    tags: ["Queenslander", "Family-Friendly", "Large Deck"],
    location: {
      address: "78 Paddington Tce, Brisbane, QLD",
    },
    features: {
      kitchen: "Country Style Kitchen",
      flooring: "Hoop Pine Floors",
      outdoorSpace: "Covered Verandah & Backyard",
    },
    systems: {
      heating: "Ceiling Fans", // Common in QLD
      cooling: "Split System Air Con",
      parking: "Double Carport",
    },
    yearBuilt: 1925,
    propertyType: "House",
    lotSize: "600 sqm",
  },
  {
    id: "prop-aus-4",
    title: "Modern Melbourne Laneway Pad",
    address: "10 Degraves St, Melbourne, VIC",
    price: 980000, // AUD
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 65, // sqm
    images: ["/placeholder.svg?height=400&width=600"],
    location: {
      address: "10 Degraves St, Melbourne, VIC",
    },
    features: {
      kitchen: "Sleek Euro Kitchen",
      flooring: "Concrete Floors",
      outdoorSpace: "Juliet Balcony",
    },
    systems: {
      heating: "Panel Heaters",
      cooling: "Split System Air Con",
      parking: "None (CBD)",
    },
    yearBuilt: 2018,
    propertyType: "Apartment / Unit",
    lotSize: "N/A",
    matchScore: 85,
  },
  {
    id: "prop-aus-5",
    title: "Suburban Sanctuary with Pool",
    address: "22 Castle Hill Dr, Perth, WA",
    price: 1100000, // AUD
    bedrooms: 4,
    bathrooms: 2,
    squareFeet: 250, // sqm
    images: ["/placeholder.svg?height=400&width=600"],
    location: {
      address: "22 Castle Hill Dr, Perth, WA",
    },
    features: {
      kitchen: "Open Plan Kitchen",
      flooring: "Tiles & Carpet",
      outdoorSpace: "Alfresco & Pool",
    },
    systems: {
      heating: "Ducted Gas Heating",
      cooling: "Evaporative Cooling",
      parking: "Double Garage",
    },
    yearBuilt: 2005,
    propertyType: "House",
    lotSize: "700 sqm",
    matchScore: 82,
  },
  {
    id: "prop-aus-6",
    title: "Adelaide Hills Retreat",
    address: "33 Summit Rd, Stirling, SA",
    price: 950000, // AUD
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 200, // sqm
    images: ["/placeholder.svg?height=400&width=600"],
    location: {
      address: "33 Summit Rd, Stirling, SA",
    },
    features: {
      kitchen: "Farmhouse Kitchen",
      flooring: "Slate & Timber",
      outdoorSpace: "Large Garden & Shed",
    },
    systems: {
      heating: "Slow Combustion Heater",
      cooling: "Ceiling Fans",
      parking: "Carport",
    },
    yearBuilt: 1980,
    propertyType: "House",
    lotSize: "1200 sqm", // Larger lot
    matchScore: 79,
  },
  {
    id: "prop-aus-7",
    title: "Canberra Townhouse Living",
    address: "15 Braddon St, Canberra, ACT",
    price: 780000, // AUD
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 110, // sqm
    images: ["/placeholder.svg?height=400&width=600"],
    location: {
      address: "15 Braddon St, Canberra, ACT",
    },
    features: {
      kitchen: "Modern Kitchenette",
      flooring: "Laminate",
      outdoorSpace: "Small Courtyard",
    },
    systems: {
      heating: "Electric Wall Heaters",
      cooling: "Reverse Cycle Air Con",
      parking: "Single Garage",
    },
    yearBuilt: 2010,
    propertyType: "Townhouse",
    lotSize: "150 sqm",
    matchScore: 75,
  },
  {
    id: "prop-aus-8",
    title: "Darwin Tropical Escape",
    address: "8 Marina Bvd, Darwin, NT",
    price: 880000, // AUD
    bedrooms: 3,
    bathrooms: 2,
    squareFeet: 190, // sqm
    images: ["/placeholder.svg?height=400&width=600"],
    location: {
      address: "8 Marina Bvd, Darwin, NT",
    },
    features: {
      kitchen: "Outdoor Kitchen Setup",
      flooring: "Tiled Throughout",
      outdoorSpace: "Large Entertaining Verandah",
    },
    systems: {
      heating: "N/A", // Darwin climate
      cooling: "Split System Air Con Throughout",
      parking: "Undercover Parking",
    },
    yearBuilt: 2008,
    propertyType: "Elevated House",
    lotSize: "800 sqm",
    matchScore: 70,
  },
  {
    id: "prop-aus-9",
    title: "Hobart Historic Cottage",
    address: "2 Battery Point Rd, Hobart, TAS",
    price: 720000, // AUD
    bedrooms: 2,
    bathrooms: 1,
    squareFeet: 90, // sqm
    images: ["/placeholder.svg?height=400&width=600"],
    location: {
      address: "2 Battery Point Rd, Hobart, TAS",
    },
    features: {
      kitchen: "Compact & Cosy",
      flooring: "Original Floorboards",
      outdoorSpace: "Small Garden Patch",
    },
    systems: {
      heating: "Wood Heater & Electric",
      cooling: "N/A",
      parking: "On-street",
    },
    yearBuilt: 1890,
    propertyType: "Cottage",
    lotSize: "120 sqm",
    matchScore: 68,
  },
]

export type Property = (typeof mockProperties)[number]

export const getProperties = () => mockProperties
