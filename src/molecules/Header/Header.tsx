import React, { FC } from 'react'
import { Link} from 'react-router-dom';

type TypeHeader = {
  classname ?: string
}

const Header:FC<TypeHeader> = ({ classname='' }) => {
  return (
    <header className={`${classname} header py-4 bg-cyan-900`}>
      <div className="container flex items-center justify-between text-white">
        <div className="logo header__logo uppercase font-bold text-xl text-gray-400">
          LOGO.COMPANY
        </div>
        <div className='ml-4 text-sm'>
          <Link to='/login' className='px-4 py-2 font-bold active:scale-[96%] inline-block hover:bg-[#ffffff20] border-2 border-transparent rounded-md mr-2 bg-opacity-50 transition' >Se connecter </Link>
          <Link to='/start' className='px-4 py-2 bg-[#5c3652] active:scale-[96%] inline-block hover:bg-[#5c3852] hover:border-transparent transition border-2 border-[#442a3d] rounded-md font-bold' >Essai Gratuit </Link>
        </div>
      </div>
    </header>
  )
}

export default Header