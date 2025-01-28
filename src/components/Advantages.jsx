"use client"

import { Client, Databases } from "appwrite"
import { useState, useEffect } from "react"
import { RxCross1 } from "react-icons/rx";

const Advantages = () => {
  const [selectedTab, setSelectedTab] = useState(null)
  const [advantages, setAdvantages] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredCard, setHoveredCard] = useState(null); // Track which card is hovered

  // Initialize Appwrite client
  const client = new Client()
  client.setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "67921b41001390a43aad"

  useEffect(() => {
    const fetchAdvantages = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId)
        setAdvantages(response.documents)
      } catch (error) {
        console.error("Failed to fetch advantages:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdvantages()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const handleTabClick = (index) => {
    setSelectedTab(selectedTab === index ? null : index)
  }
 
  return ( 
    <section className="py-16" id='advantages'> 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-[3rem] lg:text-[5rem] font-extrabold  text-gray-800 mb-4 text-center">{advantages[0]?.Title}</h1>
        <p className="text-gray-600 mb-12 text-[1.2rem] font-semibold text-center max-w-2xl mx-auto">{advantages[0]?.subTitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-[75%] h-full mx-auto">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className={`rounded-lg overflow-hidden bg-color text-white transition-all duration-300 shadow-xl border-teal-200 border-[0.1rem]`}
              onMouseEnter={() => setHoveredCard(index)} // Set hovered card index
              onMouseLeave={() => setHoveredCard(null)} // Reset hovered card index
            >
              <div className="p-6 flex flex-col items-center cursor-pointer hover:scale-105 duration-300">
                <div className="w-32 z-99 h-32 mb-6 overflow-hidden rounded-full border-4 border-gray-200">
                  <img
                    src={advantage.image || "/placeholder.svg"}
                    alt={advantage.title}
                    className="w-full h-full object-cover z-99 mx-auto"
                  />
                </div>
                <h2 className="text-xl font-semibold text-white mb-4 text-center">{advantage.Advantage}</h2>
                <button
                  onClick={() => handleTabClick(index)}
                  className={`bg-teal-400 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 outline-none transition-all duration-500 mix-blend-hard-light`}
                >
                  Learn More
                </button>
                <button
                  className={`${
                    index % 7 === 0
                      ? "bg-purple-900"
                      : index % 7 === 1
                      ? "bg-yellow-700"
                      : index % 7 === 2
                      ? "bg-red-700"
                      : index % 7 === 3
                      ? "bg-zinc-700"
                      : index % 7 === 4
                      ? "bg-blue-700"
                      : "bg-pink-700"
                  } text-white animate px-6 py-6 mt-5 mr-[70%] rounded-full text-sm font-medium transition-all duration-500 ${
                    hoveredCard === index ? "scale-[1.2]" : ""
                  }`}
                  onClick={() => handleTabClick(index)}
                ></button>
              </div>
              {selectedTab === index && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white h-[100%] rounded-lg p-8 max-w-md w-full m-4 transform transition-all duration-300 ease-in-out scale-95 hover:scale-100 shadow-lg shadow-gray-500/50">
                    {/* Close Button */}
                    <div className="flex justify-end mt-[-1rem] mb-3">
                      <button
                        className="bg-gray-200 text-gray-800 px-2 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                        onClick={() => setSelectedTab(null)}
                      >
                        <RxCross1 className="transform hover:rotate-90 duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50" />
                      </button>
                    </div>

                    {/* Image Section */}
                    <div className="h-[40%] mb-5">
                      <img
                        src={advantage.image}
                        alt="Advantage"
                        className="w-[100%] rounded-xl shadow-md h-[100%] object-cover transition-transform duration-300 ease-in-out transform hover:scale-105"
                      />
                    </div>

                    {/* Content Section */}
                    <div>
                      <h3 className="text-3xl font-semibold text-teal-900 mb-4 text-center tracking-wide">
                        {advantage.Advantage}
                      </h3>
                      <p className="text-blue-700 mb-6 text-md leading-relaxed text-center mt-5">
                        {advantage.Content}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Advantages
