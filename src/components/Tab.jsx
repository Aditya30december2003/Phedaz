import React, { useState } from "react";

const Tab = () => {
  const [activeTab, setActiveTab] = useState("tab1");

  const tabs = [
    {
      id: "tab1",
      title: "Simplify your path from startup to star",
      content: (
        <div>
          <img
            src="/path-to-image1.jpg"
            alt="Startup"
            className="w-full h-auto mb-4 rounded-lg"
          />
          <p>
            Welcome to the future of business management. Our all-in-one
            platform streamlines every step of your journey—from swift business
            incorporation to building stunning no-code or low-code websites.
          </p>
        </div>
      ),
    },
    {
      id: "tab2",
      title: "Step into the future of business management",
      content: (
        <div>
          <img
            src="/path-to-image2.jpg"
            alt="Future"
            className="w-full h-auto mb-4 rounded-lg"
          />
          <p>
            Manage inventory, integrate multi-channel sales, process payments,
            and access global banking facilities. Simplify operations and fuel
            your growth.
          </p>
        </div>
      ),
    },
    {
      id: "tab3",
      title: "Lead the market. Leave the complexity to us",
      content: (
        <div>
          <img
            src="/path-to-image3.jpg"
            alt="Market Leader"
            className="w-full h-auto mb-4 rounded-lg"
          />
          <p>
            Whether you're launching your first online store or scaling an
            established brand, our unified solutions help you focus on what you
            do best.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4 bg-yellow-500">
      <h2 className="text-3xl font-bold text-center mb-8">Explore Our Platform</h2>
      <div className="flex justify-center space-x-4 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 rounded-lg ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {tabs.find((tab) => tab.id === activeTab)?.content}
      </div>
    </div>
  );
};

export default Tab;

