import React from 'react'
import { Link } from 'react-router-dom'
import NotFundIcon from '../../atoms/Icon/NotFundIcon'

const NotFound = () => {
  return (
    <div className='min-h-screen w-full bg-gray-100 justify-center items-center flex text-5xl font-bold relative'>
      <NotFundIcon />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className='text-gray-700 py-4 px-6 rounded-md flex flex-col justify-center items-center'>
          <Link to='/' className=''>Page NotFound</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound