"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const tapeContent = [
  {
    title: "Simplify your path from startup to star",
    description:
      "Welcome to the future of business management. Our all-in-one platform streamlines every step of your journey—from swift business incorporation to building stunning no-code or low-code websites.",
  },
  {
    title: "Step into the future of business management",
    description:
      "Manage inventory, integrate multi-channel sales, process payments, and access global banking facilities. Simplify operations and fuel your growth.",
  },
  {
    title: "Lead the market. Leave the complexity to us",
    description:
      "Whether you're launching your first online store or scaling an established brand, our unified solutions help you focus on what you do best.",
  },
  // Duplicate content for seamless loop
  {
    title: "Simplify your path from startup to star",
    description:
      "Welcome to the future of business management. Our all-in-one platform streamlines every step of your journey—from swift business incorporation to building stunning no-code or low-code websites.",
  },
  {
    title: "Step into the future of business management",
    description:
      "Manage inventory, integrate multi-channel sales, process payments, and access global banking facilities. Simplify operations and fuel your growth.",
  },
  {
    title: "Lead the market. Leave the complexity to us",
    description:
      "Whether you're launching your first online store or scaling an established brand, our unified solutions help you focus on what you do best.",
  },
]

const MarqueeTape = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    setShouldAnimate(true)
  }, [])

  return (
    <div className="bg-zinc-900 py-16 overflow-hidden">
      <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Explore Our Platform</h2>

      <div className="relative">
        {/* Diagonal stripe background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(135deg, 
              transparent 25%, 
              #fbbf24 25%, 
              #fbbf24 50%, 
              transparent 50%
            )`,
            backgroundSize: "200% 200%",
            transform: "skewY(-12deg)",
          }}
        />

        {/* Marquee container */}
        <div className="relative z-10">
          <motion.div
            className="flex space-x-8 px-4"
            animate={
              shouldAnimate
                ? {
                    x: [-2000, 0],
                  }
                : {}
            }
            transition={{
              x: {
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {tapeContent.map((content, index) => (
              <motion.div
                key={index}
                className={`relative p-6 bg-yellow-400 shadow-lg transform ${
                  index % 2 === 0 ? "rotate-2" : "-rotate-2"
                } min-w-[400px] max-w-[400px]`}
                style={{
                  clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 3% 100%)",
                }}
              >
                <div className="absolute inset-0 bg-yellow-300 opacity-50 transform scale-95"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-3 text-yellow-900 line-clamp-1">{content.title}</h3>
                  <p className="text-yellow-800 text-sm line-clamp-3">{content.description}</p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-yellow-500 opacity-50 transform scale-105"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MarqueeTape



