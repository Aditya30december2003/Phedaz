import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const GradientAnimation = () => {
  const gradientRef = useRef(null)

  useEffect(() => {
    const gradient = gradientRef.current

    gsap.to(gradient, {
      background: "linear-gradient(45deg, #4a00e0, #8e2de2, #4a00e0)",
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    })
  }, [])

  return (
    <div
      ref={gradientRef}
      className="absolute inset-0 -z-10"
      style={{
        background: "linear-gradient(45deg, #4a00e0, #8e2de2)",
        opacity: 0.5,
      }}
    />
  )
}

export default GradientAnimation

