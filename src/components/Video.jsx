"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { motion } from "framer-motion"
import { Share2, Play, Pause, Check } from "lucide-react"
import { Client, Databases } from "appwrite"
import BufferAnimation from "./BufferAnimation"
import Videos from '../assets/Phedaz_Video.mp4'

gsap.registerPlugin(MotionPathPlugin)

const Video = () => {
  const backgroundRef = useRef(null)
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [video, setVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareButtonText, setShareButtonText] = useState("Share Video")

  useEffect(() => {
    const backgroundAnimation = gsap.to(backgroundRef.current, {
      backgroundPosition: "300% center",
      ease: "power1.inOut",
      duration: 30,
      repeat: -1,
      yoyo: true,
    })

    return () => {
      backgroundAnimation.kill()
    }
  }, [])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const shareVideo = () => {
    navigator.clipboard.writeText("https://phedaz.com/video").then(() => {
      setShareButtonText("Copied to clipboard!")
      setTimeout(() => setShareButtonText("Share Video"), 2000)
    })
  }

  const client = new Client()
  client.setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "6794f08c0027230ffdca"

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId)
        setVideo(response.documents[0])
      } catch (error) {
        console.error("Failed to fetch recent blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [databases])

  if (loading) {
    return (
      <div>
        <BufferAnimation />
      </div>
    )
  }

  return (
    <div
      ref={backgroundRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3] overflow-hidden"
    >
      {/* Video Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center space-y-6 p-8 bg-[#0A0A45] bg-opacity-5 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl"
      >
        <div className="relative">
          <video
            ref={videoRef}
            src={Videos}
            loop
            autoPlay
            muted
            playsInline
            className="rounded-2xl shadow-lg p-4 w-full max-w-4xl border-4 border-[#0A0A45]/20"
            data-aos="flip-up"
            data-aos-delay="300"
          />
          <button
            onClick={togglePlay}
            className="absolute bottom-4 right-4 bg-[#0A0A45] hover:bg-[#0A0A45]/90 text-white rounded-full p-3 transition-all duration-300 shadow-lg"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareVideo}
            className={shareButtonText ?"px-8 py-3 bg-[#0A0A45] text-white rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all hover:bg-[#0A0A45]/90 flex items-center space-x-2" : "bg-green-500"}
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            {shareButtonText === "Share Video" ? <Share2 size={20} /> : <Check size={20} />}
            <span>{shareButtonText}</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-20"
        >
          <path d="M0,200 C400,400 800,0 1440,200 L1440,320 L0,320 Z" fill="url(#gradient)"></path>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#0A0A45", stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: "#E5F0F1", stopOpacity: 0.2 }} />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Particles */}
      {[...Array(20)].map((_, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-[#0A0A45]"
          style={{
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            opacity: 0.1,
          }}
          animate={{
            x: [0, Math.random() * 400 - 200],
            y: [0, Math.random() * 400 - 200],
            scale: [1, Math.random() + 0.5],
            opacity: [0.1, 0.2],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

export default Video

