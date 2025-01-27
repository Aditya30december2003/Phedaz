import { useEffect, useState } from "react";

const TermsLayout = ({ terms }) => {
  const [activeTerm, setActiveTerm] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});

  // Toggle the expanded state of a section
  const toggleSection = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Scroll to a section smoothly
  const handleClick = (id) => {
    const section = document.getElementById(id);
    if (section) {
      const headerOffset = 80;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      setActiveTerm(id);
    }
  };

  useEffect(() => {
    console.log("Terms received:", terms);
  }, [terms]);

  if (!terms || !terms.ContentTitle || terms.ContentTitle.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading Terms...</div>
      </div>
    );
  }

  return (
    <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex gap-10 py-8">
        {/* Left Navigation */}
        <div className="w-[35%] h-screen sticky top-20 hidden md:block overflow-hidden">
          <nav>
            <ul className="flex flex-col gap-4 p-4">
              {terms.ContentTitle.map((item, id) => (
                <li key={id} className="relative duration-100">
                  <div
                    className={`absolute -left-4 top-0 h-full w-1 transition-all duration-200 ${
                      activeTerm === id ? "bg-green-500" : "bg-transparent"
                    }`}
                  />
                  <button
                    onClick={() => handleClick(`section-${id}`)}
                    className={`font-medium duration-200 text-left text-[0.9rem] w-full hover:text-green-600 ${
                      activeTerm === id ? "text-green-700 scale-105" : ""
                    }`}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right Content */}
        <div className="w-full md:w-[70%]">
          {terms.ContentTitle.map((title, id) => (
            <section key={id} id={`section-${id}`} className="mb-16">
              <div
                className="cursor-pointer flex justify-between items-center"
                onClick={() => toggleSection(id)}
              >
                <h2 className="text-[1rem] font-medium">{title}</h2>
                <button
                  className={`text-lg font-medium transition-transform ${
                    expandedSections[id] ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </button>
              </div>
              {expandedSections[id] && (
                <div className="mt-4 text-[0.95rem] leading-relaxed prose prose-purple max-w-none">
                  {terms.Content[id]}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsLayout;
