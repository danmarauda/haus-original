import Image from "next/image"

export default function FeaturesPage() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Key Features</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Feature 1: AI-Powered Matching */}
        <div className="p-6 border rounded-lg shadow-md">
          <Image
            src="/placeholder.svg?height=500&width=800"
            alt="AI-Powered Matching"
            width={800}
            height={500}
            className="mb-4 rounded-md"
          />
          <h2 className="text-xl font-semibold mb-2">AI-Powered Matching</h2>
          <p className="text-gray-700">
            Our intelligent algorithms analyze your preferences and connect you with properties that perfectly match
            your needs.
          </p>
        </div>

        {/* Feature 2: Immersive 3D Virtual Tours */}
        <div className="p-6 border rounded-lg shadow-md">
          <Image
            src="/placeholder.svg?height=500&width=800"
            alt="Immersive 3D Virtual Tours"
            width={800}
            height={500}
            className="mb-4 rounded-md"
          />
          <h2 className="text-xl font-semibold mb-2">Immersive 3D Virtual Tours</h2>
          <p className="text-gray-700">
            Explore properties from the comfort of your home with our interactive 3D virtual tours. Get a realistic feel
            for the space before you visit.
          </p>
        </div>

        {/* Feature 3: Predictive Analytics & Insights */}
        <div className="p-6 border rounded-lg shadow-md">
          <Image
            src="/placeholder.svg?height=500&width=800"
            alt="Predictive Analytics & Insights"
            width={800}
            height={500}
            className="mb-4 rounded-md"
          />
          <h2 className="text-xl font-semibold mb-2">Predictive Analytics & Insights</h2>
          <p className="text-gray-700">
            Make informed decisions with our predictive analytics tools. We provide valuable insights into market trends
            and property values.
          </p>
        </div>
      </div>
    </div>
  )
}
