/**
 * Australian Property Search Service
 * Provides property search functionality with Australian-specific features
 */

export interface AustralianPropertySearchParams {
  location?: string;
  propertyType?: 'house' | 'apartment' | 'unit' | 'townhouse' | 'villa' | 'terrace' | 'penthouse' | 'studio';
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  amenities?: string[];
  landSize?: number;
  buildingSize?: number;
  yearBuilt?: number;
  state?: 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';
  postcode?: string;
  naturalLanguageQuery?: string;
}

export interface PropertySearchResult {
  properties: Property[];
  totalCount: number;
  searchParams: AustralianPropertySearchParams;
  searchTime: number;
  suggestions: string[];
  locationMatches: LocationMatch[];
  priceAnalysis: PriceAnalysis;
}

export interface LocationMatch {
  name: string;
  type: 'suburb' | 'city' | 'state';
  state: string;
  confidence: number;
  averagePrice?: number;
}

export interface PriceAnalysis {
  marketAverage: number;
  priceRange: [number, number];
  affordabilityScore: number;
  marketTrend: 'rising' | 'stable' | 'falling';
  pricePerSqm?: number;
}

const AUSTRALIAN_LOCATIONS: Record<string, { state: string; avgPrice: number }> = {
  'Sydney': { state: 'NSW', avgPrice: 1200000 },
  'Melbourne': { state: 'VIC', avgPrice: 900000 },
  'Brisbane': { state: 'QLD', avgPrice: 650000 },
  'Bondi': { state: 'NSW', avgPrice: 2500000 },
  'South Yarra': { state: 'VIC', avgPrice: 1800000 },
  'Surfers Paradise': { state: 'QLD', avgPrice: 800000 },
  'Paddington': { state: 'NSW', avgPrice: 3200000 },
  'Fitzroy': { state: 'VIC', avgPrice: 1100000 },
  'Perth': { state: 'WA', avgPrice: 550000 },
  'Adelaide': { state: 'SA', avgPrice: 480000 },
};

export class AustralianPropertyService {
  private mockProperties: Property[] = [];

  constructor() {
    this.generateMockProperties();
  }

