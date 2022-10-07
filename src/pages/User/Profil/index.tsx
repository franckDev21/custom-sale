import { Alert } from "flowbite-react";
import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { FaPen, FaUserAlt } from "react-icons/fa";
import { RiLockPasswordFill } from 'react-icons/ri';
import { toast } from 'react-toastify';

import {
  HiChevronDoubleLeft,
  HiEye,
  HiInformationCircle,
} from "react-icons/hi";
import { MdOutlineFormatAlignRight } from "react-icons/md";
import Loader from "../../../atoms/Loader";
import User from "../../../Model/User";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { http_client } from "../../../utils/axios-custum";

type TypeProfil = {};

type TypePassword = {
  old_password ?: string,
  new_password  ?: string,
  confirm_password ?: string
}

const GET_INFO_USER_URL = "auth/user/info";
const UPDATE_INFO_USER_URL = "auth/user";

const Profil: FC<TypeProfil> = () => {
  const [user, setUser] = useState<User>({});
  const [password, setPassword] = useState<TypePassword>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [sending,setSending] = useState(false)
  const [errorUpdateInfo,setErrorUpdateInfo] = useState('')


  // method
  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'email':
        setUser({...user,email : e.target.value})
        break;
      case 'firstname':
        setUser({...user,firstname : e.target.value})
        break;
      case 'lastname':
        setUser({...user,lastname : e.target.value})
        break;
    }
  }

  const handlePassWordOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case 'old_password':
        setPassword({...password,old_password : e.target.value})
        break;
      case 'new_password':
        setPassword({...password,new_password : e.target.value})
        break;
      case 'confirm_password':
        setPassword({...password,confirm_password : e.target.value})
        break;
    }
  }

  const handleUpdateInfo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)

    const userInfo = {
      firstname : user.firstname,
      lastname  : user.lastname,
      email     : user.email
    }

    // update user info
    http_client(Storage.getStorage("auth").token)
      .post(UPDATE_INFO_USER_URL,userInfo)
      .then((res) => {
        // setUser(res.data);
        setSending(false);
        setUser(res.data);
        toast.success("Your information has been successfully updated !")
        setEditing(false)
      })
      .catch(err => {
        setSending(false)
        setErrorUpdateInfo(err.response.data.message)
        console.log(err);
        
      })
  }

  useEffect(() => {
    http_client(Storage.getStorage("auth").token)
      .post(GET_INFO_USER_URL)
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      });
  }, []);

  return (
    <DashboardLayout
      titleClass="w-[20%]"
      title="Welcome 👋 😊 "
      headerContent={
        <>
          <div className="ml-4 w-[80%] font-bold text-2xl text-[#5c3652] flex items-center justify-between">
            <span>
              {" "}
              {!loading && (
                <>
                  | {user.firstname} {user.lastname}
                </>
              )}
            </span>

            <button className="flex disabled justify-start text-sm border-4 border-[#4f3047] items-center space-x-2 rounded px-2 py-1 text-white bg-[#5c3652] w-auto">
              See my company <HiEye className="ml-2" />
            </button>
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <>
            <div className="">
              <Alert
                color="info"
                additionalContent={
                  <React.Fragment>
                    <div className="mt-2 mb-4 text-sm text-blue-700 dark:text-blue-800">
                      Hello, you must create your company in order to use the
                      application otherwise your account will be suspended
                      within 5 days. click on the following button to add your
                      company information
                    </div>
                    <div className="flex">
                      <button
                        type="button"
                        className="mr-2 inline-flex items-center rounded-lg bg-blue-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-800 dark:hover:bg-blue-900"
                      >
                        Create your company{" "}
                        <MdOutlineFormatAlignRight className="-mr-0.5 ml-2" />
                      </button>
                    </div>
                  </React.Fragment>
                }
                icon={HiInformationCircle}
              >
                <h3 className="text-lg font-medium text-blue-700 dark:text-blue-800">
                  Incomplete registration
                </h3>
              </Alert>
            </div>
            <div className="px-4 py-6 sm:px-0">
              <div className="flex justify-start space-x-4">
                <div>
                  <div className="w-[150px] bg-gray-50 h-[150px] relative rounded-t-md">
                    <FaUserAlt className="text-8xl text-gray-400 -translate-y-1/2 top-1/2 absolute -translate-x-1/2 left-1/2" />
                  </div>
                  <button className="py-2 uppercase rounded-b-md text-xs inline-block bg-gray-700 text-white w-full">
                    update my picture
                  </button>
                </div>

                {!editing ? (
                  <div className="text-lg items-start flex flex-col space-y-2">
                    <div className="flex justify-start items-center space-x-2 rounded px-2 py-1 bg-gray-50">
                      Firstname : {user.firstname}
                    </div>
                    <div className="flex justify-start items-center space-x-2 rounded px-2 py-1 bg-gray-50">
                      Lastname : {user.lastname}
                    </div>
                    <div className="flex justify-start items-center space-x-2 rounded px-2 py-1 bg-gray-50">
                      email : {user.email}
                    </div>
                    <button
                      onClick={(_) => setEditing(!editing)}
                      className="flex justify-start text-sm border-4 border-[#4f3047] items-center space-x-2 rounded px-2 py-1 text-white bg-[#5c3652] w-auto"
                    >
                      Edition form <FaPen className="ml-2" />
                    </button>
                  </div>
                ) : (
                  <>
                    <form onSubmit={handleUpdateInfo} className="text-lg w-[40%] flex flex-col space-y-2">
                      {errorUpdateInfo && 
                        <div className="px-4 text-center py-3 text-sm bg-red-100 rounded-md mb-4 text-red-500 font-semibold">
                          {errorUpdateInfo}
                        </div>
                      }
                      <div className="flex justify-start items-center space-x-2 rounded px-2 py-1 bg-gray-50">
                        <input
                          type="text"
                          name="firstname"
                          className="w-full inline-block  py-2 rounded-md px-3"
                          placeholder="Your firstname"
                          value={user.firstname}
                          onChange={handleOnchange}
                          required
                        />
                      </div>
                      <div className="flex justify-start items-center space-x-2 rounded px-2 py-1 bg-gray-50">
                        <input
                          type="text"
                          name="lastname"
                          className="w-full inline-block  py-2 rounded-md px-3"
                          placeholder="Your lastname"
                          value={user.lastname}
                          onChange={handleOnchange}
                          required
                        />
                      </div>
                      <div className="flex justify-start items-center space-x-2 rounded px-2 py-1 bg-gray-50">
                        <input
                          type="text"
                          name="email"
                          className="w-full inline-block  py-2 rounded-md px-3"
                          placeholder="Your email"
                          value={user.email}
                          onChange={handleOnchange}
                          required
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={(_) => setEditing(!editing)}
                          className="flex self-start justify-start text-sm border-4 border-red-500 items-center space-x-2 rounded px-4 uppercase font-bold py-1 text-white bg-red-400 w-auto"
                        >
                          <HiChevronDoubleLeft className="mr-2 text-lg" />
                        </button>
                        <button
                          type="submit"
                          className="flex self-start justify-start text-sm border-4 border-green-500 items-center space-x-2 rounded px-4 uppercase font-bold py-1 text-white bg-green-400 w-auto"
                        >
                          {sending ? <Loader className="text-lg" />:'Save changes'}
                        </button>
                      </div>
                    </form>
                    <form className="text-lg w-[40%] flex flex-col space-y-2">
                      <div className="flex justify-start items-center space-x-2 rounded px-2 py-1 bg-gray-50">
                        <input
                          type="password"
                          name="old_password"
                          className="w-full inline-block  py-2 rounded-md px-3"
                          placeholder="current password"
                          value={password.old_password}
                          onChange={handlePassWordOnchange}
                          required
                        />
                      </div>
                      <div className="flex justify-start items-center space-x-2 rounded px-2 py-1 bg-gray-50">
                        <input
                          type="password"
                          name="new_password"
                          className="w-full inline-block  py-2 rounded-md px-3"
                          placeholder="new password "
                          value={password.new_password}
                          onChange={handlePassWordOnchange}
                          required
                        />
                      </div>
                      <div className="flex justify-start items-center space-x-2 rounded px-2 py-1 bg-gray-50">
                        <input
                          type="password"
                          name="confirm_password"
                          className="w-full inline-block  py-2 rounded-md px-3"
                          placeholder="confirm new password"
                          value={password.confirm_password}
                          onChange={handlePassWordOnchange}
                          required
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="flex self-start justify-start text-sm border-4 border-blue-500 items-center space-x-2 rounded px-4 uppercase font-bold py-1 text-white bg-blue-400 w-auto"
                        >
                          Save password <RiLockPasswordFill className="ml-2" />
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="h-[400px] flex justify-center items-center text-8xl text-[#5c3652]">
            <Loader />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profil;
