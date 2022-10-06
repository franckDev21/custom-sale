import React, { FC } from "react";
import GuestLayout from "../../templates/GuestLayout";
import { FaEyeSlash,FaEye } from 'react-icons/fa'
// import axiosCustum from '../../utils/axios-custum'

type LoginType = {};

// const LOGIN_URL = 'login'

const Login: FC<LoginType> = () => {
  return (
    <GuestLayout>
      <div className="flex justify-center items-center overflow-hidden">
        <div className="absolute w-60 h-60 rounded-xl bg-[#a96798] -top-5 -left-16 z-0 transform rotate-45 hidden md:block"></div>
        <div className="absolute w-48 h-48 rounded-xl bg-[#a96798] -bottom-6 -right-10 transform rotate-12 hidden md:block"></div>
        <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
          <div>
            <h1 className="text-xl opacity-25 font-bold text-center mb-4 cursor-pointer">
              {/* Create An Account */}
              LOGO.COMPANY
            </h1>
            <h1 className="text-3xl font-bold text-center mb-4 cursor-pointer">
              {/* Create An Account */}
              Login to your account
            </h1>
            <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
              {/* Create an account to enjoy all the services without any ads for
              free! */}
              Log in to enjoy all the services for free without any advertising!
            </p>
          </div>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Email Addres"
              className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
            />
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              />
              <span className=" text-[#5c3652] text-xl cursor-pointer absolute top-1/2 -translate-y-1/2 right-2"><FaEye /></span>
            </div>
          </div>
          <div className="text-center mt-6">
            <button className="py-3 w-64 text-xl text-white bg-[#5c3652] rounded-2xl">
              Sign in
            </button>
            <p className="mt-4 text-sm">
              You don't have an account yet?{" "}
              <span className="underline cursor-pointer"> Sign up</span>
            </p>
          </div>
        </div>
        <div className="w-40 h-40 absolute bg-[#a96798] rounded-full top-0 right-12 hidden md:block"></div>
        <div className="w-20 h-40 absolute bg-[#a96798] rounded-full bottom-20 left-10 transform rotate-45 hidden md:block"></div>
      </div>
    </GuestLayout>
  );
};

export default Login;
