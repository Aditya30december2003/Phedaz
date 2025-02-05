"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { Client, Databases, Query } from "appwrite"

const MarqueeTape = () => {
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [cardWidth, setCardWidth] = useState(400)
  const [loading, setLoading] = useState(true)
  const [tapeContent, setTapeContent] = useState([])

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
    .setEndpoint("https://centralapps.hivefinty.com/v1")
    .setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "6794d585001ad33f715a"

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
  }, [databases, databaseId, collectionId])

  if (loading) {
    return <div className="text-[#0A0A45]">Loading...</div>
  }

  return (
    <div className="bg-[#E5F0F1] py-3 md:py-4 overflow-hidden">
      <h2 
        data-aos="zoom-in"
        data-aos-delay="600" 
        className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-[#0A0A45]"
      >
        {tapeContent[0].Heading}
      </h2>

      <div className="relative">
        {/* Diagonal stripe background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: `linear-gradient(135deg, 
              transparent 25%, 
              #0A0A45 25%, 
              #0A0A45 50%, 
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
                className={`relative p-4 md:p-6 shadow-lg transform ${
                  index % 2 === 0 ? "rotate-2" : "-rotate-2"
                }`}
                style={{
                  minWidth: `${cardWidth}px`,
                  maxWidth: `${cardWidth}px`,
                  clipPath: "polygon(0% 0%, 100% 0%, 97% 100%, 3% 100%)",
                  backgroundColor: "#FFF5C3",
                }}
              >
                <div className="absolute inset-0 bg-[#E5F0F1] opacity-50 transform scale-95"></div>
                <div className="relative z-10">
                  <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-[#0A0A45] line-clamp-1">
                    {content.title}
                  </h3>
                  <p className="text-xs md:text-sm text-[#0A0A45]/80 line-clamp-3">
                    {content.description}
                  </p>
                </div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-[#0A0A45] opacity-50 transform scale-105"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default MarqueeTape