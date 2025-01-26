import './App.css'
import { Route , Routes } from 'react-router-dom'
import Home from '../src/pages/Home'
import Blogs from '../src/pages/Blogs'
import Terms from '../src/pages/Terms'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BlogDetails from '../src/pages/BlogDetails'
import TermsPage from './pages/TermsPage'
function App() {

  return (
    <>
    <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blogs' element={<Blogs/>} />
        <Route path="/blogs/:blogId" element={<BlogDetails />} />
        <Route path='/legals' element={<Terms/>} />
        <Route path='/legals/:legalId' element={<TermsPage/>} />
      </Routes>
    <Footer /> 
    </>
  )
}

export default App
