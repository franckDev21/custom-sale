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
  firstname ?: string,
  lastname ?: string,
  email ?: string,
  password ?: string
  password_confirmation ?: string
}

const REGISTER_URL = 'auth/register'
const Login: FC<LoginType> = () => {

  // state
  const [form,setFrom] = useState<FormType>({})
  const [showPassword,setShowPassword] = useState(false)
  const [showPassword2,setShowPassword2] = useState(false)
  const [loading,setLoading] = useState(false)
  const [errorMessage,setErrorMessage] = useState('')
  
  // ref
  const inputPassword = useRef(null)
  const inputPassword2 = useRef(null)

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
      case 'firstname':
        setFrom({...form,firstname : e.target.value})
        break;
      case 'lastname':
        setFrom({...form,lastname : e.target.value})
        break;
      case 'password_confirmation':
        setFrom({...form,password_confirmation : e.target.value})
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
    axiosCustum.post(REGISTER_URL,form)
      .then(res => {
        setLoading(false)
        dispatch(setAuth(res.data))
        Storage.removeStorage('auth')
        Storage.setStorage('auth',res.data)
        console.log(res.data)
      })
      .catch((err: any) => {
        setLoading(false)
        setErrorMessage(err.response.data.message)
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
            <Link to='/' className="text-xl flex justify-center items-start font-bold text-center mb-4 cursor-pointer">
              {/* Create An Account */}
              <img src={LOGO} width={100} alt="" />
            </Link>
            <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
              Create an Account
            </h1>
            <p className="w-80 mx-auto text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
              Create an account to enjoy all the services without any ads for
              free!
            </p>

            {errorMessage && <div className="px-4 text-center py-3 text-sm bg-red-100 rounded-md mb-4 text-red-500 font-semibold">
              {errorMessage}
            </div>}

          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                name="firstname"
                placeholder="Your first name"
                className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
                value={form.firstname || ''}
                onChange={handleOnchange}
                required
              />
              <input
                type="text"
                name="lastname"
                placeholder="Your first last name"
                className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
                value={form.lastname || ''}
                onChange={handleOnchange}
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email Addres"
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
                placeholder="Password"
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
            <div className="relative">
              <input
                ref={inputPassword2}
                type="password"
                name="password_confirmation"
                placeholder="confirm password"
                className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
                value={form.password_confirmation || ''}
                onChange={handleOnchange}
                required
              />
              <span onClick={_=>{
                if(inputPassword2.current){
                  if((inputPassword2.current as any).type === 'text'){
                    (inputPassword2.current as any).type = 'password'
                    setShowPassword2(false)
                  }else {
                    (inputPassword2.current as any).type = 'text'
                    setShowPassword2(true)
                  }
                }
              }} className=" text-[#5c3652] text-xl cursor-pointer absolute top-1/2 -translate-y-1/2 right-2">
                {showPassword2 ? <FaEyeSlash /> : <FaEye/>}
              </span>
            </div>
            
          </div>
          <div className="text-center mt-6">
            <button type="submit" className={`${loading ? 'disabled':''} py-3 text-center inline-flex justify-center items-center w-64 text-xl text-white bg-[#ac3265ee] rounded-2xl`}>
              {!loading ? 'Sin up': <Loader className="text-white text-2xl" />}
            </button>
            <p className="mt-4 text-sm">
              you already have an account ?{" "}
              <Link to='/login' className="underline cursor-pointer"> Sign in</Link>
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
