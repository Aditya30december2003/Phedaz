"use client"
import { Client, Databases } from "appwrite";
import { useState, useEffect } from "react" 
import { Link , useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X, Menu } from "lucide-react"
import BufferAnimation from "./BufferAnimation";
import CountrySelector from "./CountrySelector"; // Import the new component

function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null)
  const [nav , setNav] = useState(null)
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const Home = [
    { name: "Advantages", path: "#advantages" },
    { name: "Blogs", path: "#blog"},
    {name :"Join Waitlist" , path:"#form"},
    {name:"Beta Access" , path:"#form"}
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
    setMobileActiveDropdown(null)
  }

  const toggleMobileDropdown = (dropdown) => {
    setMobileActiveDropdown(mobileActiveDropdown === dropdown ? null : dropdown)
  }

const client = new Client()
  .setEndpoint("https://appwrite.hivefinty.com/v1") // ✅ New Appwrite instance
  .setProject("68472e8400352e6aa1e2");              // ✅ New Project ID (phedaz)


  const databases = new Databases(client);
  const databaseId = "67913805000e2b223d80";
  const collectionId = "679b98e700072462edaa";

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId);
        setNav(response.documents[0]);
      } catch (error) {
        console.error("Failed to fetch recent blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [databases, databaseId, collectionId]);

  if (loading) {
    return <div>
      <BufferAnimation/>
    </div>;
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="mx-auto px-2 sm:px-2 lg:px-1">
        <div className="flex justify-between items-center h-24 w-[97%] xl:w-[95%] mx-auto">
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer">
          {location.pathname === '/'? (
             <a href="#home" className="flex items-center space-x-2">
             <span
               className={`text-4xl pt-5  font-bold flex flex-col items-center transition-colors duration-300 mt-2 ${
                 isScrolled ? "text-gray-900" : "text-gray-900"
               }`}
             >
               {/* Phedaz */}
               <img src={nav.logo} alt="" className="w-[8rem] h-[2rem] md:w-[10rem] lg:w-[12rem] md:h-[3rem]"/>
               <span className="text-[0.6rem] md:text-[0.6rem] lg:text-[0.8rem]">{nav.tagline}</span>
             </span>
           </a>
          ) : (<Link to="/" className="flex items-center space-x-2">
          <span
            className={`text-4xl pt-5  font-bold flex flex-col items-center transition-colors duration-300 mt-2 ${
              isScrolled ? "text-gray-900" : "text-gray-900"
            }`}
          >
            {/* Phedaz */}
            <img src={nav.logo} alt="" className="w-[8rem] h-[2rem] md:w-[10rem] lg:w-[12rem] md:h-[3rem]"/>
            <span className="text-[0.6rem] md:text-[0.6rem] lg:text-[0.8rem]">{nav.tagline}</span>
          </span>
        </Link>)}
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* about Dropdown */}

            <Link
              to="/"
              className={`transition-colors duration-300 ${
                isScrolled ? "text-gray-600 hover:text-gray-900" : "text-black font-extrabold hover:text-gray-900"
              }`}
            >
              {nav.nav1}
            </Link>


            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("home")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to="#"
                className={`inline-flex items-center px-1 py-2 transition-colors duration-300 ${
                  isScrolled ? "text-gray-600 hover:text-gray-900" : "text-black font-extrabold hover:text-gray-900"
                }`}
              >
                {nav.nav2}
                <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
              <AnimatePresence>
  {activeDropdown === "home" && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute left-0 w-48 mt-2 rounded-lg shadow-lg bg-white"
    >
      {nav.aboutDropDown.map((label, index) => (
        <a
          key={index} // Using index as key since there are no unique IDs
          href={`#${nav.dropDownPath[index]}`} // Matching the path using index
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          {label} {/* Display text */}
        </a>
      ))}
    </motion.div>
  )}
</AnimatePresence>


            </div>

            {/* Legals Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("legals")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <a
                href="#cap"
                className={`inline-flex items-center px-1 py-2 transition-colors duration-300 ${
                  isScrolled ? "text-gray-600 hover:text-gray-900" : "text-black font-extrabold hover:text-gray-900"
                }`}
              >
                {nav.nav3}
                {/* <ChevronDown className="ml-1 h-4 w-4" /> */}
              </a>
                 
            </div>
            <a
                href="#faq"
                className={`inline-flex items-center px-3  py-2 text-white rounded-[3rem] transition-colors duration-300 bg-gray-900 ${
                  isScrolled ? "text-gray-600 hover:text-yellow=100" : "text-black font-extrabold hover:text-yellow-100"
                }`}
              >
                {nav.nav4}
                {/* <ChevronDown className="ml-1 h-4 w-4" /> */}
              </a>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#form"
              className={`transition-colors duration-300 ${
                isScrolled ? "text-gray-600 hover:text-gray-900" : "text-black font-extrabold hover:text-gray-900"
              }`}
            >
             {nav.nav5}
            </a>
            <a
              href="/questionnaire"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors duration-300 ${
                isScrolled ? "text-white font-extrabold bg-gray-900 hover:bg-gray-800" : "text-gray-900 font-semibold bg-white hover:bg-gray-100"
              }`}
            >
             {nav.nav6}
            </a>
            
            {/* Add Country Selector */}
            <CountrySelector />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Add Country Selector for mobile */}
            <CountrySelector />
            
            <button
              onClick={toggleMobileMenu}
              className={`inline-flex items-center justify-center p-2 rounded-md transition-colors duration-300 ${
                isScrolled ? "text-gray-600 hover:text-gray-900 hover:bg-gray-900" : "text-black hover:text-gray-900"
              }`}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Toggle menu</span>
              {isMobileMenuOpen ? <X className="h-10 w-10" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white "
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {/* Home Section with Dropdown */}
                <Link
                  to="/"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {nav.nav1}
                </Link>
                <div>
                  <Link to='#about'
                    onClick={() => toggleMobileDropdown("home")}
                    className="flex w-full items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {nav.nav2}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${mobileActiveDropdown === "home" ? "transform rotate-180" : ""}`}
                    />
                  </Link>
                  <AnimatePresence>
                    {mobileActiveDropdown === "home" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 space-y-1"
                      >
                        {Home.map((item) => (
                          <a
                            key={item.path}
                            href={item.path}
                            className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </a>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <a href='#cap'
                    onClick={() => toggleMobileDropdown("legals")}
                    className="flex w-full items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {nav.nav3}
                  </a>

                {/* Legals Section with Dropdown */}
                <div>
                  <a href='#faq'
                    onClick={() => toggleMobileDropdown("legals")}
                    className="flex w-full items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {nav.nav4}
                  </a>
                </div>

                {/* Join Now & Get Started */}
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <a
                    href="#form"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {nav.nav5}
                  </a>
                  <a
                    href="/questionnaire"
                    className="block px-3 py-2 mt-1 rounded-md text-base font-medium text-white bg-yellow-400 hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {nav.nav6}
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
