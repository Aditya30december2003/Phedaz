import React from 'react'
import { Link } from 'react-router-dom'
const BlogsComponent = () => {
  return (
    <div className='bg-purple-100'>
      <div>
        <h1 className='text-[3rem]'>Latest Blogs</h1>
        <div>
        <h3>Get the latest updates, tips & tricks from our experts.</h3>
        <Link to='/blogs' className=''><button>See all blogs</button></Link>
        </div>
      </div>
    </div>
  )
}

export default BlogsComponent
