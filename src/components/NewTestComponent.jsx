import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSpring, animated } from "@react-spring/web"
import { gsap } from "gsap"
import { Client, Databases } from "appwrite"
import BufferAnimation from "./BufferAnimation"

const SetGoalsComponent = () => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeOption, setActiveOption] = useState(null)
  const contentRef = useRef(null)

  const handleOptionClick = (option) => {
    setActiveOption(option)
  }

  const springProps = useSpring({
    opacity: 1,
    transform: "translateY(0)",
  })

  useEffect(() => {
    if (activeOption) {
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 50, 
        duration: 0.5,
        ease: "power3.out",
      })
    }
  }, [activeOption])

  const client = new Client()
  client.setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "67929788001778f27074"

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
        <BufferAnimation/>
      </div>
    )
  }

  return (
    <div className="relative text2  p-4 bg-white">
      <div className="flex flex-col lg:flex-row h-full rounded-md overflow-hidden shadow-2xl">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full lg:w-64 shadow-lg p-4 lg:p-5 flex flex-col space-y-10 bg-green-100"
        >
          <div className="my-auto flex flex-row lg:flex-col justify-between h-[80%]">
            {options.map(({ id, icon }) => (
              <motion.button
                key={id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-colors duration-200 ${
                  activeOption === id ? "bg-green-200 text" : "text hover:bg-green-50"
                }`}
                onClick={() => handleOptionClick(id)}
              >
                <img src={icon || "/placeholder.svg"} alt="" className="rounded-[100%] w-[3rem] lg:w-[4rem] mx-auto" />
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
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 text-transparent bg-clip-text">
              Set Your Goals
            </h1>
            {/* <p className="text-blue-600 max-w-xl">Click on the icons to explore various options and set your goals!</p> */}
          </motion.div>

          <AnimatePresence>
            {options.map(
              ({ id, title, description, image }) =>
                activeOption === id && (
                  <animated.div key={id} style={springProps} ref={contentRef} className="mt-8 lg:mt-12">
                    <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                      <motion.img
                        src={image}
                        alt={id}
                        className="w-full lg:w-1/2 rounded-lg shadow-lg"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                      <motion.div
                        className="text-center lg:text-left"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <h2 className="text-2xl font-semibold mb-4 text">{title}</h2>
                        <p className="text">{description}</p>
                      </motion.div>
                    </div>
                  </animated.div>
                ),
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default SetGoalsComponent
