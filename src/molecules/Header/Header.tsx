import React, { FC,useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Link} from 'react-router-dom'
import Auth from '../../service/Auth'
import { logout } from '../../store/features/auth/authSlice'
import LOGO from '../../assets/img/logo/logo5.png'

type TypeHeader = {
  classname ?: string
}

const Header:FC<TypeHeader> = ({ classname='' }) => {

  const [init,setInit] = useState(true)

  const auth = useSelector((state: any) => state.auth)
  const dispatch = useDispatch()

  const logoutUser = () => {
    dispatch(logout())
    Auth.logout()
  }

  return (
    <header className={`${classname} header top-0 pb-10 py-4  relative`} style={{ zIndex: 2000 }}>
      <div className="container-custom flex items-center justify-between text-white">
        <Link to='/' className="logo block header__logo uppercase font-bold text-xl text-gray-400">
          <img src={LOGO} width={80} alt="" />
        </Link>
        <div className='ml-4 text-sm'>
          {((auth.token && auth.user) || Auth.isLogin() ) ?
            <>
              <button onClick={_=>{
                logoutUser()
                setInit(false)
              }} className='px-4 bg-[#203A62] py-2 font-bold active:scale-[96%] inline-block border-2 border-transparent rounded-full mr-2 transition' >Se deconnecter</button>
            </> : 
            // <Link to='/login' className='px-4 bg-gray-800 py-2 font-bold active:scale-[96%] inline-block border-2 border-transparent rounded-full mr-2 transition' >Se connecter </Link>
            <Link to='/login' className='px-4 bg-[#203A62] py-2 font-bold active:scale-[96%] inline-block border-2 border-transparent rounded-full mr-2 transition' >Se connecter </Link>
          } 

          {((auth.token && auth.user) || Auth.isLogin() ) ?
            <>
              {init && <Link to='/dashboard' className='px-4 py-2 bg-[#ac3265] active:scale-[96%] inline-block hover:bg-[#5c3852] hover:border-transparent transition border-2 border-[#7e3151] rounded-full font-bold' >Dashboard </Link>}
              {!init && <Link to='/star' className='px-4 py-2 bg-[#ac3265] active:scale-[96%] inline-block hover:bg-[#5c3852] hover:border-transparent transition border-2 border-[#7e3151] rounded-full font-bold' >Demander mon accès</Link>}
            </> : 
           <Link to='/star' className='px-4 py-2 bg-white text-primary active:scale-[96%] inline-block hover:bg-[#5c3852] hover:border-transparent transition  rounded-full font-bold' >Demander mon accès</Link>
          } 

          
        </div>
      </div>
    </header>
  )
}

export default Header