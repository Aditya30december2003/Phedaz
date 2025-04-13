import { useEffect, useState } from "react"
import { IoIosArrowDropdown } from "react-icons/io";

// Section 1: Contact & Basic Details component
const ContactDetails = ({ formData, handleChange, handleCheckboxChange }) => {
    const [socialLinks, setSocialLinks] = useState(formData.socialLinks || [""])

  const handleLinkChange = (index, value) => {
    const updatedLinks = [...socialLinks]
    updatedLinks[index] = value
    setSocialLinks(updatedLinks)
    handleChange({ target: { name: "socialLinks", value: updatedLinks } })
  }

  const addLink = () => {
    if (socialLinks.length < 2) {
      setSocialLinks([...socialLinks, ""])
    }
  }

  const removeLink = (index) => {
    const updatedLinks = socialLinks.filter((_, i) => i !== index)
    setSocialLinks(updatedLinks)
    handleChange({ target: { name: "socialLinks", value: updatedLinks } })
  }

  
 const [countries , setCountries]=useState([])
 useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        // Sort country names alphabetically
        const countryNames = data.map((country) => country.name.common).sort();
        setCountries(countryNames);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
  
    fetchCountries();
  }, []);
  

  const businessStages = ["Pre-launch", "Newly Launched", "Established"]
  const businessFocusOptions = [
    "E-commerce (physical products)",
    "Digital Products or Services",
    "Consulting / Professional Services",
    "Others",
  ]

  return (
    <div className="bg-white rounded-xl shadow-md mb-8 border border-gray-200 overflow-hidden">
      <div className="p-6 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3 text-xl font-semibold text-gray-900">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold">1</div>
          <span>Contact & Basic Details</span>
        </div>
        <div className="text-sm text-gray-600 mt-2">Tell us about yourself and your business</div>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900 text-sm" htmlFor="name">
              Full Name
            </label>
            <input
              className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              id="name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900 text-sm" htmlFor="email">
              Email Address
            </label>
            <input
              className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900 text-sm" htmlFor="businessName">
              Business Name
            </label>
            <input
              className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              id="businessName"
              name="businessName"
              placeholder="Your business name"
              value={formData.businessName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-900 text-sm" htmlFor="phone">
              Phone Number
            </label>
            <input
              className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              id="phone"
              name="phone"
              type="tel"
              placeholder="+44 123 456 7890"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
        <div className="mb-6 relative">
  <label
    className="block mb-2 font-medium text-gray-900 text-sm"
    htmlFor="country"
  >
    Country
  </label>
  <select
    className="w-full cursor-pointer px-3 py-3 pr-10 rounded-md border border-gray-200 text-sm bg-white appearance-none bg-no-repeat bg-[length:20px_18px] bg-[center_right_0.75rem] focus:outline-none focus:ring-2 focus:ring-gray-900"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg fill='none' stroke='%231A1A2E' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M6 9l6 6 6-6'></path></svg>\")",
    }}
    id="country"
    name="country"
    value={formData.country}
    onChange={handleChange}
    required
  >
    <option value="">Select your country</option>
    {countries.map((country) => (
      <option key={country} value={country} className="cursor-pointer">
        {country}
      </option>
    ))}
  </select>
</div>

<div className="mb-6">
        <label className="block mb-2 font-medium text-gray-900 text-sm">
          Social Media Links
        </label>
        {socialLinks.map((link, index) => (
          <div key={index} className="relative mb-3">
            <input
              type="url"
              className="w-full pr-10 px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="https://socialmedia.com/yourbusiness"
              value={link}
              onChange={(e) => handleLinkChange(index, e.target.value)}
              required={index === 0}
            />
            {socialLinks.length > 1 && (
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600"
                onClick={() => removeLink(index)}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {socialLinks.length < 2 && (
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline"
            onClick={addLink}
          >
            + Add another link
          </button>
        )}
      </div>

        </div>

        <div className="mb-6">
        <select
  className="w-full cursor-pointer px-3 py-3 pr-10 rounded-md border border-gray-200 text-sm bg-white appearance-none bg-no-repeat bg-[length:20px_18px] bg-[center_right_0.75rem] focus:outline-none focus:ring-2 focus:ring-gray-900"
  style={{
    backgroundImage:
      "url(\"data:image/svg+xml;utf8,<svg fill='none' stroke='%231A1A2E' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M6 9l6 6 6-6'></path></svg>\")",
  }}
  id="businessStage"
  name="businessStage"
  value={formData.businessStage}
  onChange={handleChange}
  required
>
            <option value="">Select your business stage</option>
            {businessStages.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
  <label className="block mb-2 text-gray-900 text-sm font-extrabold">Primary Business Focus</label>
  <div className="grid md:grid-cols-2 gap-4">
    {businessFocusOptions.map((option) => (
      <div key={option} className="flex items-start mb-2">
        <input
          className="mr-2 mt-1"
          type="checkbox"
          id={`focus-${option}`}
          checked={formData.primaryFocus.includes(option)}
          onChange={() => handleCheckboxChange("primaryFocus", option)}
        />
        <label className="text-sm text-gray-900" htmlFor={`focus-${option}`}>
          {option}
        </label>
      </div>
    ))}

    {/* Show input box when "Other" is selected */}
    {formData.primaryFocus.includes("Others") && (
      <div className="col-span-2">
        <input
          type="text"
          placeholder="Please specify your business focus"
          value={formData.otherPrimaryFocus || ""}
          onChange={(e) =>
            handleChange({
              target: {
                name: "otherPrimaryFocus",
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


        <div className="mb-6">
          <label className="block mb-2 font-extrabold text-gray-900 text-sm" htmlFor="productDescription">
            Describe your product/service briefly
          </label>
          <textarea
            className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm min-h-24 resize-y transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
            id="productDescription"
            name="productDescription"
            placeholder="Tell us about what you offer..."
            value={formData.productDescription}
            onChange={handleChange}
            required
          />
        </div>
      </div>
    </div>
  )
}

export default ContactDetails
