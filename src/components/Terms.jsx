import { Link } from 'react-router-dom'
const Terms = () => {
  return (
    <div className='p-5'>
      <div className='flex gap-5'>
        <Link to='/terms'>Legals</Link>
        <Link to=''>Terms & Conditions</Link>
        <Link to=''>Privacy policy</Link>
        <Link to=''>Cookie policy</Link>
        <Link to=''>Terms of Use</Link>
      </div>
    </div>
  )
}

export default Terms
