"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Brain, Compass, Eye, BarChart3, Lock, Map } from "lucide-react"
import type { ReactNode } from "react"
import { motion } from "framer-motion"

export default function FeatureCards() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
  }

  return (
    <section className="py-20 bg-black">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <h3 className="alias-component-category mb-2 text-[#D4C1B3]">THE HAUS ADVANTAGE</h3>
          <h2 className="alias-section-title mx-auto mb-6">INTELLIGENT REAL ESTATE</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Our platform leverages cutting-edge AI technology to transform your property search experience, providing
            unprecedented insights and visualization capabilities.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <motion.div variants={item}>
            <Card className="bg-[rgba(0,0,0,0.2)] border border-white/5 hover:border-white/15 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Brain className="h-6 w-6 text-[#D4C1B3]" aria-hidden />
                </CardDecorator>

                <h3 className="mt-6 text-xl uppercase tracking-widest">AI-POWERED MATCHING</h3>
              </CardHeader>

              <CardContent>
                <p className="text-white/70">
                  Our proprietary algorithm learns your preferences from both explicit criteria and implicit behavior,
                  delivering increasingly personalized property recommendations.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-[rgba(0,0,0,0.2)] border border-white/5 hover:border-white/15 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Eye className="h-6 w-6 text-[#D4C1B3]" aria-hidden />
                </CardDecorator>

                <h3 className="mt-6 text-xl uppercase tracking-widest">IMMERSIVE VISUALIZATION</h3>
              </CardHeader>

              <CardContent>
                <p className="text-white/70">
                  Experience properties through photorealistic 3D tours, AR furniture placement, and day/night lighting
                  simulations before scheduling an in-person visit.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-[rgba(0,0,0,0.2)] border border-white/5 hover:border-white/15 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <BarChart3 className="h-6 w-6 text-[#D4C1B3]" aria-hidden />
                </CardDecorator>

                <h3 className="mt-6 text-xl uppercase tracking-widest">PREDICTIVE ANALYTICS</h3>
              </CardHeader>

              <CardContent>
                <p className="text-white/70">
                  Make informed decisions with AI-generated price forecasts, investment potential analysis, and
                  neighborhood trend predictions based on comprehensive data.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-[rgba(0,0,0,0.2)] border border-white/5 hover:border-white/15 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Lock className="h-6 w-6 text-[#D4C1B3]" aria-hidden />
                </CardDecorator>

                <h3 className="mt-6 text-xl uppercase tracking-widest">EXCLUSIVE INVENTORY</h3>
              </CardHeader>

              <CardContent>
                <p className="text-white/70">
                  Gain access to our curated collection of off-market properties, pre-market listings, and private sales
                  opportunities not available on traditional platforms.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-[rgba(0,0,0,0.2)] border border-white/5 hover:border-white/15 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Compass className="h-6 w-6 text-[#D4C1B3]" aria-hidden />
                </CardDecorator>

                <h3 className="mt-6 text-xl uppercase tracking-widest">NEIGHBORHOOD INSIGHTS</h3>
              </CardHeader>

              <CardContent>
                <p className="text-white/70">
                  Discover detailed micromarket data on schools, amenities, transportation, safety, and future
                  development plans with our comprehensive location intelligence.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="bg-[rgba(0,0,0,0.2)] border border-white/5 hover:border-white/15 transition-all duration-300 group">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <Map className="h-6 w-6 text-[#D4C1B3]" aria-hidden />
                </CardDecorator>

                <h3 className="mt-6 text-xl uppercase tracking-widest">SMART COMPARISONS</h3>
              </CardHeader>

              <CardContent>
                <p className="text-white/70">
                  Compare properties across multiple dimensions with our AI-powered analysis tool that highlights
                  differences and similarities based on your unique priorities.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div className="relative mx-auto size-36 duration-200 [--color-border:rgba(255,255,255,0.05)] group-hover:[--color-border:rgba(255,255,255,0.1)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:24px_24px]"
    />
    <div aria-hidden className="absolute inset-0 from-transparent to-black to-75% bg-radial" />
    <div className="absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t border-white/10">
      {children}
    </div>
  </div>
)
