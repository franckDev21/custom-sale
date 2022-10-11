import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { ImUserTie } from "react-icons/im";
import { HiUserGroup } from "react-icons/hi";
import { AiOutlineDropbox } from "react-icons/ai";
import Loader from "../../atoms/Loader";
import CompanyModel from "../../Model/Company";
import Storage from "../../service/Storage";
import DashboardLayout from "../../templates/DashboardLayout";
import { http_client } from "../../utils/axios-custum";
import { toast } from "react-toastify";
import { BsPencilSquare } from "react-icons/bs";
import { FaEye } from "react-icons/fa";

type TypeCompany = {};

const GET_MY_COMPANY_URL = "my/company";
const UPDATE_PICTURE_COMPANY_URL = "my/company/picture";
const API_STORAGE_URL = "http://localhost:8000/storage";

const Company: FC<TypeCompany> = () => {
  const [company, setCompany] = useState<CompanyModel>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [urlImg, setUrlImg] = useState(
    "https://thumbs.dreamstime.com/z/realty-flat-apartment-modern-building-logo-design-graphic-style-realty-flat-apartment-modern-building-logo-design-graphic-style-158041756.jpg"
  );
  const [imgSending, setImgSending] = useState(false);

  const handleChangImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setUrlImg(
        "https://thumbs.dreamstime.com/z/realty-flat-apartment-modern-building-logo-design-graphic-style-realty-flat-apartment-modern-building-logo-design-graphic-style-158041756.jpg"
      );
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setImgSending(true);
    // update user info
    http_client(Storage.getStorage("auth").token)
      .post(`${UPDATE_PICTURE_COMPANY_URL}/${company.id}`, formData)
      .then((res) => {
        setImgSending(false);
        if (res.data.message) {
          toast.success(res.data.message);
          setEditing(false);
          let url = URL.createObjectURL(file);
          setUrlImg(url);
              
        } else {
        }
      })
      .catch((err) => {
        setImgSending(false);
        toast.error(err.response.data.message);
        console.log(err);
      });
  };

  useEffect(() => {
    setLoading(true);
    // get my company
    http_client(Storage.getStorage("auth").token)
      .get(GET_MY_COMPANY_URL)
      .then((res) => {
        setLoading(false);
        setCompany(res.data);
        if(res.data.logo){
          setUrlImg(`${API_STORAGE_URL}/${res.data.logo}`);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <DashboardLayout
      title="My Company"
      headerContent={
        <>
          <div className="ml-4 w-[80%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            {!loading && (
              <>
                <span>| {company.name}</span>

                <div className="flex items-center justify-end">
                  <button className="flex text-lg  justify-start border-4 items-center space-x-2 rounded px-2 py-1 text-gray-700 bg-gray-50 w-auto ml-3">
                    <HiUserGroup /> <span className="pl-1"> 19 Users</span>
                  </button>
                  <button className="flex text-lg  justify-start border-4 items-center space-x-2 rounded px-2 py-1 text-gray-700 bg-gray-50 w-auto ml-3">
                    <ImUserTie /> <span className="pl-1"> 734 Customers</span>
                  </button>
                  <button className="flex text-lg  justify-start border-4 items-center space-x-2 rounded px-2 py-1 text-gray-700 bg-gray-50 w-auto ml-3">
                    <AiOutlineDropbox />{" "}
                    <span className="pl-1"> 32 Products</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <div className="px-4 py-6 sm:px-0">
            <div className="min-h-[24rem]  rounded-lg border-4 border-dashed border-gray-300 bg-white relative">
              
              {!editing && 
                <button onClick={_=>setEditing(!editing)} title="Click here to edit the company" className="bg-gray-700 flex justify-center items-center text-white text-xl absolute right-2 top-2 p-3 rounded-md shadow-md">
                  <BsPencilSquare />
                </button>
              }

              {editing && <div className={`absolute right-2 top-2 flex justify-center items-center `}>
                <button onClick={_=>setEditing(!editing)} title="Click here to edit the company" className="bg-green-500 font-bold mr-1 text-white uppercase p-3 rounded-md shadow-md text-sm">
                  Sauvegarder
                </button>
                <button onClick={_=>setEditing(!editing)} title="Click here to edit the company" className="bg-gray-700  text-white text-xl p-3 rounded-md shadow-md">
                  <FaEye />
                </button>
              </div>}

              <input
                accept="image/*"
                name="image"
                onChange={handleChangImageFile}
                type="file"
                id="image"
                hidden
                className="hidden"
              />
              {/* 
                $table->string('name');
                $table->string('logo')->nullable();
                $table->text('description')->nullable();
                $table->string('address');
                $table->string('country');
                $table->string('post_code')->nullable();
                $table->string('city');
                $table->string('tel')->nullable();
                $table->string('email')->unique();
                $table->integer('number_of_employees');
              */}
              <div className="flex-auto px-4 lg:px-10 py-10">
                <form>
                  <div className="flex flex-wrap">
                    <div className="w-3/12">
                      <label htmlFor="image" className="w-full cursor-pointer inline-block bg-green-200">
                        <div className="w-full flex justify-center items-center overflow-hidden bg-gray-50 h-[200px] relative rounded-t-md">
                          {imgSending ? (
                            <Loader className=" text-4xl" />
                          ) : (
                            <img
                              className=" absolute top-0 bottom-0 left-0 right-0 w-full h-full object-cover "
                              src={urlImg}
                              alt=""
                            />
                          )}
                        </div>

                        <button className="py-2 uppercase rounded-b-md text-xs inline-block bg-gray-700 text-white w-full">
                          update my logo
                        </button>
                      </label>
                    </div>
                    <div className="w-9/12 pl-2">
                      <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                        Company Information
                      </h6>
                      <div className="flex">
                        <div className="w-full lg:w-1/2 px-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                              Name
                            </label>
                            <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="Microsoft" />
                          </div>
                        </div>
                        <div className="w-full lg:w-1/2 px-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                              Email
                            </label>
                            <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="info@microsoft.com" />
                          </div>
                        </div>
                      </div>
                      <div className="w-full px-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                              Number of emolyer
                            </label>
                            <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="ex: 102 employees" />
                          </div>
                        </div>
                    </div>
                  </div>
                  <hr className="mt-6 border-b-1 border-blueGray-300" />

                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    Contact Information
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                          Address
                        </label>
                        <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09" />
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                          City
                        </label>
                        <input type="email" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="New York" />
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                          Country
                        </label>
                        <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="United States" />
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                          Postal Code
                        </label>
                        <input type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="Postal Code" />
                      </div>
                    </div>
                  </div>
                  <hr className="mt-6 border-b-1 border-blueGray-300" />

                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    About Me
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                          About me
                        </label>
                        <textarea  className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" rows={4}></textarea>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
    
            </div>
          </div>
        ) : (
          <div className="h-[400px] flex justify-center items-center text-8xl text-[#5c3652]">
            <Loader />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Company;
