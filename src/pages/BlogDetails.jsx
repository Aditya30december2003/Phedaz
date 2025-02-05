import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Client, Databases } from "appwrite"
import BufferAnimation from "../components/BufferAnimation"
import AOS from "aos"
import "aos/dist/aos.css"

const BlogPage = () => {
  const { blogId } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize Appwrite client
  const client = new Client()
  client.setEndpoint("https://centralapps.hivefinty.com/v1").setProject("67912e8e000459a70dab")

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80"
  const collectionId = "6791428700214651a0dd"

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-cubic",
    })

    const fetchBlog = async () => {
      try {
        const response = await databases.getDocument(databaseId, collectionId, blogId)
        setBlog(response)
      } catch (error) {
        console.error("Failed to fetch blog details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [blogId, databases])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3]">
        <BufferAnimation size={90} color="#0A0A45" />
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3]">
        <h2 className="text-2xl font-bold text-[#0A0A45]">Blog not found!</h2>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3] py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" data-aos="fade-up">
          <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-80 object-cover" />
          <div className="p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#0A0A45] text-center" data-aos="fade-up">
              {blog.title}
            </h1>
            <p className="text-gray-600 mb-4 text-center" data-aos="fade-up" data-aos-delay="100">
              By {blog.author}
            </p>
            <p className="text-sm text-gray-500 mb-6 text-center" data-aos="fade-up" data-aos-delay="200">
              Published on {new Date(blog.Date).toDateString()}
            </p>
            <div className="text-md text-gray-800 leading-relaxed" data-aos="fade-up" data-aos-delay="300">
              {blog.Content}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage

