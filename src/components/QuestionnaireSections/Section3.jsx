import { Client, Databases } from "appwrite"
import { useEffect, useState, useCallback } from "react"
import BufferAnimation from "../BufferAnimation"

const PricingPreferences = ({ formData, handleChange, handleSliderChange }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sliderValue, setSliderValue] = useState(formData.annualPlanLikelihood || 3)
  const [sliderTouched, setSliderTouched] = useState(false)
  
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

  useEffect(() => {
    setSliderValue(formData.annualPlanLikelihood || 3)
  }, [formData.annualPlanLikelihood])

  const handleSliderValueChange = (e) => {
    const value = parseInt(e.target.value, 10)
    setSliderValue(value)
    setSliderTouched(true)
    
    // Use the original handleSliderChange passed from the parent
    handleSliderChange(e)
  }

  const handleMaxPriceChange = (e) => {
    // Ensure the value is not reduced by 1
    const value = e.target.value;
  
  // Create a custom event to pass to the parent handler
  const customEvent = {
    target: {
      name: 'maxPrice',
      value: value
    }
  };
  
  // Call the parent handler with our modified event
  handleChange(customEvent);
  }

  const pricingModels = data ? [data.PriceModelOption1, data.PriceModelOption2, data.PriceModelOption3] : []
  
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

  // Calculate slider label positions
  const sliderLabels = [
    { value: 1, label: "Very unlikely" },
    { value: 2, label: "Unlikely" },
    { value: 3, label: "Neutral" },
    { value: 4, label: "Likely" },
    { value: 5, label: "Very likely" }
  ]

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
            {data.PriceModel} <span className="text-red-500">*</span>
          </label>
          <select
            name="pricingModel"
            value={formData.pricingModel}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
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
            {data.PriceRange} <span className="text-red-500">*</span>
          </label>
          <select
            name="priceRange"
            value={formData.priceRange}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
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
              required
            />
          )}
        </div>

        {/* <div className="mb-6">
  {/* <label className="block mb-2 font-extrabold text-gray-900 text-sm">
    {data.MaxPrice}
  </label> */}
  {/* <div className="relative">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <span className="text-gray-500">$</span>
    </div>
    <input
      className="w-full px-3 py-3 pl-8 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
      id="maxPrice"
      name="maxPrice"
      type="text" // Changed from "number" to "text"
      inputMode="numeric" // Better for mobile numeric keyboards
      pattern="[0-9]*" // Ensures only numbers are entered
      placeholder="Enter amount"
      value={formData.maxPrice || ''} // Ensure it's never undefined
      onChange={handleMaxPriceChange}
    />
  </div> */}
{/* </div> */} 


        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block font-extrabold text-gray-900 text-sm">
              {data.PlanPrefrence} <span className="text-red-500">*</span>
            </label>
            <div className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full">
              {sliderLabels.find(item => item.value === sliderValue)?.label || "Select preference"}
            </div>
          </div>

          <div className="mb-4 relative">
            {/* Improved slider with better touch targets */}
            <div className="relative mb-6 pt-6">
              {/* Background track */}
              <div className="w-full h-2 rounded-full bg-gray-200 absolute top-8"></div>

              {/* Slider circles for better UI/indicators */}
              <div className="flex justify-between absolute w-full top-7">
                {[1, 2, 3, 4, 5].map(num => (
                  <div 
                    key={num}
                    className={`h-4 w-4 rounded-full border-2 border-gray-300 cursor-pointer 
                    ${sliderValue >= num ? 'bg-blue-500 border-blue-600' : 'bg-white'}`}
                    onClick={() => {
                      const fakeEvent = { 
                        target: { name: 'annualPlanLikelihood', value: num } 
                      };
                      handleSliderValueChange(fakeEvent);
                    }}
                  ></div>
                ))}
              </div>

              {/* The actual slider (invisible but functional) */}
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                name="annualPlanLikelihood"
                value={sliderValue}
                onChange={handleSliderValueChange}
                className="w-full h-10 opacity-0 cursor-pointer absolute top-4 z-10"
                required
              />
            </div>


            {/* Labels */}
            <div className="flex justify-between text-xs text-gray-600 mt-2 px-1">
              {sliderLabels.map(item => (
                <div 
                  key={item.value} 
                  className={`text-center cursor-pointer transition-colors duration-200 ${
                    sliderValue === item.value ? 'text-blue-600 font-medium' : ''
                  }`}
                  onClick={() => {
                    const fakeEvent = { 
                      target: { name: 'annualPlanLikelihood', value: item.value } 
                    };
                    handleSliderValueChange(fakeEvent);
                  }}
                >
                  {item.value}
                </div>
              ))}
            </div>
          </div>
          
          {!sliderTouched && (
            <p className="text-sm text-red-500 mb-2">Please indicate your preference</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-extrabold text-gray-900 text-sm">
            {data.MaxPrice}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              className="w-full px-3 py-3 pl-8 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              id="maxPrice"
              name="maxPrice"
              type="number"
              min="0"
              step="1"
              placeholder="Enter amount"
              value={formData.maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-extrabold text-gray-900 text-sm">
            {data.Interest} <span className="text-red-500">*</span>
          </label>
          <select
            name="premiumInterest"
            value={formData.premiumInterest}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
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
