"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useCallback } from "react"
import { Client, Databases } from "appwrite"
import NewTestComponent from "./NewTestComponent"
import BufferAnimation from "./BufferAnimation"
import AOS from "aos"
import "aos/dist/aos.css"

function About() {
  const [aboutData, setAboutData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Appwrite setup
  const client = new Client().setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "6794d613002b2a8ae385"

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    })
  }, [])

  // Fetch data from Appwrite
  const fetchAboutData = useCallback(async () => {
    try {
      const response = await databases.listDocuments(databaseId, collectionId)
      setAboutData(response.documents[0])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }, [databases])

  useEffect(() => {
    fetchAboutData()
  }, [fetchAboutData])

  // Show loading state
  if (loading) {
    return (
      <div
        id="about"
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 text-gray-800"
      >
        <BufferAnimation size={90} color="#008080" />
      </div>
    )
  }

  if (!aboutData) {
    return <p className="text-center text-xl text-gray-600">No data available</p>
  }

  return (
    <div className="bg-gradient-to-b from-teal-50 to-white" id="about">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2  data-aos="fade-up"
                  data-aos-delay='200' className="text-[1.5rem] font-extrabold text-teal-600 mb-4">{aboutData.subHeading}</h2>
            <div className="bg-teal-600 w-[20rem] h-1 mx-auto mb-5"></div>
            <h3 className="text-4xl text-gray-800 font-bold mb-8">{aboutData.Heading}</h3>
          </div>

          <div className="oscillating-card-container" data-aos="fade-up" data-aos-delay="200">
            <div className="wire"></div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed px-6 py-10 bg-white rounded-lg shadow-2xl"
            >
              {aboutData.Content.map((content, index) => (
                <p
                  key={index}
                  className="text-md md:text-xl font-medium italic border-l-4 border-teal-500 pl-4 py-2"
                  data-aos="fade-up"
                  data-aos-delay={`${(index + 1) * 100}`}
                >
                  {content}
                </p>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 text-center"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <button  data-aos="fade-up"
                  data-aos-delay='200' className="px-8 py-3 bg-teal-600 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-teal-700 transition duration-300 transform hover:scale-105">
              Join Waitlist
            </button>
          </motion.div>
        </div>
      </section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="p-3"
        data-aos="fade-up"
        data-aos-delay="800"
      >
        <NewTestComponent />
      </motion.div>

      <style jsx>{`
        .oscillating-card-container {
          position: relative;
          width: 100%;
          max-width: 64rem; /* 4xl in rem */
          margin: 0 auto 2rem;
          padding-top: 50px; /* Space for the wire */
        }
        .wire {
          position: absolute;
          top: 0;
          left: 50%;
          width: 2px;
          height: 50px;
          background-color: #008080;
          transform-origin: top center;
        }
        .card {
          transform-origin: top center;
          animation: swing 3s ease-in-out infinite;
        }
        @keyframes swing {
          0%, 100% { transform: rotate(2deg); }
          50% { transform: rotate(-2deg); }
        }
      `}</style>
    </div>
  )
}

export default About

