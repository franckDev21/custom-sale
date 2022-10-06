import React, { FC } from 'react'
import './Banner.scss'

type TypeBanner = {
  classname ?: string,
  children : React.ReactNode
}

const Banner:FC<TypeBanner> = ({ classname='', children }) => {
  return (
    <section className={`${classname} Banner pt-14 pb-24 bg-cyan-900`}>
      <div className="container">
        {children ?? children}
      </div>
    </section>
  )
}

export default Banner