"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Brain, Compass, Eye, Home, Zap } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

export default function FeatureShowcase() {
  return (
    <section className="bg-black py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12 text-center">
          <h3 className="alias-component-category mb-2 text-[#D4C1B3]">TECHNOLOGY</h3>
          <h2 className="alias-section-title mx-auto mb-6">IMMERSIVE EXPERIENCE</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Our platform combines cutting-edge technologies to deliver an unparalleled real estate experience.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto grid gap-2 sm:grid-cols-5"
        >
          <Card className="group overflow-hidden border border-white/5 bg-[rgba(0,0,0,0.2)] sm:col-span-3 sm:rounded-none sm:rounded-tl-xl">
            <CardHeader>
              <div className="md:p-6">
                <p className="font-medium uppercase tracking-widest text-white">3D VIRTUAL TOURS</p>
                <p className="mt-3 max-w-sm text-sm text-white/70">
                  Experience properties remotely with our immersive 3D virtual tours. Navigate through spaces as if you
                  were physically present, examining every detail from any angle.
                </p>
              </div>
            </CardHeader>

            <div className="relative h-fit pl-6 md:pl-12">
              <div className="absolute -inset-6 [background:radial-gradient(75%_95%_at_50%_0%,transparent,#000_100%)]"></div>

              <div className="overflow-hidden rounded-tl-lg border-l border-t border-white/10 bg-black pl-2 pt-2">
                <Image
                  src="/placeholder-up7ii.png"
                  alt="Virtual tour of living room"
                  width={1207}
                  height={929}
                  className="opacity-90"
                />
              </div>
            </div>
          </Card>

          <Card className="group overflow-hidden border border-white/5 bg-[rgba(0,0,0,0.2)] sm:col-span-2 sm:rounded-none sm:rounded-tr-xl">
            <p className="mx-auto my-6 max-w-md px-6 text-center text-lg font-light uppercase tracking-widest text-white sm:text-xl md:p-6">
              AI-POWERED PROPERTY MATCHING
            </p>

            <CardContent className="mt-auto h-fit">
              <div className="relative mb-6 sm:mb-0">
                <div className="absolute -inset-6 [background:radial-gradient(50%_75%_at_75%_50%,transparent,#000_100%)]"></div>
                <div className="aspect-76/59 overflow-hidden rounded-r-lg border border-white/10">
                  <div className="relative h-full w-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="h-16 w-16 text-[#D4C1B3]" />
                    </div>
                    <div className="h-full w-full bg-[url('/placeholder-up7ii.png')] bg-cover bg-center opacity-40"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border border-white/5 bg-[rgba(0,0,0,0.2)] p-6 sm:col-span-2 sm:rounded-none sm:rounded-bl-xl md:p-12">
            <p className="mx-auto mb-12 max-w-md text-center text-lg font-light uppercase tracking-widest text-white sm:text-xl">
              INSTANT PROPERTY ACCESS
            </p>

            <div className="flex justify-center gap-6">
              <div className="relative flex aspect-square size-16 items-center rounded-[7px] border border-white/10 bg-black/50 p-3 shadow-lg">
                <span className="absolute right-2 top-1 block text-sm text-[#D4C1B3]">app</span>
                <Home className="mt-auto size-6 text-[#D4C1B3]" />
              </div>
              <div className="flex aspect-square size-16 items-center justify-center rounded-[7px] border border-white/10 bg-black/50 p-3 shadow-lg">
                <Zap className="size-6 text-[#D4C1B3]" />
              </div>
            </div>
          </Card>

          <Card className="group relative border border-white/5 bg-[rgba(0,0,0,0.2)] sm:col-span-3 sm:rounded-none sm:rounded-br-xl">
            <CardHeader className="p-6 md:p-12">
              <p className="font-medium uppercase tracking-widest text-white">INTEGRATED ECOSYSTEM</p>
              <p className="mt-2 max-w-sm text-sm text-white/70">
                Our platform seamlessly connects with essential real estate services and tools, creating a unified
                experience.
              </p>
            </CardHeader>

            <CardContent className="relative h-fit px-6 pb-6 md:px-12 md:pb-12">
              <div className="grid grid-cols-4 gap-2 md:grid-cols-6">
                <div className="aspect-square rounded-md border border-dashed border-white/10"></div>
                <div className="flex aspect-square items-center justify-center rounded-md border border-white/10 bg-black/50 p-4">
                  <Eye className="size-8 text-[#D4C1B3]" />
                </div>
                <div className="aspect-square rounded-md border border-dashed border-white/10"></div>
                <div className="flex aspect-square items-center justify-center rounded-md border border-white/10 bg-black/50 p-4">
                  <Compass className="size-8 text-[#D4C1B3]" />
                </div>
                <div className="aspect-square rounded-md border border-dashed border-white/10"></div>
                <div className="flex aspect-square items-center justify-center rounded-md border border-white/10 bg-black/50 p-4">
                  <Brain className="size-8 text-[#D4C1B3]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
