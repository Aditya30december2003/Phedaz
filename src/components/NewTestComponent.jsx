import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSpring, animated } from "@react-spring/web"
import { gsap } from "gsap"
import { Client, Databases } from "appwrite"
import BufferAnimation from "./BufferAnimation"
import AOS from "aos"
import "aos/dist/aos.css"

const SetGoalsComponent = () => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeOption, setActiveOption] = useState(null)
  const contentRef = useRef(null)

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 1000,
    })
  }, [])

  const handleOptionClick = (option) => {
    setActiveOption(option)
  }

  const springProps = useSpring({
    opacity: 1,
    transform: "translateY(0)",
    from: { opacity: 0, transform: "translateY(50px)" }
  })

  useEffect(() => {
    if (activeOption && contentRef.current) {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power3.out",
      })
    }
  }, [activeOption])

  // Appwrite setup
  const client = new Client()
  client.setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "67929788001778f27074"

  // Fetch data from Appwrite
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId)
        setOptions(response.documents)
        if (response.documents.length > 0) {
          setActiveOption(response.documents[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch options:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[2rem] lg:h-screen">
        <BufferAnimation color="#0A0A45" size={60} />
      </div>
    )
  }

  return (
    <div className="relative p-4 bg-gradient-to-b from-[#E5F0F1] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row h-full rounded-xl overflow-hidden shadow-2xl bg-white">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full lg:w-64 shadow-lg p-4 lg:p-5 flex flex-col space-y-10 bg-[#E5F0F1]"
          >
            <div className="my-auto flex flex-row lg:flex-col justify-between h-[80%]">
              {options.map(({ id, icon }) => (
                <motion.button
                  key={id}
                  // whileHover={{ scale: 1.05 }}
                  // whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-colors duration-200 ${
                    activeOption === id 
                      ? "bg-[#0A0A45] text-white" 
                      : "text-[#0A0A45] hover:bg-[#FFF5C3]"
                  }`}
                  onClick={() => handleOptionClick(id)}
                  data-aos="zoom-in"
                  data-aos-delay="400"
                >
                  <img 
                    src={icon || "/placeholder.svg"} 
                    alt="" 
                    className="rounded-[100%] w-[3rem] lg:w-[4rem] mx-auto object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-grow bg-white rounded-lg lg:rounded-r-3xl p-4 lg:p-8 lg:py-12 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center text-center space-y-4 lg:space-y-8"
            >
              <h1 
                data-aos="zoom-in"
                data-aos-delay="600" 
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#282a4e] to-[#f2eda0] text-transparent bg-clip-text"
              >
                Set Your Goals
              </h1>
              <div className="w-24 h-1 bg-[#0A0A45] rounded-full"></div>
            </motion.div>

            <AnimatePresence mode="wait">
              {options.map(
                ({ id, title, description, image }) =>
                  activeOption === id && (
                    <animated.div 
                      key={id} 
                      style={springProps} 
                      ref={contentRef} 
                      className="mt-8 lg:mt-12"
                    >
                      <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                        <motion.img
                          src={image}
                          alt={title}
                          className="w-full lg:w-1/2 rounded-lg shadow-lg object-cover"
                          data-aos="zoom-in"
                          data-aos-delay="600"
                        />
                        <motion.div className="text-center lg:text-left">
                          <h2 
                            data-aos="zoom-in"
                            data-aos-delay="600" 
                            className="text-2xl font-semibold mb-4 text-[#0A0A45]"
                          >
                            {title}
                          </h2>
                          <p 
                            data-aos="zoom-in"
                            data-aos-delay="600" 
                            className="text-gray-700 leading-relaxed"
                          >
                            {description}
                          </p>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-6 px-8 py-3 bg-[#0A0A45] text-white rounded-full font-semibold 
                                     shadow-lg hover:bg-[#0A0A45]/90 transition-all duration-300"
                            data-aos="fade-up"
                            data-aos-delay="800"
                          >
                            Learn More
                          </motion.button>
                        </motion.div>
                      </div>
                    </animated.div>
                  )
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default SetGoalsComponent