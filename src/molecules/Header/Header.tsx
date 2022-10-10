import React, { FC,useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { Link} from 'react-router-dom'
import Auth from '../../service/Auth'
import { logout } from '../../store/features/auth/authSlice'
import LOGO from '../../assets/img/logo/logo2.png'

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
    <header className={`${classname} header py-4 bg-cyan-900`}>
      <div className="container flex items-center justify-between text-white">
        <div className="logo header__logo uppercase font-bold text-xl text-gray-400">
          <img src={LOGO} width={100} alt="" />
        </div>
        <div className='ml-4 text-sm'>
          {((auth.token && auth.user) || Auth.isLogin() ) ?
            <>
              <button onClick={_=>{
                logoutUser()
                setInit(false)
              }} className='px-4 py-2 font-bold active:scale-[96%] inline-block hover:bg-[#ffffff20] border-2 border-transparent rounded-md mr-2 bg-opacity-50 transition' >Se deconnecter</button>
            </> : 
            <Link to='/login' className='px-4 py-2 font-bold active:scale-[96%] inline-block hover:bg-[#ffffff20] border-2 border-transparent rounded-md mr-2 bg-opacity-50 transition' >Se connecter </Link>
          } 

          {((auth.token && auth.user) || Auth.isLogin() ) ?
            <>
              {init && <Link to='/dashboard' className='px-4 py-2 bg-[#ac3265] active:scale-[96%] inline-block hover:bg-[#5c3852] hover:border-transparent transition border-2 border-[#7e3151] rounded-md font-bold' >Dashboard </Link>}
              {!init && <Link to='/start' className='px-4 py-2 bg-[#ac3265] active:scale-[96%] inline-block hover:bg-[#5c3852] hover:border-transparent transition border-2 border-[#7e3151] rounded-md font-bold' >Essai Gratuit </Link>}
            </> : 
           <Link to='/start' className='px-4 py-2 bg-[#ac3265] active:scale-[96%] inline-block hover:bg-[#5c3852] hover:border-transparent transition border-2 border-[#442a3d] rounded-md font-bold' >Essai Gratuit </Link>
          } 

          
        </div>
      </div>
    </header>
  )
}

export default Header