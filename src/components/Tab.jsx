"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Client, Databases, Query } from "appwrite"

// const tapeContent = [
//   {
//     title: "Simplify your path from startup to star",
//     description:
//       "Welcome to the future of business management. Our all-in-one platform streamlines every step of your journey—from swift business incorporation to building stunning no-code or low-code websites.",
//   },
//   {
//     title: "Step into the future of business management",
//     description:
//       "Manage inventory, integrate multi-channel sales, process payments, and access global banking facilities. Simplify operations and fuel your growth.",
//   },
//   {
//     title: "Lead the market. Leave the complexity to us",
//     description:
//       "Whether you're launching your first online store or scaling an established brand, our unified solutions help you focus on what you do best.",
//   },
//   // Duplicate content for seamless loop
//   {
//     title: "Simplify your path from startup to star",
//     description:
//       "Welcome to the future of business management. Our all-in-one platform streamlines every step of your journey—from swift business incorporation to building stunning no-code or low-code websites.",
//   },
//   {
//     title: "Step into the future of business management",
//     description:
//       "Manage inventory, integrate multi-channel sales, process payments, and access global banking facilities. Simplify operations and fuel your growth.",
//   },
//   {
//     title: "Lead the market. Leave the complexity to us",
//     description:
//       "Whether you're launching your first online store or scaling an established brand, our unified solutions help you focus on what you do best.",
//   },
// ]

const MarqueeTape = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [cardWidth, setCardWidth] = useState(400)
  const [loading, setLoading] = useState(true)
  const [tapeContent , setTapeContent] = useState([])

  useEffect(() => {
    setShouldAnimate(true)
    
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setCardWidth(280)
      } else if (width < 768) {
        setCardWidth(350)
      } else {
        setCardWidth(400)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
   
  const client = new Client()
  client
    .setEndpoint("https://centralapps.hivefinty.com/v1") // Replace with your Appwrite endpoint
    .setProject("67912e8e000459a70dab") // Replace with your Project ID

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80" // Replace with your Database ID
  const collectionId = "6794d585001ad33f715a" // Replace with your Collection ID

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId)
        setTapeContent(response.documents)
      } catch (error) {
        console.error("Failed to fetch recent blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [databases, databaseId, collectionId]) // Added dependencies for databases.listDocuments

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-zinc-100 py-3 md:py-4 overflow-hidden">
      <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text">
        {tapeContent[0].Heading}
      </h2>

      <div className="relative">
        {/* Diagonal stripe background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(135deg, 
              transparent 25%, 
              #006666 25%, 
              #006666 50%, 
              transparent 50%
            )`,
            backgroundSize: "200% 200%",
            transform: "skewY(-12deg)",
          }}
        />

        {/* Marquee container */}
        <div className="relative z-10 overflow-hidden">
          <motion.div
            className="flex space-x-4 md:space-x-8 px-4"
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
                className={`relative p-4 md:p-6 bg-color shadow-lg transform ${
                  index % 2 === 0 ? "rotate-2" : "-rotate-2"
                }`}
                style={{
                  minWidth: `${cardWidth}px`,
                  maxWidth: `${cardWidth}px`,
                  clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 3% 100%)",
                }}
              >
                <div className="absolute inset-0 bg-teal-300 opacity-50 transform scale-95"></div>
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-teal-100 line-clamp-1">
                    {content.title}
                  </h3>
                  <p className="text-xs md:text-sm text-teal-800 line-clamp-3">
                    {content.description}
                  </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-teal-500 opacity-50 transform scale-105"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MarqueeTape