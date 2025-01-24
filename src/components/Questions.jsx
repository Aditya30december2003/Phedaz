"use client"
import { Client, Databases } from 'appwrite';
import { useState , useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion"
import { IoIosArrowDown } from "react-icons/io";


// const faqs = [
//   {
//     question: "What services do you offer?",
//     answer:
//       "We offer a wide range of services including web development, mobile app development, and cloud solutions. Our team of experts is equipped to handle projects of any scale, ensuring top-notch quality and innovation in every delivery.",
//   },
//   {
//     question: "How can I contact support?",
//     answer:
//       "You can contact our support team via email at support@example.com or through our 24/7 live chat on our website. We also offer phone support during business hours. Our dedicated team ensures quick response times and efficient problem resolution.",
//   },
//   {
//     question: "Do you offer custom solutions?",
//     answer:
//       "Yes, we provide custom solutions tailored to meet the specific needs of our clients. We work closely with you to understand your requirements and develop bespoke solutions that align perfectly with your business goals and objectives.",
//   },
//   {
//     question: "What is your typical project timeline?",
//     answer:
//       "Project timelines vary depending on the scope and complexity of the project. Generally, small to medium-sized projects take 4-8 weeks, while larger, more complex projects can take 3-6 months. We always provide a detailed timeline during the initial consultation.",
//   },
//   {
//     question: "Do you provide ongoing maintenance and support?",
//     answer:
//       "We offer comprehensive maintenance and support packages to ensure your solution remains up-to-date and functions smoothly. Our support plans include regular updates, security patches, and technical assistance whenever you need it.",
//   },
// ]

function Faqs() {
  const [activeIndex, setActiveIndex] = useState(null)
  const [faqs , setFaqs] = useState([])
  const [loading , setLoading] = useState(false)

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }
  const client = new Client();
  client.setEndpoint('https://centralapps.hivefinty.com/v1') // Replace with your Appwrite endpoint
        .setProject('67912e8e000459a70dab'); // Replace with your Project ID

  const databases = new Databases(client);
  const databaseId = '67913805000e2b223d80'; // Replace with your Database ID
  const collectionId = '679339b70039819b7c44'; // Replace with your Collection ID

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId);
        setFaqs(response.documents);
        console.log(response.documents)
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>Loading...</div>; 
  }
  

  return (
    <section className="py-16 bg-gradient-to-br from-pink-100 to-purple-100">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-4xl font-bold mb-12 text-center text-gray-800">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <button className="w-full text-left p-6 focus:outline-none" onClick={() => toggleFaq(index)}>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
                  <motion.div animate={{ rotate: activeIndex === index ? 180 : 0 }} transition={{ duration: 0.3 }}>
                    <IoIosArrowDown className="w-6 h-6 text-pink-500" />
                  </motion.div>
                </div>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="px-6 pb-6 text-gray-600">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faqs

