import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Client, Databases, Query } from "appwrite"

const BlogsComponent = () => {
  const [recentBlogs, setRecentBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [blogs, setBlogs] = useState([])

  // Initialize Appwrite client
  const client = new Client()
  client
    .setEndpoint("https://centralapps.hivefinty.com/v1") // Replace with your Appwrite endpoint
    .setProject("67912e8e000459a70dab") // Replace with your Project ID

  const databases = new Databases(client)
  const databaseId = "67913805000e2b223d80" // Replace with your Database ID
  const collectionId = "6791428700214651a0dd" // Replace with your Collection ID

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId, [
          Query.limit(5),
          Query.orderDesc("Date"), // Order blogs by the most recent Date
        ])
        const response2 = await databases.listDocuments(databaseId, collectionId)
        setBlogs(response2.documents)
        setRecentBlogs(response.documents)
      } catch (error) {
        console.error("Failed to fetch recent blogs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogs()
  }, [databases, databaseId, collectionId]) // Added dependencies for databases.listDocuments

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-blue-100 p-4 sm:p-8">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 sm:mb-4">{blogs[0]?.HomePageHeading}</h1>
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-700 mb-4 sm:mb-6">
          {blogs[0]?.HomePageSubHeading}
        </h3>
        <Link to="/blogs">
          <button className="px-4 sm:px-6 py-2 bg-blue-600 text-white text-sm sm:text-base rounded hover:bg-purple-800 transition-colors duration-300">
            See all blogs
          </button>
        </Link>
      </div>

      <div className="group relative mt-6 sm:mt-8 flex flex-wrap w-full lg:w-[90%] xl:w-[80%] p-2 sm:p-4 mx-auto justify-center gap-2 perspective-[1000px]">
        {recentBlogs.map((blog, index) => (
          <Link
            to={`/blogs/${blog.$id}`}
            key={blog.$id}
            className={`blog-card relative w-36 h-68 sm:w-40 sm:h-80 lg:w-60 lg:h-96 p-2 sm:p-4 rounded-lg shadow-lg transition-all duration-500 bg-white
              ${
                index === 0
                  ? "rotate-[-30deg] translate-x-4 z-10"
                  : index === 1
                    ? "rotate-[5deg] translate-x-2 z-20"
                    : index === 2
                      ? "rotate-[30deg] translate-x-4 z-30"
                      : index === 3
                        ? "rotate-[-10deg] translate-x-[-2px] z-40"
                        : index === 4
                          ? "rotate-[10deg] translate-x-[-4px] z-40"
                          : ""
              }
              hover:rotate-0 hover:translate-x-0 hover:scale-110 hover:z-50
              group-hover:rotate-0 group-hover:translate-x-0 group-hover:scale-100`}
          >
            <img
              src={blog.image || "/placeholder.svg"}
              alt={blog.title}
              className="w-full h-24 sm:h-32 object-cover rounded-md mb-2 sm:mb-4"
            />
            <h2 className="text-xs sm:text-sm lg:text-base font-semibold mb-2 line-clamp-2">{blog.title}</h2>
            <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">By {blog.author}</p>
            <p className="text-xs text-gray-500 mb-2 sm:mb-4">{new Date(blog.Date).toDateString()}</p>
            <Link to={`/blogs/${blog.$id}`} className="text-blue-600 text-xs sm:text-sm lg:text-base hover:underline">
              Read More
            </Link>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default BlogsComponent

