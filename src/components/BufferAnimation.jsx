import React from "react"
import { motion } from "framer-motion"

const BufferAnimation = ({ size = 40, borderColor = "#0373fc", borderWidth = 2 }) => {
  const cubeVariants = {
    animate: {
      rotateX: [0, 360],
      rotateY: [0, 360],
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Infinity,
      },
    },
  }

  const faceStyle = {
    position: "absolute",
    width: size,
    height: size,
    border: `${borderWidth}px solid ${borderColor}`,
    backgroundColor: "transparent",
  }

  return (
    <div className="flex w-full h-screen bg-white items-center justify-center perspective-500">
      <motion.div
        className="relative"
        style={{
          width: size,
          height: size,
          transformStyle: "preserve-3d",
        }}
        variants={cubeVariants}
        animate="animate"
      >
        {/* Front face */}
        <motion.div style={{ ...faceStyle, transform: `translateZ(${size / 2}px)` }} />
        {/* Back face */}
        <motion.div style={{ ...faceStyle, transform: `translateZ(${-size / 2}px) rotateY(180deg)` }} />
        {/* Right face */}
        <motion.div style={{ ...faceStyle, transform: `translateX(${size / 2}px) rotateY(90deg)` }} />
        {/* Left face */}
        <motion.div style={{ ...faceStyle, transform: `translateX(${-size / 2}px) rotateY(-90deg)` }} />
        {/* Top face */}
        <motion.div style={{ ...faceStyle, transform: `translateY(${-size / 2}px) rotateX(90deg)` }} />
        {/* Bottom face */}
        <motion.div style={{ ...faceStyle, transform: `translateY(${size / 2}px) rotateX(-90deg)` }} />
      </motion.div>
    </div>
  )
}

export default BufferAnimation
