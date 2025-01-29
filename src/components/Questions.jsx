"use client"

import { Client, Databases } from "appwrite"
import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { IoIosArrowDown } from "react-icons/io"
import AOS from "aos"
import "aos/dist/aos.css"

function Faqs() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [faq, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)

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
    AOS.init({
      duration: 1000,
    })

    fetchFaqs()
  }, [fetchFaqs])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-[#E5F0F1] to-[#FFF5C3]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      </div>
    )
  }

  return (
    <section
      className="py-20 bg-gradient-to-br from-[#E5F0F1] to-[#FFF5C3] relative"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/12920835/pexels-photo-12920835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      id="faq"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#E5F0F1]/90 to-[#FFF5C3]/90"></div>
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {faq?.[0]?.Heading ? (
          <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-[#0A0A45]" data-aos="fade-up">
            {faq[0].Heading}
          </h2>
        ) : (
          <p className="text-center text-xl text-gray-600">No FAQs available</p>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {faq.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <button
                className="w-full text-left p-6 focus:outline-none transition duration-300 hover:bg-[#E5F0F1]"
                onClick={() => toggleFaq(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-[#0A0A45]">{item.question}</h3>
                  <motion.div animate={{ rotate: activeIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <IoIosArrowDown className="w-6 h-6 text-[#0A0A45]" />
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
                    <p className="px-6 pb-6 text-[#000000] leading-relaxed">{item.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faqs


