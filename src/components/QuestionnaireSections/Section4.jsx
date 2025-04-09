// Section 4: Additional Feedback component
const AdditionalFeedback = ({ formData, handleChange }) => {
    return (
      <div className="bg-white rounded-xl shadow-md mb-8 border border-gray-200 overflow-hidden">
        <div className="p-6 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold">4</div>
            <span>Additional Feedback</span>
          </div>
          <div className="text-sm text-gray-600 mt-2">Share your thoughts and questions with us</div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900 text-sm" htmlFor="challenges">
              What challenges do you hope this platform solves?
            </label>
            <textarea
              className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm min-h-24 resize-y transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              id="challenges"
              name="challenges"
              placeholder="Tell us about your pain points..."
              value={formData.challenges}
              onChange={handleChange}
              maxLength={200}
            />
            <p className="text-xs text-gray-600 mt-1">Maximum 200 characters</p>
          </div>
  
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900 text-sm" htmlFor="questions">
              Any specific questions or requests?
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