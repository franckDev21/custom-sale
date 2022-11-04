import React, { FC } from 'react'
import Header from '../Header/Header'
import './Banner.scss'

type TypeBanner = {
  classname ?: string,
  classnameContent ?: string,
  children : React.ReactNode
}

const Banner:FC<TypeBanner> = ({ classname='', children,classnameContent ='' }) => {
  return (
    <section className={`${classname} Banner  pb-24 overflow-hidden fixed top-0 bottom-0 right-0 left-0`}
      style={{
        backgroundImage: `url("https://www.gestimum.com/wp-content/uploads/logiciel-gestion-stock.jpg")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Header />
      <div className="absolute bg-gradient-to-b from-[#ac3265c1] to-[#ac3265b3] opacity-75 inset-0 z-0"></div>
      <div className={`container-custom relative ${classnameContent}`} style={{ zIndex: 2000 }}>
        {children ?? children}
      </div>
      <ul className="circles">
          <li className="rounded-full"></li>
          <li className="rounded-full"></li>
          <li className="rounded-full"></li>
          <li className="rounded-full"></li>
          <li className="rounded-full"></li>
          <li className="rounded-full"></li>
          <li className="rounded-full"></li>
          <li className="rounded-full"></li>
          <li className="rounded-full"></li>
          <li className="rounded-full"></li>
        </ul>
    </section>
  )
}

export default Banner