import React, { FC } from 'react'

type TypeGuestLayout = {
  children : React.ReactNode
}

const GuestLayout: FC<TypeGuestLayout> = ({ children }) => {
  return (
    <div className='min-h-screen fixed bg-[#5c3652] w-full flex justify-center items-center overflow-hidden'>
      {children}
    </div>
  )
}

export default GuestLayout