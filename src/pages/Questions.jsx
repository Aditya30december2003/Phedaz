"use client"

import React, { useState } from 'react'
import Section1 from '../components/QuestionnaireSections/Section1'
import Section2 from '../components/QuestionnaireSections/Section2'
import Section3 from '../components/QuestionnaireSections/Section3'
import Section4 from '../components/QuestionnaireSections/Section4'
import Section5 from '../components/QuestionnaireSections/Section5'

const Questions = () => {
  const [currentStep, setCurrentStep] = useState(1)

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
        return { ...prev, [name]: [...currentValues, value] }
      } else {
        currentValues.splice(index, 1)
        return { ...prev, [name]: currentValues }
      }
    })
  }

  const handleSliderChange = (e) => {
    const value = Number.parseInt(e.target.value)
    setFormData((prev) => ({ ...prev, annualPlanLikelihood: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      console.log("Submitting form data:", formData);
      
      // Show loading state
      const submitButton = e.target.querySelector('button[type="submit"]');
      submitButton.innerText = "Submitting...";
      submitButton.disabled = true;
      
      const response = await fetch("/sendEmail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
      
      const text = await response.text();
      console.log("Raw response:", text);
      
      if (!text.trim()) {
        throw new Error("Server returned an empty response");
      }
      
      try {
        const result = JSON.parse(text);
        console.log("Parsed result:", result);
        
        if (result.success) {
          localStorage.setItem("submittedFormData", JSON.stringify(formData));
          window.location.href = "/thankyou";
        } else {
          throw new Error(result.message || "Form submission failed");
        }
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError);
        throw new Error(`Invalid response format: ${text.substring(0, 100)}...`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Error submitting form: ${error.message}\nPlease try again or contact support.`);
      
      const submitButton = e.target.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.innerText = "Submit Application";
        submitButton.disabled = false;
      }
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault(); // Prevent form submission
    setCurrentStep((prev) => prev + 1);
  };

  const goToPrevStep = (e) => {
    e.preventDefault(); // Prevent form submission
    setCurrentStep((prev) => prev - 1);
  };

  const renderSection = () => {
    switch (currentStep) {
      case 1:
        return <Section1 formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />
      case 2:
        return <Section2 formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} />
      case 3:
        return <Section3 formData={formData} handleChange={handleChange} handleSliderChange={handleSliderChange} />
      case 4:
        return <Section4 formData={formData} handleChange={handleChange} handleSliderChange={handleSliderChange}/>
      case 5:
        return <Section5 formData={formData} handleChange={handleChange} />
      default:
        return null
    }
  }

  const totalSteps = 5
  const progressPercent = (currentStep / totalSteps) * 100

  return (
    <div className="bg-gray-100 min-h-screen pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Phedaz Early Access</h1>
          <p className="text-lg text-gray-600 mt-2">Complete this questionnaire to join our early access program</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 h-3 rounded-full mb-10">
          <div
            className="bg-gray-900 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <form onSubmit={handleSubmit}>
          {renderSection()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={goToPrevStep}
                className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400"
              >
                Back
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={goToNextStep}
                className="bg-gray-900 text-white py-2 px-6 rounded-md hover:bg-gray-800 ml-auto"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-500 ml-auto"
              >
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Questions





