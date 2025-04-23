import { useEffect, useState, useCallback } from "react"
import { Client, Databases } from "appwrite"
import BufferAnimation from "../BufferAnimation"

const ContactDetails = ({ formData, handleChange, handleCheckboxChange }) => {
    const [socialHandles, setSocialHandles] = useState(
        formData.socialHandles && formData.socialHandles.length > 0 
            ? formData.socialHandles 
            : [""]
    )

    const handleLinkChange = (index, value) => {
        const updatedHandles = [...socialHandles]
        updatedHandles[index] = value
        setSocialHandles(updatedHandles)
        handleChange({ target: { name: "socialHandles", value: updatedHandles } })
    }

    const addLink = () => {
        if (socialHandles.length < 2) {
            const newHandles = [...socialHandles, ""]
            setSocialHandles(newHandles)
            handleChange({ target: { name: "socialHandles", value: newHandles } })
        }
    }

    const removeLink = (index) => {
        const updatedHandles = socialHandles.filter((_, i) => i !== index)
        setSocialHandles(updatedHandles)
        handleChange({ target: { name: "socialHandles", value: updatedHandles } })
    }

    const [countries, setCountries] = useState([])

    useEffect(() => {
        // Static list of all countries with priority countries first
        const staticCountries = [
            // Priority countries first
            "United Kingdom", "Canada", "United States",
            // All other countries alphabetically
            "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda",
            "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain",
            "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
            "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
            "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Central African Republic",
            "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)",
            "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia", "Denmark", "Djibouti", "Dominica",
            "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea",
            "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia",
            "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau",
            "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq",
            "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
            "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
            "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
            "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico",
            "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
            "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua",
            "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
            "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
            "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
            "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
            "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
            "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia",
            "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan",
            "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania",
            "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
            "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
            "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
            "Yemen", "Zambia", "Zimbabwe"
        ];
        
        // Set the static countries list directly
        setCountries(staticCountries);
        
        // No API call needed - we're using static data
    }, []);

    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const client = new Client()
        .setEndpoint("https://centralapps.hivefinty.com/v1")
        .setProject("67912e8e000459a70dab")

    const databases = new Databases(client)
    const databaseId = "67913805000e2b223d80"
    const collectionId = "67fd1b92001363fa6f0e"
    
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

    const businessStages = data
        ? [data.StageOption1, data.StageOption2, data.StageOption3]
        : []

    const businessFocusOptions = data
        ? [data.FocusOption1, data.FocusOption2, data.FocusOption3, data.FocusOption4]
        : []

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E5F0F1] to-[#FFF5C3] text-gray-800">
                <BufferAnimation size={90} color="#0A0A45" />
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-md mb-8 border border-gray-200 overflow-hidden">
            <div className="p-6 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-3 text-xl font-semibold text-gray-900">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white font-semibold">1</div>
                    <span>{data.Heading}</span>
                </div>
                <div className="text-sm text-gray-600 mt-2">{data.setHeading}</div>
            </div>
            
            <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-900 text-sm">
                            {data.Name} <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
                            name="name"
                            placeholder="Your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-900 text-sm">
                            {data.email} <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                        <label className="block mb-2 font-extrabold text-gray-900 text-sm">
                            {data.businessName} <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
                            name="businessName"
                            placeholder="Your business name"
                            value={formData.businessName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-900 text-sm">
                            {data.Phone} <span className="text-red-500">*</span>
                        </label>
                        <input
                            className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
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
                        <label className="block mb-2 font-medium text-gray-900 text-sm">
                            {data.Country} <span className="text-red-500">*</span>
                        </label>
                        <select
                            className="w-full cursor-pointer px-3 py-3 pr-10 rounded-md border border-gray-200 text-sm bg-white appearance-none bg-no-repeat bg-[length:20px_18px] bg-[center_right_0.75rem] focus:outline-none focus:ring-2 focus:ring-gray-900"
                            style={{
                                backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='none' stroke='%231A1A2E' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M6 9l6 6 6-6'></path></svg>\")",
                            }}
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select your country</option>
                            {countries.map((country) => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-900 text-sm">
                            {data.Links} <span className="text-red-500">*</span>
                        </label>
                        {socialHandles.map((handle, index) => (
                            <div key={index} className="relative mb-3">
                                <input
                                    type="url"
                                    className="w-full pr-10 px-3 py-3 rounded-md border border-gray-200 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
                                    placeholder="https://socialmedia.com/yourbusiness"
                                    value={handle}
                                    onChange={(e) => handleLinkChange(index, e.target.value)}
                                    required={index === 0}
                                />
                                {socialHandles.length > 1 && (
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
                        {socialHandles.length < 2 && (
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
                    <label className="block mb-2 font-medium text-gray-900 text-sm">
                        {data.Stage} <span className="text-red-500">*</span>
                    </label>
                    <select
                        className="w-full cursor-pointer px-3 py-3 pr-10 rounded-md border border-gray-200 text-sm bg-white appearance-none bg-no-repeat bg-[length:20px_18px] bg-[center_right_0.75rem] focus:outline-none focus:ring-2 focus:ring-gray-900"
                        style={{
                            backgroundImage: "url(\"data:image/svg+xml;utf8,<svg fill='none' stroke='%231A1A2E' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path d='M6 9l6 6 6-6'></path></svg>\")",
                        }}
                        name="businessStage"
                        value={formData.businessStage}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select business stage</option>
                        {businessStages.map((stage) => (
                            <option key={stage} value={stage}>
                                {stage}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 text-gray-900 text-sm font-extrabold">
                        Primary Business Focus <span className="text-red-500">*</span>
                    </label>
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
                                    required
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block mb-2 font-extrabold text-gray-900 text-sm">
                        {data.Describe} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        className="w-full px-3 py-3 rounded-md border border-gray-200 text-sm min-h-24 resize-y transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900"
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