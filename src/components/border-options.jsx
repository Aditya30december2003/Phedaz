"use client";

import { motion } from "framer-motion";
import { ImCross } from "react-icons/im";
import { FaMinus } from "react-icons/fa";
import { IoSquareOutline } from "react-icons/io5";


// eslint-disable-next-line react/jsx-key
const options = [<FaMinus/>, <IoSquareOutline/> , <ImCross/> ];

export default function BorderOptions() {
  return (
    <div className="absolute top-0 right-0 left-0">
      {/* Curved background with gradient */}
      {/*  */}
      
      {/* Options container */}
      <div className="relative flex justify-end">
        <div className="flex gap-2 px-4 py-3 rounded-full">
          {options.map((option, index) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative text-sm px-2 rounded-[100%] py-2 transition-all duration-300 ${
                index === 2
                  ? "bg-red-500 text-white font-semibold shadow-lg"
                  : "bg-green text-zinc-400 hover:text-white hover:bg-zinc-700"
              } ${index === 2 ? "active-tab" : "file-tab"}`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
