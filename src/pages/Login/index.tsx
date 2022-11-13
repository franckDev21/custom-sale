import React, { ChangeEvent, FC, FormEvent, useRef, useState, useEffect } from "react";
import GuestLayout from "../../templates/GuestLayout";
import { FaEyeSlash,FaEye } from 'react-icons/fa'
import axiosCustum from "../../utils/axios-custum";
import Loader from "../../atoms/Loader";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/features/auth/authSlice";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Storage from "../../service/Storage";
import Auth from "../../service/Auth";
import LOGO from '../../assets/img/logo/logo3.png'

type LoginType = {};

type FormType = {
  email ?: string,
  password ?: string
}

const LOGIN_URL = 'auth/login'

const Login: FC<LoginType> = () => {

  // state
  const [form,setFrom] = useState<FormType>({})
  const [showPassword,setShowPassword] = useState(false)
  const [loading,setLoading] = useState(false)
  const [errorMessage,setErrorMessage] = useState('')
  
  // ref
  const inputPassword = useRef(null)

  //
  const navigate = useNavigate()

  // redux
  const dispatch = useDispatch()
  const auth = useSelector((state: any) => state.auth)

  // method
  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'email':
        setFrom({...form,email : e.target.value})
        break;
      default:
        setFrom({...form,password : e.target.value})
        break;
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')

    setLoading(true)
    // login user
    axiosCustum.post(LOGIN_URL,form)
      .then(res => {
        setLoading(false)
        if(res.data.error){
          setErrorMessage(res.data.error)
        }else{
          dispatch(setAuth(res.data))
          Storage.removeStorage('auth')
          Storage.setStorage('auth',res.data)          
        }
        
      })
      .catch((err: any) => {
        setLoading(false)
        setErrorMessage(err.response?.data?.message || err.message)
        console.log(err)
      })
  }

  // 
  useEffect(() => {
    if((auth.token && auth.user) || Auth.isLogin()){
      navigate('/dashboard')
    }
  },[auth,navigate])

  return (
    <GuestLayout>
      <form onSubmit={handleSubmit} className="flex justify-center items-center overflow-hidden">
        <div className="absolute w-60 h-60 rounded-xl bg-[#a96798] -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
        <div className="absolute w-48 h-48 rounded-xl bg-[#a96798] -bottom-6 -right-10 transform rotate-12 hidden md:block"></div>
        <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
          <div>
            <Link to='/' className="text-xl flex justify-center items-center font-bold text-center mb-4 cursor-pointer">
              {/* Create An Account */}
              <img src={LOGO} width={100} alt="" />
            </Link>
            <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
              {/* Create An Account */}
              {/* Login to your account */}
              Page de connexion
            </h1>
            <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
              {/* Create an account to enjoy all the services without any ads for
              free! */}
              {/* Log in to enjoy all the services for free without any advertising! */}
              Remplissez ce formulaire pour accéder à votre espace de gestion
            </p>

            {errorMessage && <div className="px-4 text-center py-3 text-sm bg-red-100 rounded-md mb-4 text-red-500 font-semibold">
              {errorMessage}
            </div>}

          </div>
          <div className="space-y-4">
            <input
              type="text"
              name="email"
              placeholder="Votre adresse email"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              value={form.email || ''}
              onChange={handleOnchange}
              required
            />
            <div className="relative">
              <input
                ref={inputPassword}
                type="password"
                name="password"
                placeholder="mot de passe"
                className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
                value={form.password || ''}
                onChange={handleOnchange}
                required
              />
              <span onClick={_=>{
                if(inputPassword.current){
                  if((inputPassword.current as any).type === 'text'){
                    (inputPassword.current as any).type = 'password'
                    setShowPassword(false)
                  }else {
                    (inputPassword.current as any).type = 'text'
                    setShowPassword(true)
                  }
                }
              }} className=" text-[#5c3652] text-xl cursor-pointer absolute top-1/2 -translate-y-1/2 right-2">
                {showPassword ? <FaEyeSlash /> : <FaEye/>}
              </span>
            </div>
          </div>
          <div className="text-center mt-6">
            <button type="submit" className={`${loading ? 'disabled':''} py-3 active:scale-[98%] text-center inline-flex justify-center items-center w-64 text-xl text-white bg-[#ac3265] rounded-2xl`}>
              {!loading ? 'Connexion': <Loader className="text-white text-2xl" />}
            </button>
            <p className="mt-4 text-sm">
              {/* You don't have an account yet?{" "} */}
              Vous n’avez pas encore de compte  ?
              <Link to='/register' className="underline cursor-pointer"> Créer un compte</Link>
            </p>
          </div>
        </div>
        <div className="w-40 h-40 absolute bg-[#a96798] rounded-full top-0 right-12 hidden md:block"></div>
        <div className="w-20 h-40 absolute bg-[#a96798] rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
      </form>
    </GuestLayout>
  );
};

export default Login;
