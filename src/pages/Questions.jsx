// "use client"

// import { useState, useEffect } from 'react'
// import Section1 from '../components/QuestionnaireSections/Section1'
// import Section2 from '../components/QuestionnaireSections/Section2'
// import Section3 from '../components/QuestionnaireSections/Section3'
// import Section4 from '../components/QuestionnaireSections/Section4'
// import Section5 from '../components/QuestionnaireSections/Section5'

// const Questions = () => {
//   const [currentStep, setCurrentStep] = useState(1)
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     businessName: "",
//     phone: "",
//     country: "",
//     socialHandles: [],
//     businessStage: "",
//     primaryFocus: [],
//     otherPrimaryFocus: "",
//     productDescription: "",
//     features: [],
//     currentManagement: "",
//     proficiency: "",
//     goals: [],
//     otherGoal: "",
//     pricingModel: "",
//     priceRange: "",
//     annualPlanLikelihood: 3,
//     maxPrice: "",
//     premiumInterest: "",
//     challenges: "",
//     questions: "",
//     ready: "",
//   })

//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     const script = document.createElement("script")
//     script.src = "https://www.google.com/recaptcha/api.js"
//     script.async = true
//     script.defer = true
//     document.body.appendChild(script)
//   }, [])

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//   }

//   const handleCheckboxChange = (name, value) => {
//     setFormData((prev) => {
//       const currentValues = [...prev[name]]
//       const index = currentValues.indexOf(value)
//       if (index === -1) {
//         return { ...prev, [name]: [...currentValues, value] }
//       } else {
//         currentValues.splice(index, 1)
//         return { ...prev, [name]: currentValues }
//       }
//     })
//   }

//   const handleSliderChange = (e) => {
//     const value = Number.parseInt(e.target.value)
//     setFormData((prev) => ({ ...prev, annualPlanLikelihood: value }))
//   }

//   const validateForm = () => {
//     const newErrors = {}
//     const requiredFields = [
//       "name", "email", "businessName", "phone", "country", "businessStage",
//       "primaryFocus", "productDescription", "features", "currentManagement",
//       "proficiency", "goals", "pricingModel", "priceRange", "maxPrice", 
//       "premiumInterest", "challenges", "questions", "ready"
//     ];

//     requiredFields.forEach((field) => {
//       if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
//         newErrors[field] = "This field is required.";
//       }
//     });

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const submitButton = e.target.querySelector('button[type="submit"]');
//     submitButton.innerText = "Submitting...";
//     submitButton.disabled = true;

//     // Validate before submission
//     if (!validateForm()) {
//       submitButton.innerText = "Submit Application";
//       submitButton.disabled = false;
//       alert("Please fill out all required fields in the form before submitting.");
//       // Alternatively, you could highlight the empty fields or show a more elegant error message
//       return;
//     }

//     try {
//       // Make sure reCAPTCHA is initialized and available
//       if (!window.grecaptcha) {
//         throw new Error("reCAPTCHA not loaded. Please refresh the page.");
//       }

//       const recaptchaToken = window.grecaptcha.getResponse();
//       if (!recaptchaToken) {
//         alert("Please complete the CAPTCHA verification.");
//         submitButton.innerText = "Submit Application";
//         submitButton.disabled = false;
//         return;
//       }

//       const dataToSend = {
//         ...formData,
//         "g-recaptcha-response": recaptchaToken,
//       };

//       const mailData = { ...formData };

//       console.log("Sending data:", dataToSend); // For debugging

//       const response = await fetch("/sendEmail.php", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(mailData),
//       });

//       const rawText = await response.text();
//       console.log("Raw response:", rawText);
      
//       if (!response.ok) {
//         throw new Error(`Server returned ${response.status}: ${response.statusText}`);
//       }

//       if (!rawText.trim()) {
//         throw new Error("Server returned an empty response");
//       }

//       try {
//         const result = JSON.parse(rawText);
//         if (result.success) {
//           localStorage.setItem("submittedFormData", JSON.stringify(formData));
//           window.location.href = "/thankyou";
//         } else {
//           throw new Error(result.message || "Form submission failed");
//         }
//       } catch (parseError) {
//         console.error("JSON Parse Error:", parseError);
//         throw new Error(`Invalid server response: ${rawText.substring(0, 100)}...`);
//       }
//     } catch (error) {
//       console.error("Form submission error:", error);
//       alert(`Error submitting form: ${error.message}\nPlease try again or contact support.`);
//     } finally {
//       if (submitButton) {
//         submitButton.innerText = "Submit Application";
//         submitButton.disabled = false;
//       }
//       if (window.grecaptcha) {
//         window.grecaptcha.reset();
//       }
//     }
//   };

