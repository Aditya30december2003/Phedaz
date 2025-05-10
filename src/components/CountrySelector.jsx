"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"

function CountrySelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState("Global") // Default selected
  const [detectedCountry, setDetectedCountry] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const countries = [
    { name: "Global", code: "global", flag: "https://static.vecteezy.com/system/resources/previews/021/657/609/non_2x/green-earth-planet-free-png.png", comingSoon: false, link: 'https://phedaz.com/' },
    { name: "United Kingdom", code: "uk", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Flag_of_the_United_Kingdom.png/1200px-Flag_of_the_United_Kingdom.png", comingSoon: false, link: 'https://phedaz.co.uk/' },
    { name: "Nigeria", code: "ng", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Flag_of_Nigeria.svg/1280px-Flag_of_Nigeria.svg.png", comingSoon: false, link: 'https://phedaz.ng/' },
    { name: "South Africa", code: "za", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Flag_of_South_Africa.svg/2560px-Flag_of_South_Africa.svg.png", comingSoon: true, link: '' },
  ]

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const selectCountry = (country) => {
    if (!country.comingSoon) {
      setSelectedCountry(country.name)
      // Store user's selection in localStorage to remember preference
      localStorage.setItem('preferredCountry', country.name)
    }
    setIsOpen(false)
  }

  const redirectToCountry = (country) => {
    if (!country.comingSoon && country.link) {
      window.location.href = country.link
    }
  }

  // Get the user's country by IP on component mount
  useEffect(() => {
    const fetchUserCountry = async () => {
      setIsLoading(true)
      try {
        // Check if we already have a stored preference
        const storedPreference = localStorage.getItem('preferredCountry')
        if (storedPreference) {
          setSelectedCountry(storedPreference)
          setIsLoading(false)
          return
        }

        // If no stored preference, detect location
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        
        if (data && data.country_name) {
          // Map API country name to our list
          let matchedCountry = null
          
          if (data.country_code === 'NG') matchedCountry = countries.find(c => c.code === 'ng')
          else if (data.country_code === 'GB') matchedCountry = countries.find(c => c.code === 'uk')
          else if (data.country_code === 'ZA') matchedCountry = countries.find(c => c.code === 'za')
          
          // If there's a match and it's not coming soon
          if (matchedCountry && !matchedCountry.comingSoon) {
            setDetectedCountry(matchedCountry)
            
            // Check if we're already on the correct domain
            const currentDomain = window.location.hostname
            const targetDomain = new URL(matchedCountry.link).hostname
            
            if (currentDomain !== targetDomain) {
              setShowPrompt(true)
            } else {
              // Already on correct domain, just update selected
              setSelectedCountry(matchedCountry.name)
            }
          }
        }
      } catch (error) {
        console.error("Error detecting location:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserCountry()
  }, [])

  // Find the currently selected country object
  const currentCountry = countries.find((country) => country.name === selectedCountry) || countries[0]

  return (
    <div className="relative">
      {showPrompt && detectedCountry && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-xs">
          <p className="mb-2">We detected you're from <strong>{detectedCountry.name}</strong>. Would you like to visit our {detectedCountry.name} site?</p>
          <div className="flex justify-between">
            <button 
              className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              onClick={() => {
                redirectToCountry(detectedCountry)
                setShowPrompt(false)
              }}
            >
              Yes, please
            </button>
            <button 
              className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => {
                localStorage.setItem('preferredCountry', 'Global')
                setShowPrompt(false)
              }}
            >
              No, thanks
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleDropdown}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e2d9f3] hover:bg-[#d9cef0] transition-colors duration-200"
        aria-label={`Select region: currently ${selectedCountry}`}
      >
        {isLoading ? (
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white overflow-hidden">
            <img
              src={currentCountry.flag || "/placeholder.svg"}
              alt={`${currentCountry.name} flag`}
              className="w-6 h-6 object-cover rounded-full"
            />
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 top-12 z-50 w-72 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-0">
                {countries.map((country) => (
                  <Link to={country.link}
                    key={country.code}
                    className={`flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${country.comingSoon ? 'opacity-70' : ''}`}
                    onClick={(e) => {
                      if (country.comingSoon) {
                        e.preventDefault();
                      } else {
                        selectCountry(country);
                      }
                    }}
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e2d9f3] mr-3 overflow-hidden">
                      <img
                        src={country.flag || "/placeholder.svg"}
                        alt={`${country.name} flag`}
                        className="w-7 h-7 object-cover rounded-full"
                      />
                    </div>
                    <span className="font-medium">{country.name}</span>
                    {country.comingSoon && (
                      <span className="mx-auto text-xs font-medium p-1 border border-purple-200 rounded-full text-purple-800">
                        Coming Soon
                      </span>
                    )}
                    {selectedCountry === country.name && (
                      <span className="ml-auto">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7 10L9 12L13 8" stroke="#6B46C1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CountrySelector