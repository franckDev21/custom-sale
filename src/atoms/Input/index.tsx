import React from 'react'

type TypeInput = {
  className : string,
  classBox : string,
}

const Input:React.FC<TypeInput> = ({ className, classBox }) => {
  return (
    <div className={`${classBox}`}>
      <input className={`${className} w-full px-3 py-2 rounded-md border-none outline-none hover:border-none hover:outline-none`} />
    </div>
  )
}

export default Input