//   const goToNextStep = (e) => {
//     e.preventDefault()
//     setCurrentStep((prev) => prev + 1)
//   }

//   const goToPrevStep = (e) => {
//     e.preventDefault()
//     setCurrentStep((prev) => prev - 1)
//   }

//   const renderSection = () => {
//     switch (currentStep) {
//       case 1:
//         return <Section1 formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} errors={errors} />
//       case 2:
//         return <Section2 formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} errors={errors} />
//       case 3:
//         return <Section3 formData={formData} handleChange={handleChange} handleSliderChange={handleSliderChange} errors={errors} />
//       case 4:
//         return <Section4 formData={formData} handleChange={handleChange} handleSliderChange={handleSliderChange} errors={errors} />
//       case 5:
//         return <Section5 formData={formData} handleChange={handleChange} errors={errors} />
//       default:
//         return null
//     }
//   }

//   const totalSteps = 5
//   const progressPercent = (currentStep / totalSteps) * 100

//   return (
//     <div className="min-h-screen pt-36 pb-16">
//       <div className="max-w-4xl mx-auto px-4">
//         <div className="text-center mb-10">
//           <h1 className="text-3xl font-bold text-gray-900">Phedaz Early Access</h1>
//           <p className="text-lg text-gray-600 mt-2">Complete this questionnaire to join our early access program</p>
//         </div>

//         {/* Progress Bar */}
//         <div className="w-full bg-gray-300 h-3 rounded-full mb-10">
//           <div
//             className="bg-gray-900 h-3 rounded-full transition-all duration-300"
//             style={{ width: `${progressPercent}%` }}
//           ></div>
//         </div>

//         <form onSubmit={handleSubmit}>
//           {renderSection()}

//           {/* reCAPTCHA Box */}
//           <div className="g-recaptcha mt-6" data-sitekey="6LdB1BYrAAAAAHtbnisd7EBpAerJiD53lVrM2dpz"></div>

//           <div className="flex justify-between mt-8">
//             {currentStep > 1 && (
//               <button
//                 type="button"
//                 onClick={goToPrevStep}
//                 className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400"
//               >
//                 Back
//               </button>
//             )}

//             {currentStep < totalSteps ? (
//               <button
//                 type="button"
//                 onClick={goToNextStep}
//                 className="bg-gray-900 text-white py-2 px-6 rounded-md hover:bg-gray-800 ml-auto"
//               >
//                 Next
//               </button>
//             ) : (
//               <button
//                 type="submit"
//                 className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-500 ml-auto"
//               >
//                 Submit Application
//               </button>
//             )}
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Questions

"use client"

