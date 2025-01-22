import React from "react";

const Capabilities = () => {
  const capabilities = [
    {
      image: "https://via.placeholder.com/150",
      heading: "AI-Powered Insights",
      content: "Gain actionable insights through AI-driven analytics and data visualization.",
    },
    {
      image: "https://via.placeholder.com/150",
      heading: "Seamless Integration",
      content: "Connect your existing tools and platforms with ease.",
    },
    {
      image: "https://via.placeholder.com/150",
      heading: "Real-Time Monitoring",
      content: "Stay informed with real-time updates on all aspects of your business.",
    },
    {
      image: "https://via.placeholder.com/150",
      heading: "Custom Workflows",
      content: "Build workflows tailored to your unique business processes.",
    },
    {
      image: "https://via.placeholder.com/150",
      heading: "Scalable Solutions",
      content: "Start small and scale effortlessly as your business grows.",
    },
    {
      image: "https://via.placeholder.com/150",
      heading: "Enhanced Security",
      content: "Protect your data with enterprise-grade security protocols.",
    },
    {
      image: "https://via.placeholder.com/150",
      heading: "Global Accessibility",
      content: "Access your platform from anywhere in the world, anytime.",
    },
    {
      image: "https://via.placeholder.com/150",
      heading: "Custom Branding",
      content: "Create a platform that matches your brand identity.",
    },
    {
      image: "https://via.placeholder.com/150",
      heading: "Automated Processes",
      content: "Save time with automated workflows and operations.",
    },
    {
      image: "https://via.placeholder.com/150",
      heading: "Dedicated Support",
      content: "Rely on our team for exceptional customer support, 24/7.",
    },
  ];

  return (
    <section className="py-12 bg-purple-400">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Our Capabilities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((capability, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={capability.image}
                alt={capability.heading}
                className="w-full h-40 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {capability.heading}
              </h3>
              <p className="text-gray-700">{capability.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Capabilities;

