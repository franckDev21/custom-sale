import React from 'react'
import { BiLoaderAlt } from 'react-icons/bi'
import './Loader.scss'

type TypeLoader = {
  className ?: string
}
const Loader: React.FC<TypeLoader> = ({ className='' }) => {
  return (
    <span className={`${className} Loader`}><BiLoaderAlt /></span>
  )
}

export default Loader