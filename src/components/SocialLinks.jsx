import React from "react"
import { FaFacebook, FaLinkedin, FaTwitter, FaInstagram } from "react-icons/fa"

const SocialLinks = () => {
  const links = [
    {
      id: 1,
      icon: <FaFacebook />,
      url: "https://www.facebook.com",
      label: "Facebook",
    },
    {
      id: 2,
      icon: <FaLinkedin />,
      url: "https://www.linkedin.com",
      label: "LinkedIn",
    },
    {
      id: 3,
      icon: <FaTwitter />,
      url: "https://www.twitter.com",
      label: "Twitter",
    },
    {
      id: 4,
      icon: <FaInstagram />,
      url: "https://www.instagram.com",
      label: "Instagram",
    },
  ]

  return (
    <div className="flex space-x-4 justify-center">
      {links.map(({ id, icon, url, label }) => (
        <a
          key={id}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-500 text-2xl transition-colors"
          aria-label={label}
        >
          {icon}
        </a>
      ))}
    </div>
  )
}

export default SocialLinks

