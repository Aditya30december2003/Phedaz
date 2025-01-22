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

const Home = () => {
  return (
    <div>
      <Hero />
      <About/>
      <Tab/>
      <Video/>
      <Advantages/>
      <Capabilities/>
      <BlogsComponent/>
      <Questions/>
      <WaitListForm/>
    </div> 
  )
}

export default Home
