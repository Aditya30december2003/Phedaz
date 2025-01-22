import SocialLinks from "./SocialLinks"
function Hero() {
  return (
    <section className="bg-blue-600 text-white py-20">
      <div className="head">
        <h1>Empower Your Business with Storekwil</h1>
        <div>
          <div>
            Sentences animation
          </div>
          <button>
            Join Our Waitlist
          </button>
        </div>
        <div>
        <video src='https://storekwil.com/herobg.mp4' loop autoPlay muted playsInline className="your-custom-class"/>
        </div>
      </div>
      <div>
      <SocialLinks/>
      </div>

      <div>
        <div><h1>Be first in line for business success—join our waitlist today!</h1></div>
        <div><button><p>Lets Go</p></button></div>
      </div>
    </section>
  )
}

export default Hero

