"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Client, Databases } from "appwrite"
import BufferAnimation from "./BufferAnimation"
import { TypeAnimation } from "react-type-animation"
import AOS from "aos"
import "aos/dist/aos.css"

function Hero() {
  const [hero, setHero] = useState({ Heading: "", bgVideo: "", CompanyName: "", subHeadings: [], subHeadings2: [] })
  const [loading, setLoading] = useState(true)

  // Appwrite setup
  const client = new Client().setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "6794cdcd00126d8487ea"

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    })
  }, [])

  // Fetch data from Appwrite
  const fetchHome = useCallback(async () => {
    try {
      const response = await databases.listDocuments(databaseId, collectionId)
      setHero(response.documents[0] || { Heading: "", bgVideo: "", CompanyName: "", subHeadings: [], subHeadings2: [] })
    } catch (error) {
      console.error("Failed to fetch home data:", error)
    } finally {
      setLoading(false)
    }
  }, [databases])

  useEffect(() => {
    fetchHome()
  }, [fetchHome])

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 text-gray-800">
        <BufferAnimation size={90} color="white" />
      </div>
    )
  }

  return (
    <section className="relative min-h-screen pt-[3rem] lg:pt-[5rem] bg-gradient-to-br from-teal-50 to-teal-100 text-gray-800">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {hero.bgVideo && (
          <video src={hero.bgVideo} loop autoPlay muted playsInline className="object-cover w-full h-full opacity-20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-teal-100 opacity-90"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-16 flex flex-col justify-center items-center min-h-screen text-center">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-7xl font-bold mb-6 leading-tight text-gray-900 mt-14"
          data-aos="fade-down"
        >
          {hero.Heading} <span className="text-teal-600">{hero.CompanyName}</span>
        </motion.h1>

        {/* Animated Subtext */}
        <div
          className="bg-white w-[96%] lg:w-[70%] h-[27rem] rounded-lg mt-5 shadow-xl"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="text-[1.2rem] md:text-[2.8rem] mt-10 text2 font-extrabold h-20">
            <TypeAnimation
              sequence={[...hero.subHeadings.flatMap((heading) => [heading, 1000]), () => {}]}
              wrapper="span"
              speed={200}
              style={{ display: "inline-block" }}
              repeat={Number.POSITIVE_INFINITY}
            />
          </div>

          {/* CTA Buttons */}
          <div
            className="mt-8 flex flex-col md:flex-row gap-4 justify-center items-center py-5"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <a href="#form" className="w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-full font-semibold text-lg shadow-lg hover:from-teal-700 hover:to-teal-600 transition duration-300"
              >
                Join Our Waitlist
              </motion.button>
            </a>
            <a href="#about" className="w-full md:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full md:w-auto px-8 py-4 bg-white text-teal-600 rounded-full font-semibold text-lg shadow-lg hover:bg-teal-50 transition duration-300 border-2 border-teal-200"
              >
                Learn More
              </motion.button>
            </a>
          </div>

          {/* Secondary CTA */}
          <div
            className="mt-10 text-lg md:text-xl font-semibold flex flex-col gap-2 max-w-xl text-center mx-auto"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            {hero.subHeadings2 && hero.subHeadings2.length > 0 ? (
              hero.subHeadings2.map((subHeading, index) => (
                <p key={index} className="text-xl md:text-[1.5rem] font-medium bg-teal-700 text-white p-2 ">
                  {subHeading}
                </p>
              ))
            ) : (
              <p className="text-gray-500">No subheadings available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero



