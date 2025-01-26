import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Client, Databases } from 'appwrite';

const BlogPage = () => {
  const { blogId } = useParams(); // Get Blog ID from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Appwrite client
  const client = new Client();
  client.setEndpoint('https://centralapps.hivefinty.com/v1') // Replace with your Appwrite endpoint
  .setProject('67912e8e000459a70dab'); // Replace with your Project ID

  const databases = new Databases(client);
  const databaseId = '67913805000e2b223d80'; // Replace with your Database ID
  const collectionId = '6791428700214651a0dd'; // Replace with your Collection ID

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await databases.getDocument(databaseId, collectionId, blogId);
        setBlog(response);
      } catch (error) {
        console.error("Failed to fetch blog details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  if (loading) {
    return <div>Loading...</div>;
  } 

  if (!blog) {
    return <div>Blog not found!</div>;
  }

  return (
    <div className="p-4 pt-20 mb-10">
      <img
        src={blog.image}
        alt={blog.title}
        className="w-full h-80 object-cover rounded mb-4"
      />
      <h1 className="text-3xl font-bold mb-2 text-center">{blog.title}</h1>
      <p className="text-gray-600 mb-4 text-center">By {blog.author}</p>
      <p className="text-sm text-gray-500 mb-4">
        Published on {new Date(blog.Date).toDateString()}
      </p>
      <div className="text-md text-gray-800">{blog.Content}</div>
    </div>
  );
};

export default BlogPage;
