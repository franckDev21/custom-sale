import React from 'react'
import { Link } from 'react-router-dom'
import NotFundIcon from '../../atoms/Icon/NotFundIcon'

const NotFound = () => {
  return (
    <div className='min-h-screen w-full bg-gray-100 justify-center items-center flex text-5xl font-bold relative'>
      <NotFundIcon />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className='text-gray-700 bg-white bg-opacity-70 shadow-md py-4 px-6 rounded-md flex flex-col justify-center items-center'>
          <span>Page NotFound</span>
          <Link to='/' className='text-base px-3 py-2 rounded-md inline-block bg-[#ac3265] text-white my-3'>Home page</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound