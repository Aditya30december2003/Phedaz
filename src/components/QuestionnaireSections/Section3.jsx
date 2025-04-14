// Section 3: Willingness to Pay component
import { Client, Databases } from "appwrite"
import { useEffect, useState, useCallback } from "react"
import BufferAnimation from "../BufferAnimation"
const PricingPreferences = ({ formData, handleChange, handleSliderChange }) => {
  const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const client = new Client().setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")
  
    const databases = new Databases(client)
    const databaseId = "67913805000e2b223d80"
    const collectionId = "67fd2cbe00127f5b71df"
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
    const pricingModels = data? [data.PriceModelOption1,	data.PriceModelOption2, data.PriceModelOption3]:[]
    const priceRanges = data
    ? [
        data.PriceRangeOption1,
        data.PriceRangeOption2,
        data.PriceRangeOption3,
        data.PriceRangeOption4,
        data.PriceRangeOption5,
        data.PriceRangeOption6,
      ].filter(Boolean)
    : [];
  
    const premiumInterestOptions = data
  ? [
      data.InterestOption1,
      data.InterestOption2,
      data.InterestOption3,
      data.InterestOption4,
    ].filter(Boolean)
  : [];


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
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold">3</div>
            <span>{data.Heading}</span>
          </div>
          <div className="text-sm text-gray-600 mt-2">{data.subHeading}</div>
        </div>
        
        <div className="p-6">
        <div className="mb-6">
  <label className="block mb-2 font-extrabold text-gray-900 text-sm">
  {data.PriceModel}
  </label>
  <select
    name="pricingModel"
    value={formData.pricingModel}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Select a pricing model</option>
    {pricingModels.map((model) => (
      <option key={model} value={model}>
        {model}
      </option>
    ))}
  </select>
</div>

  
<div className="mb-6">
  <label className="block mb-2 font-extrabold text-gray-900 text-sm">
    {data.PriceRange}
  </label>

  <select
    name="priceRange"
    value={formData.priceRange}
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Select a price range</option>
    {priceRanges.map((range) => (
      <option key={range} value={range}>
        {range}
      </option>
    ))}
  </select>

  {formData.priceRange === "Other" && (
    <input
      type="text"
      name="customPriceRange"
      value={formData.customPriceRange || ""}
      onChange={handleChange}
      placeholder="Please specify your price range"
      className="w-full mt-2 px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
    />
  )}
</div>


  
<div className="mb-6">
  <div className="flex justify-between">
    <label className="block mb-2 font-extrabold text-gray-900 text-sm">{data.PlanPrefrence}</label>
    <span className="text-sm font-medium">{formData.annualPlanLikelihood}/5</span>
  </div>

  <div className="mb-4">
    <input
      type="range"
      min="1"
      max="5"
      step="1"
      name="annualPlanLikelihood"
      value={formData.annualPlanLikelihood}
      onChange={handleSliderChange}
      className="w-full h-1 rounded-lg appearance-none bg-gray-200 transition-all duration-300 ease-in-out focus:outline-none slider-thumb"
    />
    <div className="flex justify-between text-xs text-gray-600 mt-2">
      <span>Less likely</span>
      <span>More likely</span>
    </div>
  </div>
</div>

          <div className="mb-6">
            <label className="block mb-2 font-extrabold text-gray-900 text-sm pl-2 " htmlFor="maxPrice">
              {data.MaxPrice}
            </label>
            <input
              className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              id="maxPrice"
              name="maxPrice"
              type="number"
              placeholder="Enter amount"
              value={formData.maxPrice}
              onChange={handleChange}
            />
            {/* <p className="text-xs text-gray-600 mt-1">What price would you consider too expensive?</p> */}
          </div>
  
          <div className="mb-6">
  <label className="block mb-2 font-extrabold text-gray-900 text-sm">
    {data.Interest}
  </label>

  <select
    name="premiumInterest"
    value={formData.premiumInterest} 
    onChange={handleChange}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">Select an option</option>
    {premiumInterestOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </select>
</div>

        </div>
      </div>
    )
  }
  
  export default PricingPreferences
