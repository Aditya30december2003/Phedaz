import { useState , useEffect } from "react";
import { motion } from "framer-motion";
import { databases} from "../Appwrite/appwrite";
import { Client , Databases } from 'appwrite';
import BufferAnimation from "./BufferAnimation";
import AOS from "aos"
import "aos/dist/aos.css"


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
    hasReferralCode: false,
  });
  const [content , setContent] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
    })
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
      } finally {
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
    <div className="bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3] py-12" id="form">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="flex flex-col lg:flex-row gap-12 items-center"
        >
          {/* Left Section */}
          <div className="lg:w-1/2" data-aos="flip-down" data-aos-delay={200}>
            <h2
              className="text-4xl font-extrabold mb-4 text-center lg:text-left text-[#0A0A45]"
              aria-live="polite"
            >
              {content.Heading}
            </h2>

            <p
              className="text-center lg:text-left text-xl mb-8 text-gray-600"
              aria-live="polite"
            >
              {content.SubHeading}
            </p>
          </div>

          {/* Right Section */}
          <motion.div
            className="w-full lg:w-1/2 bg-white shadow-lg rounded-lg p-8 border border-gray-100"
            data-aos="flip-down"
            data-aos-delay={200}
            role="form"
            aria-labelledby="form-heading"
          >
            <form onSubmit={handleSubmit} aria-describedby="form-description">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label htmlFor="firstName" className="sr-only">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First Name*"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0A0A45] transition-all"
                  required
                  aria-required="true"
                />

                <label htmlFor="lastName" className="sr-only">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name*"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0A0A45] transition-all"
                  required
                  aria-required="true"
                />

                <label htmlFor="email" className="sr-only">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email Address*"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0A0A45] transition-all"
                  required
                  aria-required="true"
                />

                <label htmlFor="businessName" className="sr-only">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#0A0A45] transition-all"
                  aria-describedby="business-name-description"
                />
              </div>

              <div className="mt-4">
                <label htmlFor="country" className="sr-only">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#0A0A45] transition-all"
                  required
                  aria-required="true"
                >
                  <option value="">Select Country*</option>
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="telephone" className="sr-only">Telephone</label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  placeholder="Telephone*"
                  value={formData.telephone}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-md p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#0A0A45] transition-all"
                  required
                  aria-required="true"
                />
              </div>

              <div className="mt-6 flex items-center justify-between">
                <label htmlFor="hasReferralCode" className="text-gray-700">
                  Do you have a referral code?
                </label>
                <label className="relative inline-flex items-center cursor-pointer" htmlFor="hasReferralCode">
                  <input
                    type="checkbox"
                    id="hasReferralCode"
                    name="hasReferralCode"
                    checked={formData.hasReferralCode}
                    onChange={handleChange}
                    className="sr-only peer"
                    aria-describedby="referral-code-description"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-[#0A0A45] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A0A45]"></div>
                </label>
              </div>

              {formData.hasReferralCode && (
                <motion.div className="mt-4">
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

              <motion.button
                type="submit"
                className="bg-[#0A0A45] text-white rounded-md p-3 w-full mt-6 font-semibold text-lg hover:bg-[#000000] transition-colors focus:outline-none focus:ring-4 focus:ring-[#0A0A45]"
                data-aos="zoom-in"
              >
                JOIN THE WAITLIST
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default WaitlistForm;
