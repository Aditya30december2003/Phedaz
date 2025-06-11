"use client";
import { Client, Databases } from "appwrite";
import { useEffect, useState, useCallback } from "react";
import BufferAnimation from "../components/BufferAnimation";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Import your local logo image
import logoImage from '../assets/phedaz_logo.png'; // Adjust path to your logo location

const ThankYou = () => {
  const userResponse = localStorage.getItem("submittedFormData");

  const formatKey = (key) => {
    if (key === 'maxPrice') return 'Maximum Price (£)';
    if (key === 'annualPlanLikelihood') return 'Annual Plan Likelihood';
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace('_', ' ');
  };

  const downloadPDF = async () => {
    try {
      if (!userResponse) {
        alert('No application data found. Please submit the form again.');
        return;
      }

      const data = JSON.parse(userResponse);
      const doc = new jsPDF();
      
      // Set document properties
      doc.setProperties({
        title: 'Phedaz Early Access Application',
        subject: 'User application response',
        author: 'Phedaz',
      });

      // Add logo from local file
      doc.addImage(logoImage, 'PNG', 15, 10, 25, 25);
      
      // Add title and subtitle
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'bold');
      doc.text("Early Access Program", 105, 55, { align: "center" });
      
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text("Application Details", 105, 62, { align: "center" });
      
      // Add horizontal line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 70, 190, 70);
      
      // Add application date
      doc.setFontSize(10);
      doc.text(`Application Date: ${new Date().toLocaleDateString()}`, 14, 80);
      
      // Prepare table data
      const rows = Object.entries(data)
        .filter(([key]) => key !== 'g-recaptcha-response')
        .map(([key, value]) => {
          const formattedKey = formatKey(key);
          let formattedValue;
          
          if (key === 'maxPrice' && value) {
            formattedValue = `£${value}`;
          } 
          else if (key === 'annualPlanLikelihood' && value) {
            formattedValue = `${value}/5`;
          }
          else {
            formattedValue = Array.isArray(value) ? value.join(', ') : value || 'N/A';
          }
          
          return [formattedKey, formattedValue];
        });
      
      // Create the table
      autoTable(doc, {
        startY: 85,
        head: [['Question', 'Response']],
        body: rows,
        theme: 'grid',
        headStyles: {
          fillColor: [51, 51, 51],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 'wrap' },
          1: { cellWidth: 'auto' }
        },
        margin: { horizontal: 10 },
        styles: {
          fontSize: 10,
          cellPadding: 5,
          overflow: 'linebreak',
        },
        didDrawPage: function () {
          // Footer with two lines
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          
          // First line - Confidential notice
          doc.text(
            'Phedaz Early Access Program - Confidential',
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 15,
            { align: 'center' }
          );
          
          // Second line - Website URL
          doc.text(
            'https://phedaz.com/',
            doc.internal.pageSize.width / 2,
            doc.internal.pageSize.height - 10,
            { align: 'center' }
          );
        }
      });

      doc.save("Phedaz_EarlyAccess_Application.pdf");
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const client = new Client()
    .setEndpoint("https://centralapps.hivefinty.com/v1")
    .setProject("67912e8e000459a70dab");

  const databases = new Databases(client);
  const databaseId = "67913805000e2b223d80";
  const collectionId = "68053d70001339ade026";

  const fetchAboutData = useCallback(async () => {
    try {
      const response = await databases.listDocuments(databaseId, collectionId);
      setData(response.documents[0]);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [databases]);

  useEffect(() => {
    fetchAboutData();
  }, [fetchAboutData]);

  if (loading) {
    return (
      <div
        id="about"
        className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E5F0F1] to-[#FFF5C3] text-gray-800"
      >
        <BufferAnimation size={90} color="#0A0A45" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6 bg-gray-50">
      <div className="max-w-md bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">{data.heading}</h1>
        <p className="mb-6 text-gray-600">
          {data.subHeading}
        </p>
        <button 
          onClick={downloadPDF}
          className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors w-full"
        >
          {data.downloadButton}
        </button>
      </div>
    </div>
  );
};

export default ThankYou;