  async searchProperties(params: AustralianPropertySearchParams): Promise<PropertySearchResult> {
    const startTime = Date.now();

    let filteredProperties = this.mockProperties;

    if (params.location) {
      filteredProperties = filteredProperties.filter(property =>
        this.matchesLocation(property, params.location!)
      );
    }

    if (params.propertyType) {
      filteredProperties = filteredProperties.filter(property =>
        property.propertyType.toLowerCase().includes(params.propertyType!.toLowerCase())
      );
    }

    if (params.priceMin) {
      filteredProperties = filteredProperties.filter(property =>
        property.price >= params.priceMin!
      );
    }

    if (params.priceMax) {
      filteredProperties = filteredProperties.filter(property =>
        property.price <= params.priceMax!
      );
    }

    if (params.bedrooms) {
      filteredProperties = filteredProperties.filter(property =>
        property.bedrooms >= params.bedrooms!
      );
    }

    if (params.amenities && params.amenities.length > 0) {
      filteredProperties = filteredProperties.filter(property =>
        params.amenities!.some(amenity =>
          property.features?.some(feature =>
            feature.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
    }

    const searchTime = Date.now() - startTime;

    return {
      properties: filteredProperties.slice(0, 20),
      totalCount: filteredProperties.length,
      searchParams: params,
      searchTime,
      suggestions: this.generateSuggestions(params, filteredProperties.length),
      locationMatches: this.findLocationMatches(params.location || ''),
      priceAnalysis: this.analyzePrices(filteredProperties, params)
    };
  }

  private matchesLocation(property: Property, location: string): boolean {
    const searchLocation = location.toLowerCase();
    const propertyLocation = `${property.suburb} ${property.state}`.toLowerCase();

    return propertyLocation.includes(searchLocation) ||
           searchLocation.includes(property.suburb.toLowerCase()) ||
           searchLocation.includes(property.state.toLowerCase());
  }

  private generateSuggestions(params: AustralianPropertySearchParams, resultCount: number): string[] {
    const suggestions: string[] = [];

    if (resultCount === 0) {
      suggestions.push('Try expanding your search area');
      suggestions.push('Consider increasing your price range');
    } else if (resultCount < 5) {
      suggestions.push('Try nearby suburbs for more options');
    } else {
      suggestions.push('Refine your search with specific amenities');
    }

    return suggestions.slice(0, 3);
  }

  private findLocationMatches(location: string): LocationMatch[] {
    if (!location) return [];

    const matches: LocationMatch[] = [];
    const searchTerm = location.toLowerCase();

    Object.entries(AUSTRALIAN_LOCATIONS).forEach(([name, info]) => {
      if (name.toLowerCase().includes(searchTerm) || searchTerm.includes(name.toLowerCase())) {
        matches.push({
          name,
          type: name.length > 10 ? 'suburb' : 'city',
          state: info.state,
          confidence: 0.9,
          averagePrice: info.avgPrice
        });
      }
    });

    return matches.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
  }

  private analyzePrices(properties: Property[], params: AustralianPropertySearchParams): PriceAnalysis {
    if (properties.length === 0) {
      return {
        marketAverage: 750000,
        priceRange: [400000, 2000000],
        affordabilityScore: 50,
        marketTrend: 'stable'
      };
    }

    const prices = properties.map(p => p.price);
    const marketAverage = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const priceRange: [number, number] = [Math.min(...prices), Math.max(...prices)];

    return {
      marketAverage,
      priceRange,
      affordabilityScore: Math.max(0, 100 - (marketAverage / 20000)),
      marketTrend: marketAverage > 1000000 ? 'rising' : marketAverage < 600000 ? 'falling' : 'stable'
    };
  }

  private generateMockProperties(): void {
    const propertyTypes = ['house', 'apartment', 'townhouse', 'unit', 'villa'];
    const features = ['pool', 'garage', 'garden', 'balcony', 'air conditioning', 'solar panels', 'ensuite', 'dishwasher'];

    for (let i = 0; i < 100; i++) {
      const locationKeys = Object.keys(AUSTRALIAN_LOCATIONS);
      const location = locationKeys[Math.floor(Math.random() * locationKeys.length)];
      const locationInfo = AUSTRALIAN_LOCATIONS[location];
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];

      const bedrooms = Math.floor(Math.random() * 5) + 1;
      const bathrooms = Math.floor(Math.random() * 3) + 1;
      const parking = Math.floor(Math.random() * 3);

      const basePrice = locationInfo.avgPrice;
      const priceVariation = (Math.random() - 0.5) * 0.6;
      const price = Math.round(basePrice * (1 + priceVariation));

      const selectedFeatures = features
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 6) + 2);

      this.mockProperties.push({
        id: `prop-${i + 1}`,
        title: `${bedrooms} Bed ${propertyType.charAt(0).toUpperCase() + propertyType.slice(1)} in ${location}`,
        address: `${Math.floor(Math.random() * 200) + 1} ${location} Street, ${location}`,
        suburb: location,
        state: locationInfo.state,
        postcode: this.generatePostcode(locationInfo.state),
        price,
        propertyType,
        bedrooms,
        bathrooms,
        parking,
        buildingArea: Math.floor(Math.random() * 120) + 60,
        features: selectedFeatures,
        description: `Beautiful ${propertyType} featuring ${selectedFeatures.slice(0, 3).join(', ')}. Located in the heart of ${location}.`,
        images: [`https://picsum.photos/800/600?random=${i}`],
        agent: {
          name: `Agent ${i % 10 + 1}`,
          phone: '0412 345 678',
          email: `agent${i % 10 + 1}@realestate.com.au`
        }
      });
    }
  }

  private generatePostcode(state: string): string {
    const postcodeRanges: Record<string, [number, number]> = {
      'NSW': [2000, 2999],
      'VIC': [3000, 3999],
      'QLD': [4000, 4999],
      'WA': [6000, 6999],
      'SA': [5000, 5999],
      'TAS': [7000, 7999],
      'ACT': [2600, 2618],
      'NT': [800, 999]
    };

    const [min, max] = postcodeRanges[state] || [2000, 2999];
    return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
  }
}

export default AustralianPropertyService;
