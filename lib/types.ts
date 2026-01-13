export interface Property {
  id: number | string;
  title: string;
  location: string;
  price: number;
  details?: string;
  imageUrl: string;
  description: string;
  tag?: {
    text: string;
    type: 'new' | 'premium' | 'open-house' | 'auction';
  };
  tourAvailable?: boolean;
  button?: {
    text: string;
    icon: 'eye' | 'route';
  };
  // Additional properties for ModernPropertyCard
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  size?: string;
  amenities?: string[];
  agent?: {
    name: string;
    phone?: string;
    email?: string;
  };
  listedDate?: string;
  listingType?: 'For Sale' | 'For Rent' | 'For Lease';
}

export interface SearchParams {
  location?: string;
  locationRadiusKm?: number;
  propertyType?: string;
  listingType?: 'For Sale' | 'For Rent' | 'For Lease';
  priceMin?: number;
  priceMax?: number;
  bedroomsMin?: number;
  bathroomsMin?: number;
  sizeMetersMin?: number;
  sizeMetersMax?: number;
  style?: string;
  styleImage?: string;
  amenities?: string[];
  tags?: ('new' | 'premium' | 'open-house' | 'auction')[];
}

export interface SavedSearch {
  id: string;
  name: string;
  params: SearchParams;
  createdAt: number;
}

export const generateMockResults = (params: SearchParams): Property[] => {
  const results: Property[] = [];
  const count = 3 + Math.floor(Math.random() * 2);

  const defaultLocations = ['Sydney, NSW', 'Melbourne, VIC', 'Brisbane, QLD', 'Perth, WA', 'Bondi Beach, NSW', 'South Yarra, VIC', 'Surfers Paradise, QLD'];
  const defaultTypes = ['Apartment', 'House', 'Townhouse', 'Unit', 'Villa'];

  const allTags: { text: string; type: 'new' | 'premium' | 'open-house' | 'auction' }[] = [
    { text: 'New', type: 'new' },
    { text: 'Premium', type: 'premium' },
    { text: 'Open House', type: 'open-house' },
    { text: 'Auction', type: 'auction' }
  ];

  const allAmenities = ['Pool', 'Garage', 'Garden', 'Balcony', 'Air Conditioning', 'Gym', 'Waterfront', 'Sea View', 'Mountain View', 'Pet Friendly'];

  for (let i = 0; i < count; i++) {
    const id = Date.now() + i;
    const location = params.location || defaultLocations[i % defaultLocations.length];
    const propertyType = params.propertyType || defaultTypes[i % defaultTypes.length];
    const bedrooms = params.bedroomsMin || (2 + i);
    const bathrooms = params.bathroomsMin || (bedrooms > 1 ? bedrooms - 1 : 1);
    const parking = Math.floor(Math.random() * 3);

    let sqm: number;
    const defaultSqm = 110 + bedrooms * 35;

    if (params.sizeMetersMin !== undefined || params.sizeMetersMax !== undefined) {
      const minSqm = params.sizeMetersMin ?? 0;
      const maxSqm = params.sizeMetersMax ?? (minSqm + 150);
      sqm = Math.round(minSqm + Math.random() * (maxSqm - minSqm));
    } else {
      sqm = defaultSqm + Math.floor(Math.random() * 40 - 20);
    }

    const amenities = params.amenities && params.amenities.length > 0
      ? params.amenities
      : allAmenities.sort(() => 0.5 - Math.random()).slice(0, 3 + Math.floor(Math.random() * 3));

    let title = `${params.style || 'Spacious'} ${propertyType}`;
    if (amenities.length > 0) {
      title = `${params.style || 'Modern'} ${propertyType} with ${amenities[0]}`;
    }

    let priceValue: number;
    const listingType = params.listingType || 'For Sale';

    if (listingType === 'For Rent' || listingType === 'For Lease') {
      const minRentDefault = 2000;
      const maxRentDefault = 15000;
      priceValue = (params.priceMin || minRentDefault) + Math.random() * ((params.priceMax || maxRentDefault) - (params.priceMin || minRentDefault));
      priceValue = Math.round(priceValue / 100) * 100;
      if (params.priceMax && priceValue > params.priceMax) priceValue = params.priceMax;
      if (params.priceMin && priceValue < params.priceMin) priceValue = params.priceMin;
    } else {
      const minPriceDefault = 800000;
      const maxPriceDefault = 5000000;
      priceValue = (params.priceMin || minPriceDefault) + Math.random() * ((params.priceMax || maxPriceDefault) - (params.priceMin || minPriceDefault));
      if (params.priceMin && !params.priceMax) priceValue = Math.max(priceValue, params.priceMin);
      if (params.priceMax && !params.priceMin) priceValue = Math.min(priceValue, params.priceMax);
      priceValue = Math.round(priceValue / 100000) * 100000;
      if (params.priceMax && priceValue > params.priceMax) priceValue = params.priceMax;
      if (params.priceMin && priceValue < params.priceMin) priceValue = params.priceMin;
    }

    let tag;
    if (params.tags && params.tags.length > 0) {
      const selectedTagType = params.tags[i % params.tags.length];
      tag = allTags.find(t => t.type === selectedTagType);
    } else if (Math.random() > 0.6) {
      tag = allTags[Math.floor(Math.random() * allTags.length)];
    }

    // Generate a random listed date within the last 30 days
    const listedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();

    results.push({
      id: id,
      title: title,
      location: location,
      price: priceValue,
      details: `${bedrooms} bd • ${bathrooms} ba • ${sqm} sqm`,
      imageUrl: `https://picsum.photos/800/600?random=${id}`,
      description: `Discover this stunning ${propertyType.toLowerCase()} in the heart of ${location}. Featuring ${bedrooms} bedrooms and ${bathrooms} bathrooms, this property offers an expansive ${sqm} sqm of modern living space.`,
      tag: tag,
      tourAvailable: Math.random() > 0.5,
      button: { text: 'Virtual tour', icon: 'eye' },
      bedrooms,
      bathrooms,
      parking,
      size: `${sqm} sqm`,
      amenities,
      agent: {
        name: `Agent ${Math.floor(Math.random() * 10) + 1}`,
        phone: '0412 345 678',
        email: `agent${Math.floor(Math.random() * 10) + 1}@realestate.com.au`
      },
      listedDate,
      listingType
    });
  }
  return results;
}
