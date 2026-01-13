import { NextRequest, NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: NextRequest) {
  try {
    const { query, currentParams } = await req.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 })
    }

    // Get API key from environment
    const apiKey = process.env.GOOGLE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    const amenitiesList = [
      "Pool", "Pets Allowed", "Garage", "Garden", "Gym", "Balcony", "Waterfront",
      "Sea View", "Mountain View", "City View", "Hot Tub", "Fireplace", "Laundry",
      "Furnished", "Dishwasher", "Hardwood Floors", "Wheelchair Accessible",
      "EV Charging", "Gated Community", "Security System", "Solar Panels",
      "Wine Cellar", "Home Office", "High Ceilings", "Central Heating", "Elevator",
      "Fenced Yard", "Good School District", "Outdoor Entertaining", "New Build",
      "Earthquake Strengthened"
    ]

    const systemInstruction = `You are an intelligent assistant for a real estate website called HAUS. Your task is to extract search parameters from the user's spoken query.
- For 'listingType', accurately infer 'For Sale', 'For Rent', or 'For Lease' from colloquial terms.
- For 'propertyType', normalize various terms into standard categories.
- Extract numerical values for prices, bedrooms, bathrooms, and square meters.
- Identify any amenities or architectural styles mentioned by the user.
- Identify property tags like 'New', 'Premium', or 'Open House' from descriptive phrases.
- Only return values for parameters that are explicitly mentioned or can be clearly inferred from the user's latest query.`

    const userContent = `Current search criteria: ${JSON.stringify(currentParams)}. New user query: "${query}".`

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: systemInstruction + "\n\n" + userContent }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 500,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                location: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "STRING", description: "City, state, or neighborhood" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" }, description: "The exact words from the user's query" }
                  }
                },
                locationRadiusKm: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "NUMBER", description: "Search radius in kilometers" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                },
                propertyType: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "STRING", description: "Type of property (House, Apartment, Condo, Townhouse, etc.)" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                },
                listingType: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "STRING", description: "For Sale, For Rent, or For Lease" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                },
                priceMin: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "NUMBER", description: "Minimum price" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                },
                priceMax: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "NUMBER", description: "Maximum price" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                },
                bedroomsMin: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "NUMBER", description: "Minimum bedrooms" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                },
                bathroomsMin: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "NUMBER", description: "Minimum bathrooms" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                },
                sizeMetersMin: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "NUMBER", description: "Minimum size in square meters" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                },
                sizeMetersMax: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "NUMBER", description: "Maximum size in square meters" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                },
                style: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "STRING", description: "Architectural style" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                },
                amenities: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "ARRAY", items: { type: "STRING" }, description: `Amenities from: ${amenitiesList.join(", ")}` },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                },
                tags: {
                  type: "OBJECT",
                  properties: {
                    value: { type: "ARRAY", items: { type: "STRING" }, description: "Property tags from: new, premium, open-house, auction" },
                    sourceText: { type: "ARRAY", items: { type: "STRING" } }
                  }
                }
              }
            }
          }
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Gemini API error:", errorText)
      return NextResponse.json({ error: "Failed to process voice query" }, { status: 500 })
    }

    const data = await response.json()
    const extractedText = data.candidates?.[0]?.content?.parts?.[0]?.text

    if (!extractedText) {
      return NextResponse.json({})
    }

    const parsed = JSON.parse(extractedText)
    return NextResponse.json(parsed)

  } catch (error) {
    console.error("Voice processing error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
