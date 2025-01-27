import { useState , useEffect } from "react";
import { motion } from "framer-motion";
import { databases} from "../Appwrite/appwrite";
import { Client , Databases } from 'appwrite';
import BufferAnimation from "./BufferAnimation";

const fetchFormContent = async () => {
  try {
    const response = await databases.listDocuments(
      "67913805000e2b223d80", // Database ID
      "67950ee20025e7fe40f5"  // Form collection ID
    );

    return response.documents[0] || null; // Return first document or null
  } catch (error) {
    console.error("Appwrite Fetch Error:", error);
    return null;
  }
};

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
    hasReferralCode: false,});
  const [content , setContent] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
    useEffect(() => {
      const loadContent = async () => {
        try {
          const data = await fetchFormContent();
          if (data) {
            setContent(data);
          } else {
            setError("No footer content found");
          }
        } catch (err) {
          setError(err.message);
        }finally {
          setLoading(false);
        }
      };
  
      loadContent();
    }, []);

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
    const mailtoLink = `mailto:${content.email}?subject=Waitlist Form Submission&body=${encodeURIComponent(
      emailBody
    )}`;

    // Open the mailto link
    window.location.href = mailtoLink;
  };

  if (loading) {
    return <div><BufferAnimation size={90} color="white" /></div>;
  }

  return (
    <div className="bg-white py-12" id="form">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row gap-12 items-center"
        >
          {/* Left Section */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-extrabold mb-4 text-center lg:text-left text-green-800">
              {content.Heading}
            </h2>

            <p className=" text-center lg:text-left text-xl mb-8 text-gray-600">
              {content.SubHeading}
            </p>
          </div>

          {/* Right Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-8 border border-gray-100"
          >
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name*"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name*"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address*"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  required
                />
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                />
              </div>
              <div className="mt-4">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
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
                    className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  />
                </motion.div>
              )}
              <motion.button
                type="submit"
                className="bg-color text-white rounded-md p-3 w-full mt-6 font-semibold text-lg hover:bg-green-700 transition-colors duration-300"
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