import { useState, useEffect , useCallback, useRef } from 'react'
import Section1 from '../components/QuestionnaireSections/Section1'
import Section2 from '../components/QuestionnaireSections/Section2'
import Section3 from '../components/QuestionnaireSections/Section3'
import Section4 from '../components/QuestionnaireSections/Section4'
import Section5 from '../components/QuestionnaireSections/Section5'
import { Client, Databases } from "appwrite"
import BufferAnimation from "../components/BufferAnimation"
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

  const [errors, setErrors] = useState({});
  const recaptchaRef = useRef(null);
  const [recaptchaReady, setRecaptchaReady] = useState(false);

    // Add this useEffect for reCAPTCHA initialization
    useEffect(() => {
      const checkRecaptcha = () => {
        if (window.grecaptcha && recaptchaRef.current) {
          try {
            // Clear any existing widget
            if (recaptchaRef.current.childNodes.length > 0) {
              recaptchaRef.current.innerHTML = '';
            }
            
            // Render new widget
            window.grecaptcha.render(recaptchaRef.current, {
              sitekey: '6LdB1BYrAAAAAHtbnisd7EBpAerJiD53lVrM2dpz'
            });
            setRecaptchaReady(true);
          } catch (error) {
            console.error('reCAPTCHA render error:', error);
            setTimeout(checkRecaptcha, 100);
          }
        } else {
          setTimeout(checkRecaptcha, 100);
        }
      };
  
      checkRecaptcha();
  
      return () => {
        // Cleanup
        if (window.grecaptcha && recaptchaRef.current) {
          try {
            const widgetId = recaptchaRef.current.getAttribute('data-widget-id');
            if (widgetId) {
              window.grecaptcha.reset(widgetId);
            }
          } catch (error) {
            console.error('reCAPTCHA cleanup error:', error);
          }
        }
      };
    }, []);

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://www.google.com/recaptcha/api.js"
    script.async = true
    script.defer = true
    document.body.appendChild(script)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
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
    // Clear error when user selects an option
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSliderChange = (e) => {
    const value = Number.parseInt(e.target.value)
    setFormData((prev) => ({ ...prev, annualPlanLikelihood: value }))
  }

  const validateForm = () => {
    const newErrors = {}
    const requiredFields = [
      "name", "email", "businessName", "phone", "country", "businessStage",
      "primaryFocus", "productDescription", "features", "currentManagement",
      "proficiency", "goals", "pricingModel", "priceRange", "maxPrice", 
      "premiumInterest", "challenges", "questions", "ready"
    ];

    requiredFields.forEach((field) => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        newErrors[field] = "This field is required.";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const validateCurrentSection = () => {
    const sectionRequirements = {
      1: ['name', 'email', 'businessName', 'phone', 'country','businessStage', 'primaryFocus', 'productDescription'],
      2: ['features', 'currentManagement', 'proficiency','goals'],
      3: ['pricingModel',
        'priceRange',
        'annualPlanLikelihood',
         'maxPrice',
        'premiumInterest'],
      4: [ 'challenges','questions'],
      5: ['ready']
    };
  
    const currentRequirements = sectionRequirements[currentStep];
    const sectionErrors = {};
    const missingFields = [];
  
    currentRequirements.forEach(field => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        sectionErrors[field] = "This field is required.";
        missingFields.push(field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()));
      }
    });
  
    setErrors(prev => ({ ...prev, ...sectionErrors }));
    
    if (missingFields.length > 0) {
      alert(`Please complete these required fields:\n\n${missingFields.join('\n')}`);
      return false;
    }
    return true;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!recaptchaReady) {
      alert("reCAPTCHA is still loading. Please wait a moment.");
      return;
    }

    const submitButton = e.target.querySelector('button[type="submit"]');
    submitButton.innerText = "Submitting...";
    submitButton.disabled = true;

    // First validate current section
    if (!validateCurrentSection()) {
      alert("Please complete all required fields in this section before submitting.");
      submitButton.innerText = "Submit Application";
      submitButton.disabled = false;
      return;
    }

    // Then validate full form
    if (!validateForm()) {
      alert("Please complete all required fields in the form before submitting.");
      submitButton.innerText = "Submit Application";
      submitButton.disabled = false;
      return;
    }

    try {
      if (!window.grecaptcha) {
        throw new Error("reCAPTCHA not loaded. Please refresh the page.");
      }

      const recaptchaToken = window.grecaptcha.getResponse();
      if (!recaptchaToken) {
        alert("Please complete the CAPTCHA verification.");
        submitButton.innerText = "Submit Application";
        submitButton.disabled = false;
        return;
      }

      const dataToSend = {
        ...formData,
        // "g-recaptcha-response": recaptchaToken,
      };

      const response = await fetch("/sendEmail.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const rawText = await response.text();
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const result = JSON.parse(rawText);
      if (result.success) {
        localStorage.setItem("submittedFormData", JSON.stringify(formData));
        window.location.href = "/thankyou";
      } else {
        throw new Error(result.message || "Form submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      alert(`Error submitting form: ${error.message}\nPlease try again or contact support.`);
    } finally {
      if (submitButton) {
        submitButton.innerText = "Submit Application";
        submitButton.disabled = false;
      }
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
    }
  };

  // Update the goToNextStep function to remove its duplicate alert
  const goToNextStep = (e) => {
    e.preventDefault();
    const isValid = validateCurrentSection(); // Get validation result
    if (isValid) { // Only proceed if validation passes
      setCurrentStep((prev) => prev + 1);
    }
  };


  const goToPrevStep = (e) => {
    e.preventDefault();
    setCurrentStep((prev) => prev - 1);
  };

  const renderSection = () => {
    switch (currentStep) {
      case 1:
        return <Section1 formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} errors={errors} />
      case 2:
        return <Section2 formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} errors={errors} />
      case 3:
        return <Section3 formData={formData} handleChange={handleChange} handleSliderChange={handleSliderChange} errors={errors} />
      case 4:
        return <Section4 formData={formData} handleChange={handleChange} handleSliderChange={handleSliderChange} errors={errors} />
      case 5:
        return <Section5 formData={formData} handleChange={handleChange} errors={errors} />
      default:
        return null
    }
  }

  const totalSteps = 5
  const progressPercent = (currentStep / totalSteps) * 100

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const client = new Client().setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "67fd3831000a0d20c04d"
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

        if (loading) {
          return (
            <div
              id="about"
              className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E5F0F1] to-[#FFF5C3] text-gray-800"
            >
              <BufferAnimation size={90} color="#0A0A45" />
            </div>
          )
        }

  return (
    <div className="min-h-screen pt-36 pb-16">
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

          {/* reCAPTCHA Box */}
          <div className="g-recaptcha mt-6" ref={recaptchaRef} data-sitekey="6LdB1BYrAAAAAHtbnisd7EBpAerJiD53lVrM2dpz"></div>

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





