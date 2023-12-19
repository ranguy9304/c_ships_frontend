import Image from 'next/image'
import Navbar from './(components)/Navbar'
import Map from './(components)/Map'
import Test from './(components)/Test'

export default function Home() {
  return (
    <div className='App'>
      <Navbar/>
      {/* <Map/> */}
      <Test/>
    </div>
  )
}
