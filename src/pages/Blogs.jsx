import { Client, Databases } from "appwrite"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import BufferAnimation from "../components/BufferAnimation"
import AOS from "aos"
import "aos/dist/aos.css"

const Insights = () => {
  const [blogs, setBlogs] = useState([])
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

    const fetchBlogs = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId)
        setBlogs(response.documents)
      } catch (error) {
        console.error("Failed to fetch blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [databases.listDocuments]) // Added dependency for databases.listDocuments

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3]">
        <BufferAnimation size={90} color="#0A0A45" />
      </div>
    )
  }

  return (
    <section className="py-[6rem] bg-gradient-to-b from-[#E5F0F1] to-[#FFF5C3]">
      <div className="container mx-auto px-4 text-center">
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="w-[90%] lg:w-[60%] p-6 rounded-lg" data-aos="fade-up">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">{blogs[0]?.BlogPageHeading}</h2>
              <p className="text-gray-100 max-w-3xl mx-auto mb-6">{blogs[0]?.BlogPageSubHeading}</p>
            </div>
          </div>
          <img
            className="object-cover w-full h-[30rem] lg:h-[24rem] rounded-lg shadow-lg"
            src={blogs[0]?.bgImg || "/placeholder.svg"}
            alt="Header"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <Link
              to={`/blogs/${blog.$id}`}
              key={blog.$id}
              className="bg-white shadow-lg rounded-lg overflow-hidden transform transition duration-500 hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <img src={blog.image || "/placeholder.svg"} alt={blog.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-semibold text-[#0A0A45] mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-2">By {blog.author}</p>
                <p className="text-sm text-gray-500">{new Date(blog.Date).toDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Insights

