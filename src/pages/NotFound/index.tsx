import React from 'react'
import { Link } from 'react-router-dom'
import D404 from '../../assets/img/404.svg'
const NotFound = () => {
  return (
    <div className='min-h-screen w-full bg-gray-100 justify-center items-center flex text-5xl font-bold relative'>

<div className="h-screen w-screen bg-gray-50 flex items-center">
    <div className="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
            <div className="w-full lg:w-1/2 mx-8">
                <div className="text-7xl text-primary font-dark font-extrabold mb-8"> 404</div>
            <p className="text-2xl md:text-3xl font-light leading-normal mb-8">
                Sorry we couldn't find the page you're looking for
            </p>
            
            <Link to="/" className="px-5 inline py-3 text-sm font-medium leading-5 shadow-2xl text-white transition-all duration-400 border border-transparent rounded-lg focus:outline-none bg-primary ">back to homepage</Link>
    </div>
        <div className="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
        <img src={D404} className="" alt="Page not found" />
        </div>
    
    </div>
</div>
    </div>
  )
}

export default NotFound