import React, { useState } from "react";
import { motion } from "framer-motion";

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create the email body
    const emailBody = `
      First Name: ${formData.firstName}
      Last Name: ${formData.lastName}
      Email: ${formData.email}
      Business Name: ${formData.businessName || "N/A"}
      Country: ${formData.country}
      Telephone: ${formData.telephone}
      Referral Code: ${formData.hasReferralCode ? formData.referralCode : "N/A"}
      VIP Access: ${formData.vipAccess ? "Yes" : "No"}
    `;

    // Create the mailto link
    const mailtoLink = `mailto:adityasmjain@gmail.com?subject=Waitlist Form Submission&body=${encodeURIComponent(
      emailBody
    )}`;

    // Open the mailto link
    window.location.href = mailtoLink;
  };

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-12 items-center"
        >
          {/* Left Section */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold mb-4 text-center lg:text-left text-blue-800">
              JOIN OUR WAITLIST
            </h2>
            <p className="text-xl mb-8 text-gray-600">
              Ready to revolutionize your business? Join our waitlist and be the
              first to gain exclusive access to Storekwil.
            </p>
          </div>

          {/* Right Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2 bg-white shadow-lg rounded-lg p-8 border border-gray-100"
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name*"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name*"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address*"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="mt-4">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                >
                  <option value="">Select Country*</option>
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
              <div className="mt-4">
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Telephone*"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-gray-700">
                  Do you have a referral code?
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasReferralCode"
                    checked={formData.hasReferralCode}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              {formData.hasReferralCode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <input
                    type="text"
                    name="referralCode"
                    placeholder="Referral Code"
                    value={formData.referralCode}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </motion.div>
              )}
              <motion.button
                type="submit"
                className="bg-blue-600 text-white rounded-md p-3 w-full mt-6 font-semibold text-lg hover:bg-blue-700 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join the Waitlist
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WaitlistForm;
