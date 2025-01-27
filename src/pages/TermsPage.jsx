import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Client, Databases } from 'appwrite'; 
import { FaHome } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { SlArrowRight } from "react-icons/sl";
import TermsContent from '../components/TermsContent'
import Versions from '../components/Version';
import BufferAnimation from '../components/BufferAnimation';
import PdfView from '../components/PdfView';


const TermsPage = () => { 
  const { legalId } = useParams();
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
        // Fetch the document based on legalId
        const response = await databases.listDocuments(databaseId, collectionId);

        const matchingPolicyIndex = response.documents.findIndex(
          (doc) => doc.link === legalId
        );

        if (matchingPolicyIndex !== -1) {
          setTerms(response.documents[matchingPolicyIndex]); // Save the matched document to state
        } else {
          console.log("No policy document found for link:", legalId);
        }
      } catch (error) {
        console.error("Failed to fetch terms details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [legalId]);

  if (loading) {
    return <div>
      <BufferAnimation/>
    </div>;
  }

  if (!terms) {
    return <div>Terms not found!</div>;
  }

  return (
    // <div>
    //   <h1>{terms.LegalTitle}</h1>
    //   {terms.ContentTitle && terms.ContentTitle.length > 0 ? (
    //     terms.ContentTitle.map((title, index) => (
    //       <div key={index}>{title}</div>
    //     ))
    //   ) : (
    //     <div>No content available.</div>
    //   )}
    // </div>

    <>
    <div className="relative mt-[5rem] md:mt-[10rem] lg:mt-[0rem]">
      <div>
      <div
          className="font-extrabold absolute mt-10 lg:mt-28 z-100 w-full p-10 flex flex-col items-center"
        >
          <h1 className="text-center text-[3rem] lg:text-3xl heading text-greay-200">
          {terms.LegalTitle}
          </h1>
          <div className='text-black'>
            <div className='flex items-center gap-3  w-[13%] mt-3 p-1 justify-between'>
                <div><FaHome /></div>
                <Link to='/' className='font-thin'>Home</Link>
                <div><SlArrowRight/></div>
                <Link to='/legals'>Legals</Link>
            </div>
          </div>
        </div>
      <div>
        <img className='w-full h-[20rem] lg:h-[24rem] object-cover' src="https://images.pexels.com/photos/235985/pexels-photo-235985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="" />
      </div>
      </div>

      <div className='flex flex-col gap-[2vh]'>

      <div className='max-w-[1200px] mx-auto mt-4 w-full'>
        <TermsContent terms={terms}/>
      </div>
      
      <div>
        <Versions terms={terms}/>
      </div>

      <div>
        <PdfView terms={terms}/>
      </div>

      </div>

    </div>
    </>
  );
};

export default TermsPage;

