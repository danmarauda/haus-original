"use client"

import { motion } from "framer-motion"

export function VirtualTourLoading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-[#121315]">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#2D2F32] border-t-[#FFD166]"></div>
        <h2 className="mt-6 text-xl font-semibold text-[#E9EAEC]">Loading Virtual Tour</h2>
        <p className="mt-2 text-center text-[#A0A3A7]">
          Preparing your immersive experience...
          <br />
          This may take a few moments.
        </p>
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "60%" }}
        transition={{ duration: 8, ease: "easeInOut" }}
        className="mt-8 h-1 rounded-full bg-[#FFD166]"
      ></motion.div>

      <div className="mt-4 text-sm text-[#A0A3A7]">Loading 3D environment</div>
    </div>
  )
}
