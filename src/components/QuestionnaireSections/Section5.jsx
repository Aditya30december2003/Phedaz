import { useEffect, useState, useCallback } from "react"
import { Client, Databases } from "appwrite"
import BufferAnimation from "../BufferAnimation"

// Section 5: Confirmation component
const Section5 = ({ formData, handleChange }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const client = new Client().setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "67fd31060021f6d871be"
  
  const fetchAboutData = useCallback(async () => {
    try {
      const response = await databases.listDocuments(databaseId, collectionId)
      setData(response.documents[0])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }, [databases])
  
  useEffect(() => {
    fetchAboutData()
  }, [fetchAboutData])

  if (loading) {
    return (
      <div
        id="about"
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E5F0F1] to-[#FFF5C3] text-gray-800"
      >
        <BufferAnimation size={90} color="#0A0A45" />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-md mb-8 border border-gray-200 overflow-hidden">
      <div className="p-6 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3 text-xl font-semibold text-gray-900">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold">5</div>
          <span>{data.Heading}</span>
        </div>
        <div className="text-sm text-gray-600 mt-2">{data.subHeading}</div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <label className="block mb-4 font-medium text-gray-900">
            {data.EarlyAccess} <span className="text-red-500">*</span>
          </label>
          
          <div className="flex items-start mb-3">
            <input
              className="mr-2 mt-1"
              type="radio"
              id="ready-yes"
              name="ready"
              value="Yes"
              checked={formData.ready === "Yes"}
              onChange={handleChange}
              required
            />
            <label className="text-sm text-gray-900" htmlFor="ready-yes">
              {data.EarlyOption1}
            </label>
          </div>
          
          <div className="flex items-start mb-2">
            <input
              className="mr-2 mt-1"
              type="radio"
              id="ready-no"
              name="ready"
              value="No"
              checked={formData.ready === "No"}
              onChange={handleChange}
              required
            />
            <label className="text-sm text-gray-900" htmlFor="ready-no">
              {data.EarlyOption2}
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Section5