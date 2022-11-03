import React, { FC } from 'react'
import { BsBuilding } from 'react-icons/bs'
import { FaHandsHelping, FaUserAlt } from 'react-icons/fa'

type TypeSteper = {
  className ?: string,
  step  ?: number
}

const Steper:FC<TypeSteper> = ({ className, step=1 }) => {
  return (
    <div className={`${className} w-full flex items-center justify-center `}>
      <div className='flex flex-col justify-center items-center'>
        <span className={`w-14 h-14 font-bold rounded-full cursor-pointer flex justify-center items-center text-white p-3 border-4 ${step === 1 ? 'bg-[#ac3265] border-[#ac3265]':'disabled bg-gray-700'}`}> <FaUserAlt/> </span>
        <span className='text-xs uppercase font-bold text-gray-600 mt-2 text-center'>Insctiption</span>
      </div>
      
      <span className='h-[2px] w-20 rounded-md inline-block mx-3 bg-[#ac3265] -mt-6'></span>

      <div className="flex flex-col justify-center items-center">
        <span className={`w-14  h-14 text-xl font-bold rounded-full mt-2 ${(step === 2 || step === 3) ? 'bg-[#ac3265] border-[#ac3265]':'disabled bg-gray-700'} flex justify-center items-center hover:bg-[#ac3265] text-white p-3 border-4 `}> <BsBuilding />  </span>
        <span className='text-xs uppercase font-bold text-gray-600 mt-2 text-center'>Création de mon entreprise</span>
      </div>

      <span className='h-[2px] w-20 rounded-md inline-block mx-3 bg-[#ac3265] -mt-6'></span>

      <div className="flex flex-col justify-center items-center">
        <span className={`w-14 h-14 font-bold rounded-full ${step === 4 ? 'bg-[#ac3265] border-[#ac3265]':'disabled bg-gray-700'} flex justify-center items-center hover:bg-[#ac3265] text-white p-3 border-4 `}> <FaHandsHelping />  </span>
        <span className='text-xs uppercase font-bold text-gray-600 mt-2 text-center'>Confirmation</span>
      </div>
    </div>
  )
}

export default Steper