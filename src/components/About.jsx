import React from "react"
import Image from '../assets/about-image.webp'
function About() {
  return (
    <section className="py-12 bg-green-600">
      <div className="container mx-auto px-4">
        {/* Text Content */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Scalable Unified Ecosystem
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Get to know our platform
          </p>
          <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">
            Welcome to the future of business management. Our all-in-one
            platform streamlines every step of your journey—from swift business
            incorporation to building stunning no-code or low-code websites,
            managing inventory, integrating multi-channel sales, processing
            payments, and accessing global banking facilities. Each feature is
            carefully designed to simplify operations and fuel your growth. Join
            our waitlist today and be among the first to experience the power of
            truly unified business solutions.
          </p>
          <p className="text-gray-700 mt-4 leading-relaxed max-w-4xl mx-auto">
            Whether you're launching your first online store or looking to scale
            an established brand, our platform provides the tools and solutions
            you need so you can focus on what you do best.
          </p>
          <div><button>Join Waitlist</button></div>
        </div>

        {/* Image Section */}
        <div className="flex justify-center">
          <img
            src={Image} // Replace with actual image URL
            alt="Scalable Unified Ecosystem"
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  )
}

export default About

