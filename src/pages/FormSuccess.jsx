// pages/ThankYou.jsx
import { useEffect } from 'react';

const ThankYou = () => {
  const userResponse = localStorage.getItem("submittedFormData");

  const downloadResponse = () => {
    const data = JSON.parse(userResponse);
    let content = "Your Submitted Answers:\n\n";
    for (const key in data) {
      content += `${key}: ${Array.isArray(data[key]) ? data[key].join(', ') : data[key]}\n`;
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Your_Phedaz_Response.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-3xl font-bold mb-4">🎉 Your response has been submitted!</h1>
      <p className="mb-6 text-gray-600">Thank you for your interest in Phedaz Early Access.</p>
      <button 
        onClick={downloadResponse}
        className="bg-gray-900 text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
      >
        Download Your Response
      </button>
    </div>
  );
};

export default ThankYou;
