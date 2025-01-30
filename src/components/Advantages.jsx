import { useState, useEffect } from "react";
import { Client, Databases } from "appwrite";
import BufferAnimation from "./BufferAnimation";
import AOS from "aos";
import "aos/dist/aos.css";

const AdvantagesComponent = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOption, setActiveOption] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once:false
    });
  }, []);

  const handleOptionClick = (optionId) => {
    if (optionId === activeOption) return;
    
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveOption(optionId);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }, 300);
  };

  useEffect(() => {
    const client = new Client();
    client.setEndpoint("https://centralapps.hivefinty.com/v1")
          .setProject("67912e8e000459a70dab");

    const databases = new Databases(client);
    const databaseId = "67913805000e2b223d80";
    const collectionId = "67921b41001390a43aad";

    const fetchOptions = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId);
        setOptions(response.documents);
        if (response.documents.length > 0) {
          setActiveOption(response.documents[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[2rem] lg:h-screen">
        <BufferAnimation color="#0A0A45" size={60} />
      </div>
    );
  }

  const activeOptionData = options.find(option => option.id === activeOption);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 overflow-hidden">
      <h1 
        className="text-[3rem] lg:text-[5rem] font-extrabold text-[#0A0A45] mb-4 text-center" 
        data-aos="fade-up"
        data-aos-delay="200"
      >
        {options[0]?.Title}
      </h1>
      <p 
        className="text-[#0A0A45] mb-12 text-[1.2rem] font-semibold text-center max-w-2xl mx-auto" 
        data-aos="fade-up"
        data-aos-delay="200"
      >
        {options[0]?.subTitle}
      </p>
      <div className="flex flex-col lg:flex-row min-h-[400px] shadow-lg bg-yellow-50" data-aos="fade-up"
            data-aos-delay="800">
        <div className="md:w-24 p-4 bg-slate-100 flex md:flex-col justify-start items-center gap-4 rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
          {options.map((advantage) => (
            <button
              key={advantage.id}
              onClick={() => handleOptionClick(advantage.id)}
              className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                activeOption === advantage.id
                  ? 'bg-gray-900 text-white shadow-lg scale-110'
                  : 'bg-white hover:bg-blue-50'
              }`}
              aria-label={advantage.Title}
            >
              <img 
                src={advantage.image} 
                alt="" 
                className="w-10 h-10 object-cover rounded-full transition-transform duration-300 hover:scale-110"
              />
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-center w-full p-6 overflow-hidden">
          <div 
            className={`w-full lg:w-1/2 rounded-lg shadow-lg object-cover transition-all duration-300 transform
              ${isTransitioning ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
          >
            <img 
              className="w-full h-full object-cover rounded-md duration-300 hover:scale-105 overflow-hidden" 
              src={activeOptionData?.image} 
              alt="" 
            />
          </div>
          <div className="w-full lg:w-1/2">
            <div 
              className={`h-full flex flex-col items-start transition-all duration-500 transform overflow-hidden
                ${isTransitioning ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0'}`}
            >
              <h2 className="text-3xl font-bold mb-4 text-gray-900 transition-colors duration-300">
                {activeOptionData?.Advantage}
              </h2>
              <div className="w-20 h-1 bg-gray-900 rounded mb-6 transition-all duration-300" />
              <p className="text-lg text-gray-700 leading-relaxed transition-opacity duration-300">
                {activeOptionData?.Content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvantagesComponent;