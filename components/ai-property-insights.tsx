"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Clock, Users, Lightbulb } from "lucide-react"

interface AIPropertyInsightsProps {
  property: any
}

export function AIPropertyInsights({ property }: AIPropertyInsightsProps) {
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call to get AI-generated insights
    // For this demo, we'll simulate a loading delay and then show mock insights
    const timer = setTimeout(() => {
      setInsights([
        {
          icon: <TrendingUp className="h-5 w-5" />,
          title: "Market Analysis",
          content:
            "This property is priced 5% below similar homes in the Lakeview Heights neighborhood. Properties in this area have appreciated 12% over the past year, outperforming the regional average of 8%.",
        },
        {
          icon: <Clock className="h-5 w-5" />,
          title: "Timing Insight",
          content:
            "Based on seasonal trends, properties like this typically sell fastest in spring. Current market conditions suggest this property may sell within 18 days, faster than the area average of 24 days.",
        },
        {
          icon: <Users className="h-5 w-5" />,
          title: "Buyer Profile",
          content:
            "This property would appeal to upper-middle income families seeking quality schools and outdoor lifestyle. The lake access and home office are particularly valuable features in the current market.",
        },
        {
          icon: <Lightbulb className="h-5 w-5" />,
          title: "Investment Potential",
          content:
            "With a projected 5-year appreciation of 18% and strong rental demand in this area, this property offers good long-term investment potential. Estimated rental income: $4,200-$4,600/month.",
        },
      ])
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [property])

  return (
    <div className="mt-4 rounded-lg border border-[#2D2F32] bg-[#181A1D] p-4">
      <div className="flex items-center">
        <Sparkles className="mr-2 h-5 w-5 text-[#FFD166]" />
        <h3 className="font-medium">AI-Generated Property Insights</h3>
      </div>

      {loading ? (
        <div className="mt-6 flex items-center justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2D2F32] border-t-[#FFD166]"></div>
          <span className="ml-3 text-[#A0A3A7]">Analyzing property data...</span>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-4 space-y-4"
        >
          {insights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-md border border-[#2D2F32] bg-[#1F2124] p-4"
            >
              <div className="flex items-center">
                <div className="mr-3 text-[#FFD166]">{insight.icon}</div>
                <h4 className="font-medium">{insight.title}</h4>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[#A0A3A7]">{insight.content}</p>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
