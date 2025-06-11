// Section 4: Additional Feedback component
import { useEffect, useState, useCallback } from "react"
import { Client, Databases } from "appwrite"
import BufferAnimation from "../BufferAnimation"
const AdditionalFeedback = ({ formData, handleChange }) => {
  const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const client = new Client()
  .setEndpoint("https://appwrite.hivefinty.com/v1") // ✅ New Appwrite instance
  .setProject("68472e8400352e6aa1e2");              // ✅ New Project ID (phedaz)

  
    const databases = new Databases(client)
    const databaseId = "67913805000e2b223d80"
    const collectionId = "67fd2f4b0017a7badab2"
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
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold">4</div>
            <span>{data.Heading}</span>
          </div>
          <div className="text-sm text-gray-600 mt-2">{data.subHeading}</div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900 text-sm" htmlFor="challenges">
              {data.Challenges} <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm min-h-24 resize-y transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              id="challenges"
              name="challenges"
              placeholder="Tell us about your pain points..."
              value={formData.challenges} 
              onChange={handleChange}
              maxLength={200}
              required
            />
            <p className="text-xs text-gray-600 mt-1">Maximum 200 characters</p>
          </div>
  
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900 text-sm" htmlFor="questions">
              {data.Questions} (Optional)
            </label>
            <textarea
              className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm min-h-24 resize-y transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              id="questions"
              name="questions"
              placeholder="Ask us anything..."
              value={formData.questions}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
    )
  }
  
  export default AdditionalFeedback