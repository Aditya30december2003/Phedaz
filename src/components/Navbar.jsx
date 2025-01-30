"use client"

import { useState, useEffect } from "react" 
import { Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X, Menu } from "lucide-react"
import Logo from '../assets/logo.png'
 
function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(null)

  const Home = [
    { name: "About", path: "#about" },
    { name: "Advantages", path: "#advantages" },
    { name: "Blogs", path: "#blog"},
    { name: "Capabilities", path: "#cap" },
    { name: "FAQS", path: "#faq" }, 
    { name: "Form", path: "#form" },
  ]

  const terms = [
    { name: "Cookie Policy", path: "legals" },
    { name: "Terms of Use", path: "/developer/sdks" },
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

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-2 lg:px-1">
        <div className="flex justify-between items-center h-20 w-full">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span
                className={`text-4xl font-bold transition-colors duration-300 mt-5 ${
                  isScrolled ? "text-gray-900" : "text-gray-900"
                }`}
              >
                {/* Phedaz */}
                <img src={Logo} alt="" className="w-[9rem] h-[9rem] md:w-[12rem] md:h-[12rem]"/>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Home Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("home")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to="/"
                className={`inline-flex items-center px-1 py-2 transition-colors duration-300 ${
                  isScrolled ? "text-gray-600 hover:text-gray-900" : "text-black font-extrabold hover:text-gray-900"
                }`}
              >
                Home
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
                    {Home.map((item) => (
                      <a
                        key={item.path}
                        href={`${item.path}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              to="/blogs"
              className={`transition-colors duration-300 ${
                isScrolled ? "text-gray-600 hover:text-gray-900" : "text-black font-extrabold hover:text-gray-900"
              }`}
            >
              Blogs
            </Link>

            {/* Legals Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("legals")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to="/legals"
                className={`inline-flex items-center px-1 py-2 transition-colors duration-300 ${
                  isScrolled ? "text-gray-600 hover:text-gray-900" : "text-black font-extrabold hover:text-gray-900"
                }`}
              >
                Legals
                {/* <ChevronDown className="ml-1 h-4 w-4" /> */}
              </Link>
              {/* <AnimatePresence>
                {activeDropdown === "legals" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute left-0 w-48 mt-2 bg-white rounded-lg shadow-lg"
                  >
                    {terms.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence> */}
            </div>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="#form"
              className={`transition-colors duration-300 ${
                isScrolled ? "text-gray-600 hover:text-gray-900" : "text-black font-extrabold hover:text-gray-900"
              }`}
            >
              Join Now
            </a>
            <a
              href="#cap"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors duration-300 ${
                isScrolled ? "text-white font-extrabold bg-gray-900 hover:bg-gray-800" : "text-gray-900 font-semibold bg-white hover:bg-gray-100"
              }`}
            >
              Get started
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
                <div>
                  <Link to='/'
                    onClick={() => toggleMobileDropdown("home")}
                    className="flex w-full items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Home
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

                {/* Blogs */}
                <Link
                  to="/blogs"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blogs
                </Link>

                {/* Legals Section with Dropdown */}
                <div>
                  <Link to='/legals'
                    onClick={() => toggleMobileDropdown("legals")}
                    className="flex w-full items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    Legals
                    {/* <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform duration-200 ${mobileActiveDropdown === "legals" ? "transform rotate-180" : ""}`}
                    /> */}
                  </Link>
                  {/* <AnimatePresence>
                    {mobileActiveDropdown === "legals" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="pl-4 space-y-1"
                      >
                        {terms.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            className="block px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence> */}
                </div>

                {/* Join Now & Get Started */}
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <a
                    href="#form"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Join Now
                  </a>
                  <a
                    href="#cap"
                    className="block px-3 py-2 mt-1 rounded-md text-base font-medium text-white bg-yellow-400 hover:bg-gray-800"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Get started
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

