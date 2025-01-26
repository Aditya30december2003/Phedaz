import { Client, Databases } from 'appwrite';
import { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import BufferAnimation from '../components/BufferAnimation'; 
const Terms = () => {
  const [terms, setTerms] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Appwrite client
  const client = new Client();
  client.setEndpoint('https://centralapps.hivefinty.com/v1') // Replace with your Appwrite endpoint
        .setProject('67912e8e000459a70dab'); // Replace with your Project ID

  const databases = new Databases(client);
  const databaseId = '67913805000e2b223d80'; // Replace with your Database ID
  const collectionId = '679159cb001bb4fa2882'; // Replace with your Collection ID

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId);
        setTerms(response.documents);
        console.log(response.documents)
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  if (loading) {
    return <div><BufferAnimation size={90} color="white" /></div>;
  }

  return (
    <section className=" bg-white">
      {/* Header Section with Dynamic Heading and Subheading */}
      <div className="h-[25rem] relative bg-cover bg-center"
           style={{
             backgroundImage: `url("https://sociallawstoday.com/wp-content/uploads/2021/02/4-Main-Types-of-Law-Which-One-Is-the-Best-For-You-1170x614-1-e1633610839631-1.jpg")` // Use the first policy's image or a default
           }}
      >
        <div className="text-white bg-black/80 absolute mt-32 z-100 w-full p-10" data-aos="fade-up" data-aos-duration="2000">
          <h1 className="text-center text-2xl lg:text-4xl heading">
            {terms[0].Heading	}
          </h1>
          <p className="text-center text-[1.1rem] lg:text-[1.6rem] mt-10">
            {terms[0].subHeading}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 p-4">
       {terms.map((term) => (
        <Link to={term.id ? `/legals/${term.$id}` : `/legals`} key={term.$id} className="bg-white shadow-md rounded p-4">
          <img
            src={term.image}
            alt={term.LegalTitle}
            className="w-full h-40 object-cover rounded mb-4"
          />
          <h2 className="text-lg font-semibold">{term.LegalTitle}</h2>
          {/*  */}
        </Link>
      ))}
      </div>
      </div>
    </section>
  );
};

export default Terms;
