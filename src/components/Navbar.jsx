import React from "react"
import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 ">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Logo
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link to="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/blog" className="hover:text-gray-300">
              Blog
            </Link>
          </li>
          <li>
            <Link to="/terms" className="hover:text-gray-300">
              Terms Page
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
