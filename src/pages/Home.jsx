import React from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import Tab from '../components/Tab'
import Video from '../components/Video'
import Advantages from '../components/Advantages'
import Capabilities from '../components/Capabilities'
import Questions from '../components/Questions'
import BlogsComponent from '../components/BlogsComponent'
import WaitListForm from '../components/Form'
import NewTestComponent from '../components/NewTestComponent'
import GradientAnimation from '../components/GradientAnimation'

const Home = () => {
  return (
    <div className='flex flex-col gap-10'>
      <Hero />
      <About/>
      <Tab/>
      <Video/>
    <div className="relative">
      <GradientAnimation />
      <NewTestComponent />
    </div>
      <Advantages/>
      <Capabilities/>
      <BlogsComponent/>
      <Questions/>
      <WaitListForm/>
    </div> 
  )
}

export default Home
