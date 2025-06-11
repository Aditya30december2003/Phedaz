// import { useState, useRef, useEffect } from "react";
// import { Client, Databases } from "appwrite";
// import BufferAnimation from "../components/BufferAnimation";
// import Videos from '../assets/Video_1.mp4';

// const Video = () => {
//   const videoRef = useRef(null);
//   const [video, setVideo] = useState(null);
//   const [loading, setLoading] = useState(true); 

//   const client = new Client();
//   client.setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab");

//   const databases = new Databases(client);
//   const databaseId = "67913805000e2b223d80";
//   const collectionId = "6794f08c0027230ffdca";

//   useEffect(() => {
//     const fetchBlogs = async () => {
//       try {
//         const response = await databases.listDocuments(databaseId, collectionId);
//         setVideo(response.documents[0]);
//       } catch (error) {
//         console.error("Failed to fetch recent blogs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBlogs();
//   }, [databases]);

//   if (loading) {
//     return (
//       <div>
//         <BufferAnimation />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full max-w-7xl pt-32 mx-auto px-4 py-16 sm:px-6 lg:px-8">
//       <div className="text-center mb-12">
//         <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
//           {video?.Heading}
//         </h1>
//         <p className="text-xl text-gray-600">
//           {video?.subHeading}
//         </p>
//       </div>

//       <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-800 shadow-xl">
//         <video
//           ref={videoRef}
//           src={Videos}
//           className="w-full h-full object-cover"
//           controls
//           loop
//           playsInline
//         />

//         {/* Video Overlay Gradient */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50 pointer-events-none" />
//       </div>
//     </div>
//   );
// };

// export default Video;
"use client"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import { motion } from "framer-motion"
import { Share2, PlayIcon, PauseIcon, Check, RefreshCcw } from "lucide-react"
import { Client, Databases } from "appwrite"
import BufferAnimation from "../components/BufferAnimation"

gsap.registerPlugin(MotionPathPlugin)

