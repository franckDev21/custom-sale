import React, { FC } from "react";
import { HiArrowRight } from "react-icons/hi";
import Steper from "../../molecules/Steper";
import LOGO from '../../assets/img/logo/logo2.png';
import "./Star.scss";
import { Link } from "react-router-dom";

type TypeStar = {};

const Star: FC<TypeStar> = () => {
  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <Link to='/' className="absolute z-20 inline-block top-3 left-3">
        <img src={LOGO} className=' ' width={100} alt="logo" />
      </Link>
      <div className="flex flex-col sm:flex-row items-center overflow-hidden md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
        <div
          className="sm:w-1/2 xl:w-3/6 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative"
          style={{
            backgroundImage: `url("https://www.gestimum.com/wp-content/uploads/logiciel-gestion-stock.jpg")`,
            backgroundPosition: 'center',
            backgroundSize: 'cover'
          }}
        >
          
          <div className="absolute bg-gradient-to-b from-[#ac3265c1] to-[#ac3265b3] opacity-75 inset-0 z-0"></div>
          <div className="w-full  max-w-md z-10">
            <div className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">
              A software made especially for you, start now ...
            </div>
            <div className="sm:text-sm xl:text-md text-gray-200 font-normal">
              {" "}
              What is Lorem Ipsum Lorem Ipsum is simply dummy text of the
              printing and typesetting industry Lorem Ipsum has been the
              industry's standard dummy text ever since the 1500s when an
              unknown printer took a galley of type and scrambled it to make a
              type specimen book it has?
            </div>
          </div>
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>
        <div className="md:flex md:items-center md:justify-center sm:w-auto md:h-full w-2/5 xl:w-3/6 p-8  md:p-10 lg:p-14 sm:rounded-lg md:rounded-none overflow-hidden bg-white">
          <div className="max-w-md w-full space-y-6">
            <div className="text-center">
              <h2 className="mt-0 text-3xl font-bold text-gray-700">
                Welcom Back !
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Create your account and start right away 
              </p>
            </div>
            <div>
              <Steper />
            </div>
            <div className="flex flex-row justify-center items-center space-x-3"></div>
            <form className="mt-8 space-y-6" action="#" method="POST">
              <input type="hidden" name="remember" value="true" />
              <div className="relative">
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Email
                </label>
                <input
                  className=" w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none  focus:border-indigo-500"
                  type=""
                  placeholder="mail@gmail.com"
                />
              </div>
              <div className="mt-8 content-center">
                <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                  Password
                </label>
                <input
                  className="w-full content-center text-base px-4 py-2 border-b  border-gray-300 focus:outline-none focus:border-indigo-500"
                  type=""
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="/" className="text-indigo-400 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full items-center  flex justify-center bg-gradient-to-r from-[#ac3265] to-[#ac3265ee]  hover:bg-gradient-to-l hover:from-gray-700 hover:to-gray-600 text-gray-100 p-4  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                >
                  <span>Next step</span> <HiArrowRight className="text-xl ml-4 text-white" />
                </button>
              </div> 
              {/* <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                <span>Don't have an account?</span>
                <a
                  href="/"
                  className="text-indigo-400 hover:text-blue-500 no-underline hover:underline cursor-pointer transition ease-in duration-300"
                >
                  Sign up
                </a>
              </p> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Star;
