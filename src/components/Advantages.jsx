"use client"

import { Client, Databases } from "appwrite"
import { useState, useEffect } from "react"

const Advantages = () => {
  const [selectedTab, setSelectedTab] = useState(null)
  const [advantages, setAdvantages] = useState([])
  const [loading, setLoading] = useState(true)

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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4 text-center">{advantages[0]?.Title}</h1>
        <p className="text-gray-600 mb-12 text-center max-w-2xl mx-auto">{advantages[0]?.subTitle}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl"
            >
              <div className="p-6 flex flex-col items-center">
                <div className="w-32 h-32 mb-6 overflow-hidden rounded-full border-4 border-gray-200">
                  <img
                    src={advantage.image || "/placeholder.svg"}
                    alt={advantage.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">{advantage.title}</h2>
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={() => handleTabClick(index)}
                >
                  Learn More
                </button>
              </div>
              {selectedTab === index && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                  <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
                  <div>
                    <img src={advantage.image} alt="" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">{advantage.Advantage}</h3>
                    <p className="text-gray-600 mb-6">{advantage.Content}</p>
                  </div>
                    <div className="flex justify-end">
                      <button
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
                        onClick={() => setSelectedTab(null)}
                      >
                        Close
                      </button>
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


