"use client"
import { useState, useEffect, useCallback } from "react" 
import { motion } from "framer-motion"
import AOS from "aos"
import "aos/dist/aos.css"
import { Client, Databases } from "appwrite"
import BufferAnimation from "../components/BufferAnimation"

const WaitlistForm = () => {
  // Fixed field names - no longer randomly generated

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    businessName: "",
    country: "",
    telephone: "",
    referralCode: "",
    vipAccess: false,
    hasReferralCode: false,
    website: "", // Honeypot field
    timestamp: Date.now(), // Form load time
  });

  const [loading, setLoading] = useState(true);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [countries, setCountries] = useState([]);
  const [data, setData] = useState(null);
  const [, setSubmitTime] = useState(0);

  // Debug: Log initial state
  useEffect(() => {
    console.log("Form initialized with data:", formData);
  }, []);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Appwrite client setup
const client = new Client()
  .setEndpoint("https://appwrite.hivefinty.com/v1") // ✅ New Appwrite instance
  .setProject("68472e8400352e6aa1e2");              // ✅ New Project ID (phedaz)


  const databases = new Databases(client);
  const databaseId = "67913805000e2b223d80";
  const collectionId = "67fd3831000a0d20c04d";

  // Fetch form data from Appwrite
  const fetchAboutData = useCallback(async () => {
    try {
      const response = await databases.listDocuments(databaseId, collectionId);
      setData(response.documents[0]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [databases]);

  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        const countryNames = data.map((country) => country.name.common);
        const priority = ["United Kingdom", "United States", "Canada"];
        const others = countryNames
          .filter((name) => !priority.includes(name))
          .sort();
        const sortedCountries = [...priority, ...others];

        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    console.log("Changing field:", name, "to:", type === "checkbox" ? checked : value);
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    console.log("Validating form with data:", formData);
    
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Honeypot check
    if (formData.website) {
      console.log("Honeypot field filled - likely bot");
      return false;
    }
    
    // Time check - if form submitted too quickly (less than 3 seconds)
    const submissionTime = Date.now() - formData.timestamp;
    if (submissionTime < 3000) {
      console.log("Form submitted too quickly - possible bot");
      return false;
    }

    // Required field validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.telephone.trim()) newErrors.telephone = "Phone number is required";

    setErrors(newErrors);
    console.log("Validation errors:", newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitTime(Date.now());
    console.log("Form submission started with data:", formData);
    
    if (!validateForm()) {
      // If honeypot is filled or form submitted too quickly
      if (formData.website || (Date.now() - formData.timestamp < 3000)) {
        console.log("Bot detected - showing fake success");
        // Fake success for bots
        setSubmitStatus({
          success: true,
          message: "Thank you for joining our waitlist!"
        });
        return;
      }
      
      alert("Please fill out all required fields correctly before submitting.");
      return;
    }
  
    const submitButton = e.target.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.innerText = "Processing...";
      submitButton.disabled = true;
    }
  
    try {
      const submissionData = {
        ...formData,
        // Include additional security headers
        _security: {
          userAgent: navigator.userAgent,
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timeOnPage: Date.now() - formData.timestamp,
          referrer: document.referrer,
        }
      };

      console.log("Submitting data:", submissionData);

      const response = await fetch('/joinList.php', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        credentials: 'include', // Important for cross-domain cookies
        body: JSON.stringify(submissionData)
      });
  
      const rawText = await response.text();
      console.log("Server response:", rawText);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
  
      if (!rawText.trim()) {
        throw new Error("Server returned an empty response");
      }
  
      const result = JSON.parse(rawText);
      if (result.success) {
        console.log("Submission successful");
        setSubmitStatus({
          success: true,
          message: result.message || "Thank you for joining our waitlist!"
        });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          businessName: "",
          country: "",
          telephone: "",
          referralCode: "",
          vipAccess: false,
          hasReferralCode: false,
          website: "",
          timestamp: Date.now(),
        });
      } else {
        throw new Error(result.message || "Form submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        success: false,
        message: error.message || "An error occurred. Please try again."
      });
    } finally {
      if (submitButton) {
        submitButton.innerText = 'JOIN THE WAITLIST';
        submitButton.disabled = false;
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E5F0F1] to-[#FFF5C3] text-gray-800">
        <BufferAnimation size={90} color="#0A0A45" />
      </div>
    );
  } 

  return (
    <div className="bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3] py-12 overflow-hidden" id="form">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8 items-center w-[95%] mx-auto">
          {/* Left Section */}
          <div className="lg:w-full mb-8 lg:mb-0" data-aos="fade-right">
            <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 text-center lg:text-left text-[#0A0A45]">
              Join Our Exclusive Waitlist
            </h2>
            <p className="text-center lg:text-left text-lg lg:text-xl mb-8 text-gray-600">
              Be the first to know when we launch and get special early access benefits.
            </p>
          </div>

          {/* Right Section - Form */}
          <div className="w-full lg:w-full overflow-hidden" data-aos="fade-left">
            <motion.div
              className="bg-white shadow-lg rounded-lg p-6 lg:p-8 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {submitStatus && (
                <div className={`mb-4 p-4 rounded-md ${
                  submitStatus.success 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {submitStatus.message}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot field - hidden from real users but visible to bots */}
                <div className="hidden" style={{ display: 'none' }} aria-hidden="true">
                  <label htmlFor="website">Leave this field blank</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex="-1"
                    autoComplete="off"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
                
                {/* Timestamp field */}
                <input
                  type="hidden"
                  name="timestamp"
                  value={formData.timestamp}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="sr-only">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="First Name*"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 transition-all ${
                        errors.firstName 
                          ? 'border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-[#0A0A45]'
                      }`}
                      required
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="sr-only">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Last Name*"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 transition-all ${
                        errors.lastName 
                          ? 'border-red-500 focus:ring-red-200' 
                          : 'border-gray-300 focus:ring-[#0A0A45]'
                      }`}
                      required
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-4">
                  <label htmlFor="email" className="sr-only">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email Address*"
                    value={formData.email}
                    onChange={handleChange}
                    className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 transition-all ${
                      errors.email 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-[#0A0A45]'
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
                
                <div className="mt-4">
                  <label htmlFor="businessName" className="sr-only">Business Name</label>
                  <input
                    type="text"
                    id="businessName"
                    name="businessName"
                    placeholder="Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#0A0A45] transition-all"
                  />
                </div>
                
                <div className="mt-4">
                  <label htmlFor="country" className="sr-only">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 transition-all ${
                      errors.country 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-[#0A0A45]'
                    }`}
                    required
                  >
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                      <option key={country} value={country} className="cursor-pointer">
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                  )}
                </div>
                
                <div className="mt-4">
                  <label htmlFor="telephone" className="sr-only">Phone Number</label>
                  <input
                    type="tel"
                    id="telephone"
                    name="telephone"
                    placeholder="Phone Number*"
                    value={formData.telephone}
                    onChange={handleChange}
                    className={`border rounded-md p-3 w-full focus:outline-none focus:ring-2 transition-all ${
                      errors.telephone 
                        ? 'border-red-500 focus:ring-red-200' 
                        : 'border-gray-300 focus:ring-[#0A0A45]'
                    }`}
                    required
                  />
                  {errors.telephone && (
                    <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>
                  )}
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <label htmlFor="hasReferralCode" className="text-gray-700">
                    Do you have a referral code?
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="hasReferralCode"
                      name="hasReferralCode"
                      checked={formData.hasReferralCode}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#0A0A45] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A0A45]"></div>
                  </label>
                </div>
                
                {formData.hasReferralCode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <label htmlFor="referralCode" className="sr-only">Referral Code</label>
                    <input
                      type="text"
                      id="referralCode"
                      name="referralCode"
                      placeholder="Referral Code"
                      value={formData.referralCode}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#0A0A45] transition-all"
                    />
                  </motion.div>
                )}
                
                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="vipAccess"
                    name="vipAccess"
                    checked={formData.vipAccess}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 rounded border-gray-300 text-[#0A0A45] focus:ring-[#0A0A45]"
                  />
                  <label htmlFor="vipAccess" className="text-gray-700">
                    I am interested in VIP early access
                  </label>
                </div>
                
                <motion.button
                  type="submit"
                  className="bg-[#0A0A45] text-white rounded-md p-3 w-full mt-6 font-semibold text-lg hover:bg-[#000000] transition-colors focus:outline-none focus:ring-4 focus:ring-[#0A0A45] disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'JOIN THE WAITLIST'
                  )}
                </motion.button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  {data?.TermsStatement}
                  <a 
                    href="/legals/privacy" 
                    className="text-blue-600 hover:underline ml-2"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {data?.Terms_Conditions}
                  </a>{' '}
                  and{' '}
                  <a 
                    href="/legals/terms"
                    className="text-blue-600 hover:underline"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {data?.Privacy_Policy}
                  </a>.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitlistForm;