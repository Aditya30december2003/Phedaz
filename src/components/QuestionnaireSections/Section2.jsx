// Section 2: Usage & Feature Preferences component
const FeaturePreferences = ({ formData, handleChange, handleCheckboxChange }) => {
    const featuresOptions = [
      "Setting up a legal structure (incorporation)",
      "No-code / Low-code website building",
      "Managing inventory or stock levels",
      "Integrating multiple sales channels",
      "Payment processing",
      "Global Banking and Currency Support",
      "Analytics and reporting",
      "Other",
    ]
    
    const goalsOptions = [
      "Launch a new online store quickly",
      "Simplify existing operations and reduce costs",
      "Expand sales channels or go global",
      "Streamline payment and banking processes",
      "Other",
    ]
  
    return (
      <div className="bg-white rounded-xl shadow-md mb-8 border border-gray-200 overflow-hidden">
        <div className="p-6 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3 text-xl font-semibold text-gray-900">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold">2</div>
            <span>Usage & Feature Preferences</span>
          </div>
          <div className="text-sm text-gray-600 mt-2">Help us understand your needs and preferences</div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900 text-sm">Which features are you most excited about?</label>
            <div className="grid md:grid-cols-2 gap-4">
              {featuresOptions.map((feature) => (
                <div key={feature} className="flex items-start mb-2">
                  <input
                    className="mr-2 mt-1"
                    type="checkbox"
                    id={`feature-${feature}`}
                    checked={formData.features.includes(feature)}
                    onChange={() => handleCheckboxChange("features", feature)}
                  />
                  <label className="text-sm text-gray-900" htmlFor={`feature-${feature}`}>
                    {feature}
                  </label>
                </div>
              ))}
            </div>
          </div>
  
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900 text-sm" htmlFor="currentManagement">
              How do you currently manage these tasks?(e.g. website building, inventory, payments)?
            </label>
            <textarea
              className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm min-h-24 resize-y transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              id="currentManagement"
              name="currentManagement"
              placeholder="Using separate tools,  Hiring contractors, Doing it manually...."
              value={formData.currentManagement}
              onChange={handleChange}
              required
            />
          </div>
  
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900 text-sm">Technical Proficiency</label>
            {["Beginner (no coding or tech background)", "Intermediate (comfortable with some tools)", "Advanced (coding or tech-savvy)"].map((level) => (
              <div key={level} className="flex items-start mb-2">
                <input
                  className="mr-2 mt-1"
                  type="radio"
                  id={`proficiency-${level}`}
                  name="proficiency"
                  value={level}
                  checked={formData.proficiency === level}
                  onChange={handleChange}
                />
                <label className="text-sm text-gray-900" htmlFor={`proficiency-${level}`}>
                  {level}
                </label>
              </div>
            ))}
          </div>
  
          <div className="mb-6">
  <label className="block mb-2 font-medium text-gray-900 text-sm">Your Goals</label>
  <div className="grid grid-cols-1 gap-4">
    {goalsOptions.map((goal) => (
      <div key={goal} className="flex items-start mb-2">
        <input
          className="mr-2 mt-1"
          type="checkbox"
          id={`goal-${goal}`}
          checked={formData.goals.includes(goal)}
          onChange={() => handleCheckboxChange("goals", goal)}
        />
        <label className="text-sm text-gray-900" htmlFor={`goal-${goal}`}>
          {goal}
        </label>
      </div>
    ))}

    {/* If "Other" is selected, show input field */}
    {formData.goals.includes("Other") && (
      <div>
        <input
          type="text"
          placeholder="Please specify your goal"
          value={formData.otherGoal || ""}
          onChange={(e) =>
            handleChange({
              target: {
                name: "otherGoal",
                value: e.target.value,
              },
            })
          }
          className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
      </div>
    )}
  </div>
</div>

        </div>
      </div>
    )
  }
  
  export default FeaturePreferences
