"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Client, Databases } from "appwrite";
import NewTestComponent from "./NewTestComponent"

function About() {
  const [aboutData, setAboutData] = useState(null); // Store the single document
  const [loading, setLoading] = useState(true);

  // Appwrite setup
  const client = new Client()
    .setEndpoint("https://centralapps.hivefinty.com/v1")
    .setProject("67912e8e000459a70dab");

  const databases = new Databases(client);
  const databaseId = "67913805000e2b223d80";
  const collectionId = "6794d613002b2a8ae385";

  // Fetch data from Appwrite
  const fetchAboutData = async () => {
    try {
      const response = await databases.listDocuments(databaseId, collectionId);
      setAboutData(response.documents[0]); // Set the single document
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-gray-800">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-semibold mt-4">Loading...</p>
      </div>
    );
  }

  if (!aboutData) {
    return <p className="text-center text-xl">No data available</p>;
  }
  return (
    <div className="">
    <section className="pt-5 bg-white ">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-xl font-semibold text-blue-600 mb-4">{aboutData.subHeading}</h2>
          <div className="bg-blue-500 w-[7rem] h-[0.4rem] mx-auto mb-5"></div>
          <p className="text-4xl text-gray-600 font-bold mb-8">{aboutData.Heading}</p>
          <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, delay: 0.2 }}
  className="max-w-4xl mx-auto space-y-6 text-gray-700 leading-relaxed px-4 py-8 lg:py-12 bg-white rounded-lg shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)]"
>
  {aboutData.Content.map((content)=>(
    <>
    <p className="text-lg md:text-lg font-medium">
      {content}
    </p>
    </>
  ))}
</motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-10"
          >
            <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold text-lg shadow-lg hover:bg-blue-700 transition duration-300">
              Join Waitlist
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.8 }}
    className="p-3"
  >
    <NewTestComponent />
  </motion.div>
  </div>
  )
}

export default About