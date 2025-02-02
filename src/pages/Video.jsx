import { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";
import { Client, Databases } from "appwrite"
import BufferAnimation from "../components/BufferAnimation"

const Video = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const [video , setVideo] = useState(null)
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    if (!videoRef.current) return;
    const handleEnded = () => setIsPlaying(false);
    videoRef.current.addEventListener("ended", handleEnded);
    return () => videoRef.current?.removeEventListener("ended", handleEnded);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

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
    <div className="w-full max-w-7xl pt-32 mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4">
          {video?.Heading}
        </h1>
        <p className="text-xl text-gray-600">
          {video?.subHeading}
        </p>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-800 shadow-xl">
      <video
      src={video?.Video}
      className="w-full h-full object-cover"
      loop
      muted
      autoPlay
      playsInline
      controls
      />


        {/* <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="rounded-full bg-white/90 p-4 text-gray-900 shadow-lg backdrop-blur-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/20"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </button>
        </div> */}

        {/* Video Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-50" />
      </div>
    </div>
  );
};

export default Video;
