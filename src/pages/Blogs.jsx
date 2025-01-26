import { Client, Databases } from 'appwrite';
import { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import BufferAnimation from '../components/BufferAnimation';
const Insights = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize Appwrite client
  const client = new Client();
  client.setEndpoint('https://centralapps.hivefinty.com/v1') // Replace with your Appwrite endpoint
        .setProject('67912e8e000459a70dab'); // Replace with your Project ID

  const databases = new Databases(client);
  const databaseId = '67913805000e2b223d80'; // Replace with your Database ID
  const collectionId = '6791428700214651a0dd'; // Replace with your Collection ID

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId);
        setBlogs(response.documents);
        console.log(response.documents)
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <div>
      <BufferAnimation size={90} color="white" />
    </div>; 
  }

  return (
    <section className="py-[6rem] bg-white">
      <div className="container mx-auto px-4 text-center">
        <div className='relative'>
        {/* Header */}
        <div className='absolute text-white w-full h-full'>
        <div className='bg-black/60 w-[90%] lg:w-[60%] mx-auto my-auto mt-10 p-3'>
        <h2 className="text-3xl font-bold mb-4 text-white">{blogs[0].BlogPageHeading}</h2>
        <p className="text-gray-100 max-w-3xl mx-auto mb-12">
          {blogs[0].BlogPageSubHeading}
        </p>
        </div>
        </div>

        <img
          className="object-cover w-full h-[30rem] lg:h-[20rem]"
          src={blogs[0].bgImg}
          alt="Header"
        />

        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
       {blogs.map((blog) => (
        <Link to={`/blogs/${blog.$id}`} key={blog.$id} className="bg-white shadow-md rounded p-4">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-40 object-cover rounded mb-4"
          />
          <h2 className="text-lg font-semibold">{blog.title}</h2>
          <p className="text-gray-600">By {blog.author}</p>
          <p className="text-sm text-gray-500">{new Date(blog.Date).toDateString()}</p>
        </Link>
      ))}
      </div>
      </div>
    </section>
  );
};

export default Insights;

