"use client"

import { Client, Databases } from "appwrite"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IoIosArrowDown } from "react-icons/io"
import AOS from "aos"
import "aos/dist/aos.css"

function Faqs() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("General") // Default tab

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const client = new Client()
  client.setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "679339b70039819b7c44"

  const fetchFaqs = useCallback(async () => {
    try {
      const response = await databases.listDocuments(databaseId, collectionId)
      setFaqs(response.documents)
    } catch (error) {
      console.error("Failed to fetch FAQs:", error)
    } finally {
      setLoading(false)
    }
  }, [databases])

  useEffect(() => {
    AOS.init({ duration: 1000})
    fetchFaqs()
  }, [fetchFaqs])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#E5F0F1] to-[#FFF5C3]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#0A0A45]"></div>
      </div>
    )
  }

  // Filter FAQs based on selected tab
  const filteredFaqs = faqs.filter((faq) => faq.type === activeTab)

  return (
    <section
      className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#E5F0F1] to-[#FFF5C3] relative"
      style={{
        backgroundImage:
          "url('https://images.pexels.com/photos/12920835/pexels-photo-12920835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      id="faq"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#E5F0F1]/90 to-[#FFF5C3]/90"></div>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 text-center text-[#0A0A45]"
          data-aos="fade-up"
        >
          Frequently Asked Questions
        </h2>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8 sm:mb-10 space-x-2 sm:space-x-4 md:space-x-6">
          {["General", "Setting Up", "Security"].map((tab) => (
            <button
              key={tab}
              className={`px-3 sm:px-4 md:px-6 py-2 font-medium text-sm sm:text-base md:text-lg border-b-2 mb-2 ${
                activeTab === tab ? "border-red-500 text-red-500" : "border-transparent text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* FAQ Content */}
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <button
                  className="w-full text-left p-4 sm:p-5 md:p-6 focus:outline-none transition duration-300 hover:bg-[#E5F0F1]"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#0A0A45] pr-4">{item.question}</h3>
                    <motion.div
                      animate={{ rotate: activeIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <IoIosArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-[#0A0A45]" />
                    </motion.div>
                  </div>
                </button>
                <AnimatePresence>
                  {activeIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 text-[#000000] text-sm sm:text-base leading-relaxed">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <p className="text-center text-lg sm:text-xl text-gray-600">No FAQs available for {activeTab}</p>
          )}
        </div>
      </div>
    </section>
  )
}

export default Faqs

