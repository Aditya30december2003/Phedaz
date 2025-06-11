"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

// eslint-disable-next-line react/prop-types
const PageLoadAnimation = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 4500) // Increased duration to accommodate the new tagline animation

    return () => clearTimeout(timer)
  }, [])

  const letterAnimations = [
    { letter: "P", initial: { y: -100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    { letter: "h", initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    { letter: "e", initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 } },
    { letter: "d", initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 } },
    { letter: "a", initial: { rotate: -180, opacity: 0 }, animate: { rotate: 0, opacity: 1 } },
    { letter: "z", initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 } },
  ]

  const taglineWords = ["SOAR", "BEYOND", "LIMITS"]

  return (
    <AnimatePresence>
      {isAnimating ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-color"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            <div className="flex mb-4">
              {letterAnimations.map(({ letter, initial, animate }, index) => (
                <motion.span
                  key={letter}
                  className="text-6xl font-bold text-white inline-block"
                  initial={initial}
                  animate={animate}
                  transition={{
                    duration: 1.8,
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </div>
            <motion.div
              className="flex space-x-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
            >
              {taglineWords.map((word, index) => (
                <motion.span
                  key={word}
                  className="text-2xl font-semibold text-white"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 2.2 + index * 0.2,
                    duration: 0.8,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
            <motion.div
              className="mt-8 text-white text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5, duration: 0.5 }}
            >
              <div className="space-y-8">{/* <BufferAnimation size={90} color="white" /> */}</div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default PageLoadAnimation

