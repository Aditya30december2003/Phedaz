import React from 'react'

// Section 5: Confirmation component
const Section5 = ({ formData, handleChange }) => {
    return (
      <div className="bg-white rounded-xl shadow-md mb-8 border border-gray-200 overflow-hidden">
        <div className="p-6 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold">5</div>
            <span>Confirmation</span>
          </div>
          <div className="text-sm text-gray-600 mt-2">Let us know your interest level</div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label className="block mb-4 font-medium text-gray-900">Ready for Early Access?</label>
            
            <div className="flex items-start mb-3">
              <input
                className="mr-2 mt-1"
                type="radio"
                id="ready-yes"
                name="ready"
                value="Yes"
                checked={formData.ready === "Yes"}
                onChange={handleChange}
              />
              <label className="text-sm text-gray-900" htmlFor="ready-yes">
                Yes
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
              />
              <label className="text-sm text-gray-900" htmlFor="ready-no">
                No, but add me to the waitlist and keep me posted on updates!
              </label>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Section5
