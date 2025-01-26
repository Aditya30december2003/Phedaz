"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Client, Databases } from "appwrite"
import BufferAnimation from "./BufferAnimation"

const sentences = ["Streamline Your Operations", "Boost Your Sales", "Grow Your Business"]

function Hero() {
  const [currentSentence, setCurrentSentence] = useState(0)
  const [hero, setHero] = useState({ Heading: "", bgVideo: "" }) // Default structure
  const [loading, setLoading] = useState(true)

  // Sentence rotation logic
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSentence((prev) => (prev + 1) % sentences.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Appwrite setup
  const client = new Client()
    .setEndpoint("https://centralapps.hivefinty.com/v1")
    .setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "6794cdcd00126d8487ea"

  // Fetch data from Appwrite
  const fetchHome = async () => {
    try {
      const response = await databases.listDocuments(databaseId, collectionId)
      setHero(response.documents[0] || { Heading: "", bgVideo: "" }) // Ensure valid data
    } catch (error) {
      console.error("Failed to fetch home data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHome()
  }, []) // Removed unnecessary dependencies

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800">
        <BufferAnimation size={90} color="white" />
      </div>
    )
  }

  return (
    <section className="relative min-h-screen pt-[3rem] lg:pt-[5rem] bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {hero.bgVideo && (
          <video
            src={hero.bgVideo}
            loop
            autoPlay
            muted
            playsInline
            className="object-cover w-full h-full opacity-20"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-blue-50 opacity-90"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-16 flex flex-col justify-center items-center min-h-screen text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-7xl font-bold mb-6 leading-tight text-gray-900 mt-10"
        >
          {hero.Heading} <span className="text-blue-600">{hero.CompanyName}</span>
        </motion.h1>

        {/* Animated Subtext */}
        <div className="bg-white w-[96%] lg:w-[70%] h-[27rem] rounded-lg mt-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSentence}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-[1.2rem] md:text-[2.8rem] mt-10 text-blue-500 font-extrabold"
            >
              {hero.subHeadings[currentSentence]}
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 mx-auto w-[70%] lg:w-[48%] py-5">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-blue-600 transition duration-300"
            >
              Join Our Waitlist
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-50 transition duration-300 border-2 border-blue-600"
            >
              Learn More
            </motion.button>
          </div>

          {/* Secondary CTA */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-10 text-lg md:text-xl font-semibold flex flex-col gap-2 max-w-xl text-center mx-auto text-blue-500"
          >
            {hero.subHeadings2 && hero.subHeadings2.length > 0 ? (
    hero.subHeadings2.map((subHeading, index) => (
      <p key={index} className="text-lg md:text-xl font-medium mb-2">
        {subHeading}
      </p>
    ))
  ) : (
    <p className="text-gray-500">No subheadings available.</p>
  )}
          </motion.h2>
        </div>
      </div>
    </section>
  )
}

export default Hero



