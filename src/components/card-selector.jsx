"use client";
import { Client, Databases } from "appwrite";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

// eslint-disable-next-line react/prop-types
export default function CardSelector({ selectedCard, setSelectedCard }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const handlePrevious = () => {
    setSelectedCard(selectedCard === 0 ? cards.length - 1 : selectedCard - 1);
  };

  const handleNext = () => {
    setSelectedCard(selectedCard === cards.length - 1 ? 0 : selectedCard + 1);
  };

const client = new Client()
  .setEndpoint("https://appwrite.hivefinty.com/v1") // ✅ New Appwrite instance
  .setProject("68472e8400352e6aa1e2");              // ✅ New Project ID (phedaz)


  const databases = new Databases(client);
  const databaseId = "67913805000e2b223d80"; // Replace with your Database ID
  const collectionId = "679231250003dc649145"; // Replace with your Collection ID

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId);
        setCards(response.documents);
        console.log(response.documents);
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative flex items-center justify-center mt-8">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 z-10 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 md:p-3 lg:p-4"
      >
        <ChevronLeft size={24} />
      </button>

      {/* Card Container */}
      <div className="relative w-full max-w-[100%] sm:max-w-[800px] md:max-w-[800px] lg:max-w-[900px] h-[350px] md:h-[380px]">
        <AnimatePresence initial={false}>
          {cards.map((card, index) => (
            <motion.div
              key={card.$id}
              className={`absolute w-full max-w-[90%] md:max-w-[620px] h-full rounded-xl p-6 mx-auto 
                ${index === selectedCard ? "z-30" : "z-0"}
                ${
                  index === selectedCard - 1 ||
                  (selectedCard === 0 && index === cards.length - 1)
                    ? "-translate-x-[110%]"
                    : ""
                }
                ${
                  index === selectedCard + 1 ||
                  (selectedCard === cards.length - 1 && index === 0)
                    ? "translate-x-[110%]"
                    : ""
                }
              `}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: index === selectedCard ? 1 : 0.8,
                opacity: index === selectedCard ? 1 : 0.6,
                x: index === selectedCard
                  ? "-50%"
                  : index === selectedCard - 1
                  ? "-100%"
                  : "50%",
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                left: "50%",
                transform: `translateX(-50%) ${
                  index === selectedCard - 1 ||
                  (selectedCard === 0 && index === cards.length - 1)
                    ? "translateX(-180px)"
                    : index === selectedCard + 1 ||
                      (selectedCard === cards.length - 1 && index === 0)
                    ? "translateX(180px)"
                    : ""
                }`,
              }}
            >
              <div
                className={`w-full h-full bg-gray-800 rounded-xl p-6 flex flex-col`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-white/10" />
                  <div className="w-8 h-8 rounded-full bg-white/10" />
                </div>
                <div className="flex flex-col h-full">
                  <div className="h-[20%] md:h-[30%]">
                    <img
                      src={card.image}
                      alt=""
                      className="h-full mx-auto object-contain"
                    />
                  </div>
                  <div className="text-center mt-5 text-md md:text-xl font-bold">
                    {card.Capability}
                  </div>
                  <div className="text-center mt-4 text-[0.5rem] md:text-[0.8rem]">
                    {card.CapabilityContent}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className="absolute right-0 z-10 p-2 rounded-full bg-zinc-800 hover:bg-zinc-700 md:p-3 lg:p-4"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
