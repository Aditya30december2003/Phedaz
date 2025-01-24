"use client"
import { motion } from "framer-motion"
import { useState } from "react"
// import { Button } from "@/components/ui/button"
import CardSelector from "../components/card-selector"
import BorderOptions from "../components/border-options"
// import BorderOptions from "./components/border-options"

export default function VirtualCardPage() {
  const [selectedCard, setSelectedCard] = useState(1)

  return (
    <div className="text-white p-8">
      <div className="max-w-6xl mx-auto">

        {/* Main Card Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl bg-zinc-900/30 backdrop-blur-xl overflow-hidden"
        >
          {/* Folder-like top */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-zinc-800/50 rounded-t-3xl" />
          
          {/* Border Options */}
          <BorderOptions />

          <div className="pt-16 pb-8 px-8">
            {/* Navigation */}
            {/* <Header /> */}

            {/* Card Selection Area */}
            <div className="mt-16 h-screen">
              <div className="text-center">
                <h2 className="text-md font-semibold mb-2">What we Offer</h2>
                <p className="text-zinc-400 text-2xl">Key Capabilities</p>
                {/* <p className="text-sm text-zinc-500">You can change the card design at any time</p> */}
              </div>

              <CardSelector selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
