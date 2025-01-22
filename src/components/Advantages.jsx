import React from "react";
import AdvantagesImage from '../assets/Advantages.png'

const Advantages=()=> {
  const advantages = [
    {
      title: "Innovative Technology",
      description:
        "Stay at the forefront of innovation with our cutting-edge technology. Our platform is constantly evolving, integrating the latest advancements such as AI-driven analytics and blockchain-enhanced security to give you a competitive edge.",
    },
    {
      title: "Scalable Infrastructure",
      description:
        "Start small and grow big with Storekwil. Our scalable infrastructure ensures that as your business expands, our platform scales effortlessly with you.",
    },
    {
      title: "Global Reach",
      description:
        "Leverage our global reach capabilities. Our platform supports multiple languages and currencies, enabling you to seamlessly connect with customers and comply with local market regulations worldwide.",
    },
    {
      title: "Unmatched Security",
      description:
        "Security is non-negotiable. At Storekwil, we protect your business with top-tier, real-time security solutions, ensuring your data and transactions are safe.",
    },
    {
      title: "Customizable Solutions",
      description:
        "We celebrate your uniqueness. Tailor your operations with our customizable solutions. Adapt tools and features to fit your specific needs, optimizing efficiency across your business processes.",
    },
    {
      title: "Dedicated Support",
      description:
        "Storekwil’s commitment to your success is reflected in our exceptional customer support. Our expert team is always ready to assist you.",
    },
  ];

  return (
    <section className="py-12 bg-gray-50 bg-pink-600">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Discover the Storekwil Advantages
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-4 text-blue-600">
                {advantage.title}
              </h3>
              <p className="text-gray-700">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <img src={AdvantagesImage} alt="" />
      </div>
    </section>
  );
}

export default Advantages;


