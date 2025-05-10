import { useState, useEffect, useCallback, useRef } from 'react'
import Section1 from '../components/QuestionnaireSections/Section1'
import Section2 from '../components/QuestionnaireSections/Section2'
import Section3 from '../components/QuestionnaireSections/Section3'
import Section4 from '../components/QuestionnaireSections/Section4'
import Section5 from '../components/QuestionnaireSections/Section5'
import { Client, Databases } from "appwrite"
import BufferAnimation from "../components/BufferAnimation"

const Questions = () => {
  // Generate random field names to prevent bot automation
  const [fieldNames] = useState({
    name: `name_${Math.random().toString(36).substring(2, 8)}`,
    email: `email_${Math.random().toString(36).substring(2, 8)}`,
    businessName: `biz_${Math.random().toString(36).substring(2, 8)}`,
    phone: `phone_${Math.random().toString(36).substring(2, 8)}`,
    country: `country_${Math.random().toString(36).substring(2, 8)}`,
    company_website: `site_${Math.random().toString(36).substring(2, 8)}`, // Honeypot
    timestamp: `ts_${Math.random().toString(36).substring(2, 8)}`, // Time-based check
  });

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
    otherFeature: "",
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
    company_website: "", // Honeypot field
    timestamp: Date.now(), // Form load time
    cf_turnstile_response: "", // Cloudflare Turnstile response
  })

  const [errors, setErrors] = useState({});
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);
  const [isHuman, setIsHuman] = useState(false);
  const sitekey = '0x4AAAAAABb2cd1t8irtOt5H';

  // Initialize Cloudflare Turnstile
  useEffect(() => {
    const loadTurnstile = () => {
      // Check if Turnstile is already loaded
      if (document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
        setTurnstileLoaded(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setTurnstileLoaded(true);
      };
      document.body.appendChild(script);
    };

    loadTurnstile();
  }, []);

  // Render Turnstile widget when script is loaded and ref is available
  useEffect(() => {
    if (turnstileLoaded && turnstileRef.current && window.turnstile) {
      // Clear any existing widget first
      if (turnstileWidgetId.current) {
        window.turnstile.remove(turnstileWidgetId.current);
      }

      // Render a new widget
      turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
        sitekey: sitekey,
        callback: (token) => {
          setFormData(prev => ({ ...prev, cf_turnstile_response: token }));
          setIsHuman(true);
          setTurnstileReady(true);
        },
        'expired-callback': () => {
          setIsHuman(false);
          setFormData(prev => ({ ...prev, cf_turnstile_response: "" }));
          setTurnstileReady(false);
        },
        'error-callback': () => {
          setIsHuman(false);
          setFormData(prev => ({ ...prev, cf_turnstile_response: "" }));
          setTurnstileReady(false);
        }
      });
    }

    return () => {
      // Cleanup on unmount
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.remove(turnstileWidgetId.current);
      }
    };
  }, [turnstileLoaded, turnstileRef.current]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name, value) => {
    setFormData(prev => {
      const currentValues = [...prev[name]];
      const index = currentValues.indexOf(value);
      if (index === -1) {
        return { ...prev, [name]: [...currentValues, value] };
      } else {
        currentValues.splice(index, 1);
        return { ...prev, [name]: currentValues };
      }
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSliderChange = (e) => {
    const value = Number.parseInt(e.target.value);
    setFormData(prev => ({ ...prev, annualPlanLikelihood: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      "name", "email", "businessName", "phone", "country", "businessStage",
      "primaryFocus", "productDescription", "features", "currentManagement",
      "proficiency", "goals", "pricingModel", "priceRange", "maxPrice", 
      "premiumInterest", "challenges", "ready"
    ];
  
    // Honeypot check - if filled, silently pass validation
    if (formData.company_website) {
      return true;
    }
  
    // Time check - if form submitted too quickly (<5 seconds)
    if ((Date.now() - formData.timestamp) < 5000) {
      return false;
    }
  
    requiredFields.forEach((field) => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        newErrors[field] = "This field is required.";
      }
    });
  
    if (formData.goals.includes("Other") && !formData.otherGoal) {
      newErrors.otherGoal = "Please specify your goal";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateCurrentSection = () => {
    const sectionRequirements = {
      1: ['name', 'email', 'businessName', 'phone', 'country','businessStage', 'primaryFocus', 'productDescription'],
      2: ['features','currentManagement', 'proficiency','goals'],
      3: ['pricingModel', 'priceRange', 'annualPlanLikelihood', 'maxPrice', 'premiumInterest'],
      4: ['challenges'],
      5: ['ready']
    };
    
    // If honeypot is filled, silently pass validation
    if (formData.company_website) {
      return true;
    }
  
    const currentRequirements = sectionRequirements[currentStep];
    const sectionErrors = {};
    const missingFields = [];
  
    currentRequirements.forEach(field => {
      if (field === 'goals' && formData.goals.includes('Other') && !formData.otherGoal) {
        sectionErrors['otherGoal'] = "Please specify your goal";
        missingFields.push("Other Goal (please specify)");
      }
      else if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
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
    setSubmitAttempts(prev => prev + 1);

    const submitButton = e.target.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.innerText = "Submitting...";
      submitButton.disabled = true;
    }

    // Check honeypot field
    if (formData.company_website) {
      console.log("Bot detected via honeypot - blocking submission");
      setTimeout(() => {
        window.location.href = "/thankyou";
      }, 1500);
      return;
    }

    // Rate limiting - max 3 attempts
    if (submitAttempts >= 3) {
      alert("Too many submission attempts. Please wait and try again later.");
      if (submitButton) {
        submitButton.innerText = "Submit Application";
        submitButton.disabled = false;
      }
      return;
    }

    // Time check - minimum 5 seconds on form
    if ((Date.now() - formData.timestamp) < 5000) {
      console.log("Form submitted too quickly - possible bot");
      setTimeout(() => {
        window.location.href = "/thankyou";
      }, 1500);
      return;
    }

    if (!turnstileReady || !isHuman || !formData.cf_turnstile_response) {
      alert("Please complete the verification check.");
      if (submitButton) {
        submitButton.innerText = "Submit Application";
        submitButton.disabled = false;
      }
      return;
    }

    if (!validateCurrentSection() || !validateForm()) {
      alert("Please complete all required fields before submitting.");
      if (submitButton) {
        submitButton.innerText = "Submit Application";
        submitButton.disabled = false;
      }
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        emailSubject: `New Form Submission from ${formData.name}`,
        // Rename cf_turnstile_response to cfTurnstileResponse for PHP backend
        cfTurnstileResponse: formData.cf_turnstile_response,
        _security: {
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timeOnPage: Date.now() - formData.timestamp,
          referrer: document.referrer,
          ip: await fetch('https://api.ipify.org?format=json').then(res => res.json()).then(data => data.ip).catch(() => 'unknown')
        },
        // Remove honeypot field before sending
        company_website: undefined,
        cf_turnstile_response: undefined // Remove the original field to avoid duplication
      };

      console.log("Sending data:", dataToSend); // Debug output

      const response = await fetch("/sendEmail.php", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server error response:", errorText);
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      if (result.success) {
        const storageData = {...formData};
        delete storageData.company_website;
        localStorage.setItem("submittedFormData", JSON.stringify(storageData));
        window.location.href = "/thankyou";
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Error: ${error.message}\nPlease try again or contact support.`);
    } finally {
      if (submitButton) {
        submitButton.innerText = "Submit Application";
        submitButton.disabled = false;
      }
      // Reset the turnstile widget
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
      setIsHuman(false);
      setFormData(prev => ({ ...prev, cf_turnstile_response: "" }));
    }
  };

  const goToNextStep = (e) => {
    e.preventDefault();
    if (validateCurrentSection()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const goToPrevStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => prev - 1);
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E5F0F1] to-[#FFF5C3] text-gray-800">
        <BufferAnimation size={90} color="#0A0A45" />
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-36 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900">{data.Heading}</h1>
          <p className="text-lg text-gray-600 mt-2">{data.subHeading}</p>
        </div>

        <div className="w-full bg-gray-300 h-3 rounded-full mb-10">
          <div
            className="bg-gray-900 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        <p className="text-sm text-gray-500 mb-6 -mt-8">
          <span className="text-red-500">*</span> indicates required fields
        </p>

        <form onSubmit={handleSubmit}>
          {/* Honeypot field */}
          <div className="honeypot-field" style={{ opacity: 0, position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -1 }} aria-hidden="true">
            <label htmlFor="company_website">Leave this field empty</label>
            <input
              type="text"
              id="company_website"
              name={fieldNames.company_website}
              value={formData.company_website}
              onChange={handleChange}
              tabIndex="-1"
              autoComplete="off"
            />
          </div>
          
          {/* Hidden timestamp field */}
          <input
            type="hidden"
            name={fieldNames.timestamp}
            value={formData.timestamp}
          />
          
          {renderSection()}

          {/* Cloudflare Turnstile widget container */}
          <div className="mt-6">
            <div ref={turnstileRef} id="turnstile-widget"></div>
            {!turnstileLoaded && <p className="text-sm text-gray-500">Loading verification...</p>}
          </div>

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
          
          {currentStep === totalSteps && (
            <p className="text-xs text-gray-500 mt-4 text-center">
              {data.TermsStatement} <a target="_blank" href="/legals/privacy" className="text-blue-600 hover:underline">{data.Terms_Conditions}</a> and <a target="_blank" href="/legals/terms" className="text-blue-600 hover:underline">{data.Privacy_Policy}</a>.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default Questions

