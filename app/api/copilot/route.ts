import { streamText } from "ai"
import { groq } from "@ai-sdk/groq"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    const result = await streamText({
      model: groq("llama3-8b-8192"),
      messages,
      system: `You are a helpful AI assistant for a real estate platform called OpenHaus.AI. 
      You help users find properties, answer questions about real estate, and provide market insights.
      Keep responses concise and helpful. Focus on Australian real estate market when relevant.`,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in copilot route:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
