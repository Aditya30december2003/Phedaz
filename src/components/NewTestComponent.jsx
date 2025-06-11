import { useState, useEffect } from "react"
import { Client, Databases } from "appwrite"
import BufferAnimation from "./BufferAnimation"
import AOS from "aos"
import "aos/dist/aos.css"

const SetGoalsComponent = () => {
  const [options, setOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeOption, setActiveOption] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 500, // Reduced from 1000 to 500 for snappier animations
    })
  }, [])

  const handleOptionClick = (optionId) => {
    if (optionId === activeOption || isTransitioning) return;
    
    setIsTransitioning(true);
    // Reduced timeout to 50ms for faster transition
    setActiveOption(optionId);
    // Use requestAnimationFrame for smoother transition
    requestAnimationFrame(() => {
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    });
  }

  useEffect(() => {
    const client = new Client()
  .setEndpoint("https://appwrite.hivefinty.com/v1") // ✅ New Appwrite instance
  .setProject("68472e8400352e6aa1e2");              // ✅ New Project ID (phedaz)


    const databases = new Databases(client)
    const databaseId = "67913805000e2b223d80"
    const collectionId = "67929788001778f27074"

    const fetchOptions = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId)
        setOptions(response.documents)
        if (response.documents.length > 0) {
          setActiveOption(response.documents[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch options:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[2rem] lg:h-screen">
        <BufferAnimation color="#0A0A45" size={60} />
      </div>
    )
  }

  return (
    <div className="relative p-4 bg-gradient-to-b from-[#E5F0F1] to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row h-full rounded-xl overflow-hidden shadow-2xl bg-white">
          {/* Sidebar */}
          <div className="w-full lg:w-64 shadow-lg p-4 lg:p-5 flex flex-col space-y-10 bg-[#E5F0F1]">
            <div className="my-auto flex flex-row lg:flex-col justify-between h-[80%]">
              {options.map(({ id, icon }) => (
                <button
                  key={id}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-150 ${
                    activeOption === id ? "bg-[#0A0A45] text-white" : "text-[#0A0A45] hover:bg-[#FFF5C3]"
                  }`}
                  onClick={() => handleOptionClick(id)}
                  data-aos="fade-right"
                  data-aos-delay="100"
                >
                  <img
                    src={icon || "/placeholder.svg"}
                    alt=""
                    className="rounded-[100%] w-[3rem] lg:w-[4rem] mx-auto object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow bg-white lg:h-screen xl:h-[40rem] rounded-lg lg:rounded-r-3xl p-4 lg:p-8 lg:py-12 overflow-hidden">
            <div className="flex flex-col items-center text-center space-y-4 lg:space-y-8">
              <h1
                data-aos="fade-up"
                data-aos-delay="50"
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-[#282a4e] to-[#f2eda0] text-transparent bg-clip-text"
              >
                Set Your Goals
              </h1>
              <div className="w-24 h-1 bg-[#0A0A45] rounded-full" data-aos="fade-up" data-aos-delay="100"></div>
            </div>

            <div className="relative w-full overflow-hidden">
              {options.map(
                ({ id, title, description, image }) =>
                  activeOption === id && (
                    <div 
                      key={id} 
                      className="mt-8 lg:mt-12"
                    >
                      <div className="flex flex-col lg:flex-row items-center space-y-6 lg:space-y-0 lg:space-x-8">
                        <div 
                          className={`w-full lg:w-1/2 transition-all duration-150 ease-in-out ${
                            isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
                          }`}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={title}
                            className="w-full rounded-lg shadow-lg h-[10rem] lg:h-[20rem] object-cover"
                          />
                        </div>
                        <div 
                          className={`w-full lg:w-1/2 text-center lg:text-left transition-all duration-150 ease-in-out ${
                            isTransitioning ? 'opacity-0 transform translate-x-4' : 'opacity-100 transform translate-x-0'
                          }`}
                        >
                          <h2 className="text-2xl font-semibold mb-4 text-[#0A0A45]">
                            {title}
                          </h2>
                          <p className="text-gray-700 leading-relaxed">
                            {description}
                          </p>
                          <button
                            className="mt-6 px-8 py-3 bg-[#0A0A45] text-white rounded-full font-semibold 
                                     shadow-lg hover:bg-[#0A0A45]/90 transition-all duration-200"
                          >
                            <a href="#faq">Learn More</a>
                          </button>
                        </div>
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetGoalsComponent
