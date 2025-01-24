"use client";

import { motion } from "framer-motion";

const options = ["Get Cashback", "Simple Top-Up", "Unique Design"];

export default function BorderOptions() {
  return (
    <div className="absolute top-0 right-0 left-0">
      {/* Curved background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b to-transparent h-20 rounded-t-[2rem] border-b-4 " />
      
      {/* Options container */}
      <div className="relative flex justify-end">
        <div className="flex gap-2 px-4 py-3 rounded-full">
          {options.map((option, index) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative text-sm px-6 py-2 transition-all duration-300 ${
                index === 2
                  ? "bg-gradient-to-r from-green-400 to-blue-400 text-black font-semibold shadow-lg"
                  : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700"
              } ${index === 2 ? "active-tab" : "file-tab"}`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .file-tab {
          clip-path: polygon(
            0 100%,
            0 50%,
            10% 25%,
            90% 25%,
            100% 50%,
            100% 100%
          );
        }

        .active-tab {
          clip-path: polygon(
            0 100%,
            0 25%,
            10% 0%,
            90% 0%,
            100% 25%,
            100% 100%
          );
        }
      `}</style>
    </div>
  );
}
