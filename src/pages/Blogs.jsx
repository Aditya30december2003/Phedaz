import React from "react";

const Insights = () => {
  const blogs = [
    {
      author: "Mark Joe",
      date: "20 Nov 2024",
      title: "Leveraging No-Code and Low-Code Solutions",
      image: "https://via.placeholder.com/300", // Replace with actual image URL
      link: "#",
    },
    {
      author: "Chantal Wilson",
      date: "20 Nov 2024",
      title: "Effective Strategies for Inventory Management",
      image: "https://via.placeholder.com/300", // Replace with actual image URL
      link: "#",
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4 text-center">
        {/* Header */}
        <h2 className="text-3xl font-bold mb-4 text-[#0D112B]">Insights</h2>
        <p className="text-gray-600 max-w-3xl mx-auto mb-12">
          Dive into the insights that drive success! Our blog is your go-to
          resource for tips, strategies, and industry updates designed to
          enhance your business operations. Whether you're looking to optimize
          your processes, explore new trends, or solve common challenges, our
          expertly curated articles provide valuable knowledge to help you grow
          and succeed in today's fast-paced market. Join us on this journey of
          continuous learning and innovation!
        </p>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <p className="text-gray-500 text-sm mb-2">
                  {blog.author} - {blog.date}
                </p>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {blog.title}
                </h3>
                <a
                  href={blog.link}
                  className="text-blue-500 hover:underline text-sm"
                >
                  Read More ...
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Insights;