const Video = () => {
  const backgroundRef = useRef(null)
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoData, setVideoData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [shareButtonText, setShareButtonText] = useState("Share Video")
  const [isBuffering, setIsBuffering] = useState(false)
  const [isSafari, setIsSafari] = useState(false)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isVideoEnded, setIsVideoEnded] = useState(false)
  const bufferingTimeoutRef = useRef(null)

  // Detect Safari and mobile devices
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isSafariBrowser = /^((?!chrome|android).)*safari/i.test(userAgent)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent)
    setIsSafari(isSafariBrowser || isMobile)
  }, [])

  // Background animation
  useEffect(() => {
    const backgroundAnimation = gsap.to(backgroundRef.current, {
      backgroundPosition: "300% center",
      ease: "power1.inOut",
      duration: 30,
      repeat: -1,
      yoyo: true,
    })
    return () => backgroundAnimation.kill()
  }, [])

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      console.log("Play event fired")
      setIsPlaying(true)
      setIsBuffering(false)
      setIsVideoEnded(false)
      clearTimeout(bufferingTimeoutRef.current)
    }

    const handlePause = () => {
      console.log("Pause event fired")
      setIsPlaying(false)
      setIsBuffering(false)
      clearTimeout(bufferingTimeoutRef.current)
    }

    const handleCanPlay = () => {
      setIsVideoReady(true)
      setIsBuffering(false)
      clearTimeout(bufferingTimeoutRef.current)
    }

    const handleWaiting = () => {
      // Only show buffering if we're actually playing or trying to play
      if (isPlaying || video.paused === false) {
        bufferingTimeoutRef.current = setTimeout(() => {
          setIsBuffering(true)
        }, 500) // Small delay to avoid flickering on brief buffering
      }
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setIsBuffering(false)
      setIsVideoEnded(true)
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isPlaying) {
        video.play().catch(console.error)
      }
    }

    // Safari and mobile-specific video setup
    const setupMobileVideo = () => {
      if (isSafari) {
        video.playsInline = true
        video.setAttribute('playsinline', 'true')
        video.setAttribute('webkit-playsinline', 'true')
        video.setAttribute('x-webkit-airplay', 'allow')
        
        // Attempt to prevent fullscreen on iOS
        video.disableRemotePlayback = true
        video.controlsList = "nodownload noplaybackrate"
      }
    }

    setupMobileVideo()

    // Add event listeners
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('ended', handleEnded)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Check initial state
    setIsPlaying(!video.paused)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('ended', handleEnded)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      clearTimeout(bufferingTimeoutRef.current)
    }
  }, [isSafari, isPlaying])

  const togglePlay = async () => {
    const video = videoRef.current
    if (!video) return

    try {
      // Handle video ended state
      if (isVideoEnded) {
        video.currentTime = 0
        setIsVideoEnded(false)
      }

      // Check if video is paused
      if (video.paused) {
        // Reset ready state when starting playback
        setIsVideoReady(false)
        setIsPlaying(true) // Force state update immediately
        
        // Comprehensive play attempt with multiple fallbacks
        try {
          // First, try standard play
          await video.play()
        } catch (standardPlayError) {
          console.warn("Standard play failed, attempting fallback:", standardPlayError)
          
          // Safari/Mobile-specific fallbacks
          try {
            // Mute and try play
            video.muted = true
            await video.play()
          } catch (mutedPlayError) {
            console.error("Muted play also failed:", mutedPlayError)
            
            // Last resort: force inline play with mute
            video.playsInline = true
            video.setAttribute('playsinline', 'true')
            video.muted = true
            await video.play()
          }
        }
      } else {
        // Pause video
        setIsPlaying(false) // Force state update immediately
        video.pause()
      }
    } catch (error) {
      console.error("Comprehensive play/pause error:", error)
      // Reset state if playback failed
      setIsPlaying(video && !video.paused)
    }
  }

  const resetVideo = () => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = 0
    setIsVideoEnded(false)
    togglePlay()
  }

  const shareVideo = () => {
    navigator.clipboard.writeText("https://phedaz.com/video").then(() => {
      setShareButtonText("Copied!")
      setTimeout(() => setShareButtonText("Share Video"), 2000)
    }).catch(console.error)
  }

  // This effect syncs isPlaying with actual video state
  useEffect(() => {
    const syncVideoState = () => {
      const video = videoRef.current
      if (!video) return
      
      const actuallyPlaying = !video.paused
      if (isPlaying !== actuallyPlaying) {
        console.log(`Syncing state: React state=${isPlaying}, Video state=${!video.paused}`)
        setIsPlaying(actuallyPlaying)
      }
    }
    
    const interval = setInterval(syncVideoState, 300)
    return () => clearInterval(interval)
  }, [isPlaying])

  // Fetch video data
  useEffect(() => {
    const client = new Client()
      .setEndpoint("https://centralapps.hivefinty.com/v1")
      .setProject("67912e8e000459a70dab")

    const databases = new Databases(client)
    
    const fetchData = async () => {
      try {
        const response = await databases.listDocuments(
          "67913805000e2b223d80",
          "6794f08c0027230ffdca"
        )
        setVideoData(response.documents[0])
      } catch (error) {
        console.error("Fetch error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BufferAnimation />
      </div>
    )
  }

  return (
    <div
      ref={backgroundRef}
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3] overflow-hidden pt-28"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center space-y-6 p-8 bg-[#0A0A45] bg-opacity-5 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl"
      >
        <div className="relative">
          <video
            ref={videoRef}
            src="https://phedaz.com/assets/Video_1-DY-XCcuc.mp4"
            playsInline
            webkit-playsinline="true"
            playsinline="true"
            x-webkit-airplay="allow"
            preload="metadata"
            className="rounded-2xl shadow-lg p-4 w-full max-w-4xl border-4 border-[#0A0A45]/20"
          />
          
          {/* Buffering overlay - only shows when actually buffering */}
          {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-2xl">
              <div className="text-white flex flex-col items-center">
                <BufferAnimation />
                <span className="mt-2">Loading...</span>
              </div>
            </div>
          )}

          {/* Video Controls */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            {/* Reset/Replay Button (for when video ends) */}
            {isVideoEnded && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={resetVideo}
                className="bg-[#0A0A45] hover:bg-[#0A0A45]/90 text-white rounded-full p-3 transition-all duration-300 shadow-lg"
                aria-label="Replay Video"
              >
                <RefreshCcw size={24} />
              </motion.button>
            )}

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="bg-[#0A0A45] hover:bg-[#0A0A45]/90 text-white rounded-full p-3 transition-all duration-300 shadow-lg"
              aria-label={isBuffering ? "Buffering" : (isPlaying ? "Pause" : "Play")}
            >
              {isBuffering ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <PauseIcon size={24} />
              ) : (
                <PlayIcon size={24} />
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareVideo}
            className={`px-8 py-3 ${
              shareButtonText === "Copied!" 
                ? "bg-green-500" 
                : "bg-[#0A0A45] hover:bg-[#0A0A45]/90"
            } text-white rounded-full font-bold text-lg shadow-lg transition-all flex items-center gap-2`}
          >
            {shareButtonText === "Share Video" ? <Share2 size={20} /> : <Check size={20} />}
            <span>{shareButtonText}</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

export default Video