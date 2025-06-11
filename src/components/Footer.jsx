import { Link } from 'react-router-dom';
import { databases } from "../Appwrite/appwrite";
import { Client, Databases } from 'appwrite';
import { useState, useEffect } from "react";
import { FaGlobe, FaFacebookSquare, FaInstagramSquare } from "react-icons/fa";
import Icon from '../assets/icon_full.png';
import BufferAnimation from './BufferAnimation';

const fetchFooterContent = async () => {
  try {
    const response = await databases.listDocuments(
      "67913805000e2b223d80", // Database ID
      "679520ce003730d307e2"  // Footer collection ID
    );

    return response.documents[0] || null; // Return first document or null
  } catch (error) {
    console.error("Appwrite Fetch Error:", error);
    return null;
  }
};

const Footer = () => {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const data = await fetchFooterContent();
        if (data) {
          setContent(data);
        } else {
          setError("No footer content found");
        }
      } catch (err) {
        setError(err.message);
      }
    };

    loadContent();
  }, []);


  // Default values in case of missing content
  const defaultContent = {
    
    
  };

  // Merge fetched content with default content
  const footerContent = content ? { ...defaultContent, ...content } : defaultContent;


  const [, setTerms] = useState(null);
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
        console.log(response.documents);
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

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="w-full bg-[#E5F0F1] text-[#0A0A45] p-4 lg:p-5">
      {/* Subscription Form */}
      <div className='mb-0'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const name = "Phedaz Inquiry";
            const message = "I am interested in hiring your services.";
            const mailtoLink = `mailto:${footerContent.email}?subject=Contact%20from%20${encodeURIComponent(
              name
            )}&body=From:%20${encodeURIComponent(email)}%0A%0A${encodeURIComponent(
              message
            )}`;
            window.location.href = mailtoLink;
          }}
          className="mx-auto text-center w-[100%] lg:w-[45%] mt-18 lg:mt-10 flex items-center border p-2 rounded-[5rem] bg-white"
        >
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="Email"
            className="border-none outline-none p-2 bg-transparent w-[70%]"
          />
          <button
            type="submit"
            className="text-center mx-auto text-[#FFF5C3] p-3 w-[30%] rounded-[5rem] text-[1rem] font-bold bg-[#0A0A45]"
          >
            Lets talk tech
          </button>
        </form>
      </div>

      {/* Footer Content */}
      <div className="flex flex-col lg:flex-row gap-[0.5rem] lg:gap-[1rem] lg:items-center text-center">
        {/* Logo Section */}
        <div className="md:flex hidden justify-center items-center p-14">
          <div className="hidden lg:block shadow-[inset_-12px_-8px_40px_#46464620] rounded-full w-[10rem] h-[10rem] lg:w-[12rem] lg:h-[12rem]">
            <img 
              src={Icon} 
              alt="Logo" 
              className="w-32 h-32 lg:w-48 lg:h-48  object-contain mx-auto rounded-[100%] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.06),0px_1px_1px_-0.5px_rgba(0,0,0,0.06),0px_3px_3px_-1.5px_rgba(0,0,0,0.06),_0px_6px_6px_-3px_rgba(0,0,0,0.06),0px_12px_12px_-6px_rgba(0,0,0,0.06),0px_24px_24px_-12px_rgba(0,0,0,0.06)]"
            />
          </div>
        </div>

        {/* Legal Terms Section */}
        <div className="flex flex-col gap-3 mt-5 md:mt-0 w-[30%] mx-auto">
          {footerContent.legalTerms.map((term, index) => (
            <Link 
              key={index} 
              to={footerContent.legalLinks[index] === 'legals' ? '/legals' : `/legals/${footerContent.legalLinks[index]}`}
              className={footerContent.legalLinks[index] === 'legals' ? "font-extrabold text-[1.3rem] text-[#0A0A45]" : "font-bold text-[1rem] text-[#0A0A45]"}
            >
              {term}
            </Link>
          ))}
        </div>

        {/* Careers Section */}
        <div className="flex flex-col gap-1 text-[2rem] mt-10 lg:mt-[-7.5rem]">
          <h1 className="font-bold text-[1rem]">Careers</h1>
          <Link className="text-[0.8rem] font-light text-center mx-auto w-[5rem] text-[#0A0A45]">Job Search</Link>
        </div>

        {/* Address Section */}
        <div className='flex gap-2 flex-col items-center w-[70%] mt-5 mx-auto'>
          <div className='flex flex-col items-center'>
            <h1 className="font-bold text-[1.2rem] text-[#0A0A45]">Where to find us?</h1>
            <div className='flex flex-col gap-3 mt-7'>
              {footerContent.Address.map((addr, index) => (
                <div key={index} className="text-[1rem] w-[85%] md:w-[60%] mx-auto font-light flex flex-col">
                  <span className='text-[0.9rem] font-extrabold'>{footerContent.AdressHeading[index]}</span>
                  <span className='text-[0.8rem]'>{addr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Phone and Email */}
        </div>

        {/* Social Links */}
        <div className='flex flex-col gap-3 mt-10 md:mt-[-1rem]'>
          <h1 className="font-bold text-[1rem] w-full text-[#0A0A45]">Get in touch</h1>
          <div className="flex flex-row items-center mx-auto gap-2">
            <Link to={footerContent.website}><FaGlobe size={20} /></Link>
            <Link to={footerContent.facebook}><FaFacebookSquare size={20} /></Link>
            <Link to={footerContent.insta}><FaInstagramSquare size={20} /></Link>
          </div>
          <div>
            <h1 className="font-bold text-[1rem] text-[#0A0A45]">Phone no.</h1>
            <Link className="text-[0.7rem] w-full font-light">{footerContent.phoneNum}</Link>
          </div>
          <div>
            <h1 className="font-bold text-[1rem] text-[#0A0A45]">Email</h1>
            <Link className="text-[0.8rem] font-light">{footerContent.email}</Link>
          </div>
        </div>
      </div>

      {/* Footer Divider */}
      <div className="w-[80%] mx-auto mt-10 bg-[#0A0A45] h-[0.03rem]"></div>

      {/* Footer Bottom */}
      <div className="flex flex-col lg:flex-row items-center gap-7 text-[0.85rem] mt-5 justify-between">
        <Link to='https://techistlab.co.uk/' className='text-center w-full text-[#0A0A45]'>{footerContent.footer_bottom}</Link>
      </div>
    </div>
  );
};

export default Footer;
