"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import AOS from "aos"
import "aos/dist/aos.css"

const WaitlistForm = () => {
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
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate before submission
    if (!validateForm()) {
      alert("Please fill out all required fields correctly before submitting.");
      return;
    }
  
    const submitButton = e.target.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.innerText = "Processing...";
      submitButton.disabled = true;
    }
    console.log('Submitting:', JSON.stringify(formData));
  
    try {
      const response = await fetch('/joinList.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      const rawText = await response.text();
      console.log("Raw response:", rawText);
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }
  
      if (!rawText.trim()) {
        throw new Error("Server returned an empty response");
      }
  
      try {
        const result = JSON.parse(rawText);
        if (result.success) {
          setSubmitStatus({
            success: true,
            message: result.message || "Thank you for joining our waitlist!"
          });
          // Reset form
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
          });
        } else {
          throw new Error(result.message || "Form submission failed");
        }
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error(`Invalid server response: ${rawText.substring(0, 100)}...`);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
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
                    <input
                      type="text"
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
                  <input
                    type="email"
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
                  <input
                    type="text"
                    name="businessName"
                    placeholder="Business Name"
                    value={formData.businessName}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#0A0A45] transition-all"
                  />
                </div>
                
                <div className="mt-4">
                  <select
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
                    <option value="">Select Country*</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="CA">Canada</option>
                    <option value="NG">Nigeria</option>
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                  )}
                </div>
                
                <div className="mt-4">
                  <input
                    type="tel"
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
                    <input
                      type="text"
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
                    name="vipAccess"
                    checked={formData.vipAccess}
                    onChange={handleChange}
                    className="mr-2 h-5 w-5 rounded border-gray-300 text-[#0A0A45] focus:ring-[#0A0A45]"
                    id="vipAccess"
                  />
                  <label htmlFor="vipAccess" className="text-gray-700">
                    I'm interested in VIP early access
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
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WaitlistForm