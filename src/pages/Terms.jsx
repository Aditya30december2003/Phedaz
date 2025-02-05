import { Client, Databases } from 'appwrite';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BufferAnimation from '../components/BufferAnimation';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Terms = () => {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Appwrite client
  const client = new Client();
  client.setEndpoint('https://centralapps.hivefinty.com/v1')
        .setProject('67912e8e000459a70dab');

  const databases = new Databases(client);
  const databaseId = '67913805000e2b223d80';
  const collectionId = '679159cb001bb4fa2882';

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
    });

    const fetchTerms = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId);
        setTerms(response.documents);
      } catch (error) {
        console.error("Failed to fetch terms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [databases]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3]">
        <BufferAnimation size={90} color="#0A0A45" />
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3] min-h-screen">
      {/* Header Section with Dynamic Heading and Subheading */}
      <div className="relative h-[25rem] bg-cover bg-center"
           style={{
             backgroundImage: `url("https://sociallawstoday.com/wp-content/uploads/2021/02/4-Main-Types-of-Law-Which-One-Is-the-Best-For-You-1170x614-1-e1633610839631-1.jpg")`
           }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#E5F0F1]/20 to-[#FFF5C3]/20 flex items-center justify-center">
          <div className="text-white w-full max-w-4xl px-6" data-aos="fade-up">
            <h1 className="text-center text-3xl lg:text-5xl font-bold mb-6">
              {terms[0]?.Heading}
            </h1>
            <p className="text-center text-lg lg:text-2xl">
              {terms[0]?.subHeading}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {terms.map((term, index) => (
            <Link 
              to={term.id ? `/legals/${term.link}` : `/legals`} 
              key={term.$id} 
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img
                src={term.image || "/placeholder.svg"}
                alt={term.LegalTitle}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#0A0A45] mb-2">{term.LegalTitle}</h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Terms;
