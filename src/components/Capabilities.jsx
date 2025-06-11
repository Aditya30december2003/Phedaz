"use client"
import { motion } from "framer-motion"
import { useSwipeable } from "react-swipeable"
import CardSelector from "../components/card-selector"
import BorderOptions from "../components/border-options"
import { Client, Databases } from "appwrite";
import { useState, useEffect } from "react";

export default function VirtualCardPage() {
  const [selectedCard, setSelectedCard] = useState(1)

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setSelectedCard((prev) => (prev < 5 ? prev + 1 : prev)), // Swipe left to move to next card
    onSwipedRight: () => setSelectedCard((prev) => (prev > 1 ? prev - 1 : prev)), // Swipe right to move to previous card,
    preventScrollOnSwipe: true,
  })

  const [cards, setCards] = useState(null);
  const [loading, setLoading] = useState(true);

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
        console.error("Failed to fetch cards:", error);
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
    <div className="bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3] text-white p-4 sm:p-6 md:p-8" id="cap">
      <div className="max-w-6xl mx-auto">

        {/* Main Card Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative backdrop-blur-xl overflow-hidden border-[#0A0A45] border-[0.1rem] rounded-t-3xl"
          {...swipeHandlers} // Attach swipe handlers
        >
          {/* Folder-like top */}
          <div className="absolute top-0 left-0 right-0 h-12 sm:h-14 md:h-16 bg-[#0A0A45] rounded-t-3xl" />
           
          {/* Border Options */}
          <BorderOptions />

          <div className="pt-14 sm:pt-16 pb-6 sm:pb-8 px-4 sm:px-6 md:px-8" data-aos="fade-up" data-aos-delay={200}>
            {/* Card Selection Area */}
            <div className="mt-12 sm:mt-16">
              <div className="text-center">
                <h2 className="text-lg sm:text-md text-[#0A0A45] font-extrabold mb-1 sm:mb-2">{cards[0].Title}</h2>
                <p className="text-[2rem] sm:text-[3rem] lg:text-[4rem] font-extrabold text-[#000000]">
                  {cards[0].subTitle}
                </p>
              </div>

              {/* CardSelector */}
              <div className="mt-8 sm:mt-10">
                <CardSelector selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
