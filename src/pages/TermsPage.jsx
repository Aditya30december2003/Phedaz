import React from 'react'
import { useParams } from 'react-router-dom'
import { useState , useEffect } from 'react';
import { Client, Databases } from 'appwrite';

const TermsPage = () => {
  const {termId} = useParams();
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
    const fetchBlog = async () => {
      try {
        const response = await databases.getDocument(databaseId, collectionId, termId);
        setTerms(response);
      } catch (error) {
        console.error("Failed to fetch blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [termId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!terms) {
  return <div>Terms not found!</div>;
  }
  return (
    <div>
      <div>
        <h1>{terms.LegalTitle}</h1>
        {terms.ContentTitle.map((title)=>(
            <>
            <div>{title}</div>
            </>
        ))}
      </div>
    </div>
  )
}

export default TermsPage
