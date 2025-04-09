"use client"

import React, { useState } from 'react'
import Section1 from '../components/QuestionnaireSections/Section1'
import Section2 from '../components/QuestionnaireSections/Section2'
import Section3 from '../components/QuestionnaireSections/Section3'
import Section4 from '../components/QuestionnaireSections/Section4'
import Section5 from '../components/QuestionnaireSections/Section5'

const Questions = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    businessName: "",
    phone: "",
    country: "",
    socialHandles: [],
    businessStage: "",
    primaryFocus: [],
    otherPrimaryFocus: "",
    productDescription: "",
    features: [],
    currentManagement: "",
    proficiency: "",
    goals: [],
    otherGoal: "",
    pricingModel: "",
    priceRange: "",
    annualPlanLikelihood: 3,
    maxPrice: "",
    premiumInterest: "",
    challenges: "",
    questions: "",
    ready: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (name, value) => {
    setFormData((prev) => {
      const currentValues = [...prev[name]]
      const index = currentValues.indexOf(value)

      if (index === -1) {
        // Add value if not present
        return { ...prev, [name]: [...currentValues, value] }
      } else {
        // Remove value if already present
        currentValues.splice(index, 1)
        return { ...prev, [name]: currentValues }
      }
    })
  }

  const handleSliderChange = (e) => {
    const value = Number.parseInt(e.target.value)
    setFormData((prev) => ({ ...prev, annualPlanLikelihood: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitted data:", formData)
    alert("Form submitted successfully!")
  }

  return (
    <div className="bg-gray-100 min-h-screen pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Phedaz Early Access</h1>
          <div className="h-1 w-14 bg-gray-900 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 mt-2">Complete this questionnaire to join our early access program</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Section1 
            formData={formData} 
            handleChange={handleChange} 
            handleCheckboxChange={handleCheckboxChange} 
          />
          
          <Section2 
            formData={formData} 
            handleChange={handleChange} 
            handleCheckboxChange={handleCheckboxChange} 
          />
          
          <Section3 
            formData={formData} 
            handleChange={handleChange} 
            handleSliderChange={handleSliderChange} 
          />
          
          <Section4 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          <Section5 
            formData={formData} 
            handleChange={handleChange} 
          />

          <div className="flex justify-center mt-8">
            <button 
              type="submit" 
              className="bg-gray-900 text-white border-none rounded-md py-3.5 px-8 text-base font-medium cursor-pointer transition-colors hover:bg-gray-800"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Questions




