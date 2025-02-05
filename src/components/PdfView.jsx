import React, { useState, useEffect } from 'react';
import { databases, storage } from "../Appwrite/appwrite"; // Adjust this import path based on your setup
import PageLoadAnimation from './PageLoadAnimation';


const PdfView = ({terms}) => {
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfError, setPdfError] = useState(null);

  // Fetch PDF URL only if policyData and pdf_file_id are available
  useEffect(() => {
    if (terms.pdf_file_id) {
      const fetchPdf = async () => {
        try {
          const fileId = `${terms.pdf_file_id}`; // Make sure this exists in the data
          const result = await storage.getFileView(
            "67966d480012f10a8e24", // bucket ID
            fileId // pdf_file_id
          );
          setPdfUrl(result);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching PDF:", error);
          setPdfError("Error loading PDF. Please try again later.");
        }
      };

      fetchPdf();
    }
  }, []); 

  if (isLoading) {
    return (
      <div className="flex items-center justify-center  bg-gray-50">
       <PageLoadAnimation/>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center  py-20 ">
      <button
        onClick={() => window.open(pdfUrl, '_blank')}
         className="mt-0 text-center text-[1.7rem] w-[80%] md:w-[30%] p-2 mx-auto border-2 font-bold rounded-md shadow-[10px_10px_1px_1px_#0A0A45] lg:hover:shadow-[10px_10px_1px_1px_#FFF5C3] hover:scale-95 cursor-pointer"
        disabled={!pdfUrl} // Disable button if URL is not available
      >
        View as PDF
      </button>
    </div>
  );
};

export default PdfView;
