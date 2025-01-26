import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import BufferAnimation from "./BufferAnimation"

const PageLoadAnimation = ({ children }) => {
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 4000) // Adjust this time to match the total duration of your animations

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

  return (
    <AnimatePresence>
      {isAnimating ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-blue-500"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center">
            <div className="flex">
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
              className="mt-4 text-white text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
             <div className="space-y-8">
        {/* <BufferAnimation size={90} color="white" /> */}
      </div>
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



