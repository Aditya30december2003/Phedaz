import React from "react"
import { motion } from "framer-motion"

const BufferAnimation = ({ size = 40, borderColor = "#0A0A45", borderWidth = 2, fullScreen = false }) => {
  const cubeVariants = {
    animate: {
      rotateX: [0, 360],
      rotateY: [0, 360],
      transition: {
        duration: 3,
        ease: "linear",
        repeat: Number.POSITIVE_INFINITY,
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

  const containerStyle = fullScreen
    ? "flex w-full h-screen items-center justify-center perspective-500"
    : "flex items-center justify-center perspective-500"

  return (
    <div className={`${containerStyle} bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3]`}>
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

