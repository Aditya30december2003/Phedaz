import { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// Components that should load immediately
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollTop from './components/ScrollTop';
import BufferAnimation from './components/BufferAnimation';
import Questions from '../src/pages/Questions'
import ThankYou  from './pages/FormSuccess';
// Lazy load route components
const Home = lazy(() => import('../src/pages/Home'));
const Blogs = lazy(() => import('../src/pages/Blogs'));
const BlogDetails = lazy(() => import('../src/pages/BlogDetails'));
const Terms = lazy(() => import('../src/pages/Terms'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const Video = lazy(() => import('./pages/Video'))
// Simple loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <BufferAnimation/>
  </div>
);

function App() {
  return (
    <>
      <Navbar />
      <ScrollTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:blogId" element={<BlogDetails />} />
          <Route path="/legals" element={<Terms />} />
          <Route path="/legals/:legalId" element={<TermsPage />} />
          <Route path='/video' element={<Video/>} />
          <Route path='/questionnaire' element={<Questions/>} />
          <Route path='/thankyou' element={<ThankYou/>} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

export default App;