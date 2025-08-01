// Section 2: Usage & Feature Preferences component
import { Client, Databases } from "appwrite"
import { useEffect, useState, useCallback } from "react"
import BufferAnimation from "../BufferAnimation"

const FeaturePreferences = ({ formData, handleChange, handleCheckboxChange }) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const client = new Client().setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "67fd27590001da234927"

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

  const featuresOptions = data
    ? [
        data.featureOption1,
        data.featureOption2,
        data.featureOption3,
        data.featureOption4,
        data.featureOption5,
        data.featureOption6,
        data.featureOption9,
        data.featureOption10,
        // "Other", // Add the "Other" option
      ]
    : [];

  const goalsOptions = data
    ? [
        data.GoalOption1,
        data.GoalOption2,
        data.GoalOption3,
        data.GoalOption4,
        // data.GoalOption5,
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
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold">2</div>
          <span>{data.Heading}</span>
        </div>
        <div className="text-sm text-gray-600 mt-2">{data.subHeading}</div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <label className="block mb-2 font-extrabold text-gray-900 text-sm">
            {data.feature} <span className="text-red-500">*</span>
          </label>
          <div className="grid md:grid-cols-2 gap-4">
          {featuresOptions.map((feature) => (
  <div key={feature} className="flex items-start mb-2">
    <input
      className="mr-2 mt-1"
      type="checkbox"
      id={`feature-${feature}`}
      checked={formData.features.includes(feature)}
      onChange={() => handleCheckboxChange("features", feature)}
      required={formData.features.length === 0}
    />
    <label className="text-sm text-gray-900" htmlFor={`feature-${feature}`}>
      {feature}
    </label>
  </div>
))}

{/* Show input if "Other" is selected */}
{formData.features.includes("Other") && (
  <div className="mt-2">
    <input
      type="text"
      placeholder="Please specify the feature"
      value={formData.otherFeature}
      onChange={(e) =>
        handleChange({
          target: {
            name: "otherFeature",
            value: e.target.value,
          },
        })
      }
      className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
      required
    />
  </div>
)}

          </div>
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-extrabold text-gray-900 text-sm" htmlFor="currentManagement">
            {data.CurrentManage} <span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm min-h-24 resize-y transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
            id="currentManagement"
            name="currentManagement"
            value={formData.currentManagement}
            onChange={handleChange}
            required
            placeholder="Using separate tools, Hiring contractors, Doing it manually..... "
          />
        </div>

        <div className="mb-7">
          <label className="block mb-2 font-extrabold text-gray-900 text-sm">
            {data.Proficiency} <span className="text-red-500">*</span>
          </label>
          <select
            name="proficiency"
            value={formData.proficiency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select your level</option>
            <option value="Beginner (no coding or tech background)">{data.ProficiencyOption1}</option>
            <option value="Intermediate (comfortable with some tools)">{data.ProficiencyOption2}</option>
            <option value="Advanced (coding or tech-savvy)">{data.ProficiencyOption3}</option>
          </select>
        </div>

  <div className="mb-6">
  <label className="block mb-2 font-extrabold text-gray-900 text-sm">
    {data.Goals} <span className="text-red-500">*</span>
  </label>

  <select
    name="goals"
    value={formData.goals[0] || ""}
    onChange={(e) => {
      const value = e.target.value
      handleCheckboxChange("goals", value) // Use the same logic to update array
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
    required
  >
    <option value="">Select your goal</option>
    {goalsOptions.map((goal) => (
      <option key={goal} value={goal}>
        {goal}
      </option>
    ))}
    <option value="Other">Other</option>
  </select>

  {/* If "Other" is selected, show input field */}
  {formData.goals.includes("Other") && (
    <div className="mt-3">
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
        required
      />
    </div>
  )}
</div>

      </div>
    </div>
  )
}

export default FeaturePreferences