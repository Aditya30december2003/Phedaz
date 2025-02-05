import Hero from '../components/Hero'
import About from '../components/About'
import Tab from '../components/Tab'
import Video from '../components/Video'
import Advantages from '../components/Advantages'
import Capabilities from '../components/Capabilities'
import Questions from '../components/Questions'
import BlogsComponent from '../components/BlogsComponent'
import WaitListForm from '../components/Form'
// import PageLoadAnimation from '../components/PageLoadAnimation'

const Home = () => {
  return (
    // <PageLoadAnimation>
    <div className='flex flex-col gap-10'>
      <Hero/>
      <About/>
      <Tab/>
      <Video/> 
      <Advantages/>
      <BlogsComponent/>
      <Capabilities/>
      <Questions/>
      <WaitListForm/>
    </div> 
    // </PageLoadAnimation>
  )
}

export default Home
