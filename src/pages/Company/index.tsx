import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { ImUserTie } from "react-icons/im";
import { HiUserGroup } from "react-icons/hi";
import { AiOutlineDropbox } from "react-icons/ai";
import Loader from "../../atoms/Loader";
import CompanyModel from "../../Model/Company";
import Storage from "../../service/Storage";
import DashboardLayout from "../../templates/DashboardLayout";
import { baseURL, http_client } from "../../utils/axios-custum";
import { toast } from "react-toastify";
import { BsPencilSquare } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import User from "../../Model/User";
import UserService from "../../service/UserService";


type TotalDashboardProps = {
  totalUser ?: string|number,
  totalCash ?: string|number,
  totalProduct ?: string|number,
  totalCustomer ?: string|number,
  totalOrder ?: string|number,
}

type TypeCompany = {};

const GET_MY_COMPANY_URL = "my/company";
const UPDATE_PICTURE_COMPANY_URL = "my/company/picture";
const UPDATE_COMPANY_URL = "my/company";
const CREATE_COMPANY_URL = "my/company";
const API_STORAGE_URL = `${baseURL}/storage`;
const DASHBOARD_URL = '/dashboard';

const Company: FC<TypeCompany> = () => {
  const [company, setCompany] = useState<CompanyModel>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [sending, setSending] = useState(false);
  const [urlImg, setUrlImg] = useState(
    "https://thumbs.dreamstime.com/z/realty-flat-apartment-modern-building-logo-design-graphic-style-realty-flat-apartment-modern-building-logo-design-graphic-style-158041756.jpg"
  );
  const [dashboardInfo,setDashboardInfo] = useState<TotalDashboardProps>({
    totalCash : 0,
    totalCustomer : 0,
    totalProduct : 0,
    totalUser : 0,
    totalOrder : 0
  })

  const [imgSending, setImgSending] = useState(false);

  const { action } = useParams();
  const navigate   = useNavigate();

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

  // method
  const handleOnchange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
    switch (e.target.name) {
      case 'name':
        setCompany({...company,name : e.target.value})
        break;
      case 'email':
        setCompany({...company,email : e.target.value})
          break;
      case 'address':
        setCompany({...company,address : e.target.value})
          break;
      case 'country':
        setCompany({...company,country : e.target.value})
          break;
      case 'city':
        setCompany({...company,city : e.target.value})
          break;
      case 'tel':
        setCompany({...company,tel : e.target.value})
          break;
      case 'number_of_employees':
        setCompany({...company,number_of_employees : e.target.value})
          break;
      case 'postal_code':
        setCompany({...company,postal_code : e.target.value})
          break;
      case 'description':
        setCompany({...company,description : e.target.value})
          break;
    }
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    if(action === 'create'){      
      http_client(Storage.getStorage('auth').token).post(`${CREATE_COMPANY_URL}/${UserService.getUser().id}`,company)
        .then(res => {
          toast.success(res.data.message)

          let user: User = Storage.getStorage('auth').user
          let newUser : User = { ...user, as_company: true, company_id: res.data.company_id }

          Storage.setStorage('auth',{
            'token' : Storage.getStorage('auth').token,
            'user' : newUser
          })

          setSending(false);
        })
        .catch(err => {
          console.log(err);
          setSending(false);
        })
    }else{
      http_client(Storage.getStorage('auth').token).post(`${UPDATE_COMPANY_URL}/${company.id}`,company)
        .then(res => {
          toast.success(res.data.message)
          setSending(false);
        })
        .catch(err => {
          console.log(err);
          setSending(false);
        })
    }
  }

  useEffect(() => {
    // if the user already has a business
    if(UserService.getUser().as_company){
      navigate('/my/company/view')
    }
    
    if(action !== 'create'){

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
    }else{
      setEditing(true)
      setLoading(false)
    }
    
  }, [action,navigate]);

  useEffect(() => {

    http_client(Storage.getStorage("auth").token).get(DASHBOARD_URL)
      .then(res => {
        setDashboardInfo(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  },[])

  return (
    <DashboardLayout
      title={`${action === 'create' ? 'Créer une entreprise':'Mon entreprise'}`}
      headerContent={
        <>
          <div className={`ml-4 ${action === 'create' ? 'w-[70%]':'w-[80%]'} font-bold text-2xl text-[#ac3265] flex items-center justify-between`}>
            {(!loading) && (action !== 'create') && (
              <>
                <span>| {company.name}</span>

                <div className="flex items-center justify-end">
                  <button className="flex text-lg  justify-start border-4 items-center space-x-2 rounded px-2 py-1 text-gray-700 bg-gray-50 w-auto ml-3">
                    <HiUserGroup /> <span className="pl-1"> {dashboardInfo.totalUser} Utilisateur(s)</span>
                  </button>
                  <button className="flex text-lg  justify-start border-4 items-center space-x-2 rounded px-2 py-1 text-gray-700 bg-gray-50 w-auto ml-3">
                    <ImUserTie /> <span className="pl-1"> {dashboardInfo.totalCustomer} Client(s)</span>
                  </button>
                  <button className="flex text-lg  justify-start border-4 items-center space-x-2 rounded px-2 py-1 text-gray-700 bg-gray-50 w-auto ml-3">
                    <AiOutlineDropbox />{" "}
                    <span className="pl-1"> {dashboardInfo.totalProduct} Product(s)</span>
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
          <form onSubmit={handleSubmit} className="px-4 py-6 sm:px-0">
            <div className="min-h-[24rem]  rounded-lg border-4 border-dashed border-gray-300 bg-white relative">
              
              {!editing && 
                <button onClick={_=>setEditing(!editing)} title="Click here to edit the company" className="bg-gray-700 flex justify-center items-center text-white text-xl absolute right-2 top-2 p-3 rounded-md shadow-md">
                  <BsPencilSquare />
                </button>
              }

              {editing && <div className={`absolute right-2 top-2 flex justify-center items-center `}>
                <button type="submit" className={`bg-green-500 font-bold mr-1 text-white uppercase ${sending ? 'px-3 py-2':'p-3'} rounded-md shadow-md text-sm`}>
                  {sending ? <Loader className="inline-block text-lg mt-1" />:'Sauvegarder les informations'}
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
              <div className="flex-auto px-4 lg:px-10 py-10">
                <div>
                  <div className="flex flex-wrap">
                    <div className="w-3/12">
                      <label htmlFor="image" className={`w-full ${action==='create' && 'disabled'} cursor-pointer inline-block bg-gray-50`}>
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
                          {action !=='create' && 'mettre a jour mon logo'}
                        </button>
                      </label>
                    </div>
                    <div className="w-9/12 pl-2">
                      <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                        Information de l'entreprise
                      </h6>
                      <div className="flex">
                        <div className="w-full lg:w-1/2 px-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                              Nom
                            </label>
                            <input required disabled={!editing} value={company.name || ''} onChange={handleOnchange} name='name' type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="Microsoft" />
                          </div>
                        </div>
                        <div className="w-full lg:w-1/2 px-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                              Email
                            </label>
                            <input required disabled={!editing}  value={company.email || ''} onChange={handleOnchange} name='email' type="email" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="info@microsoft.com" />
                          </div>
                        </div>
                      </div>
                      <div className="flex">
                        <div className="w-full lg:w-1/2 px-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                              Nombre d'employés 
                            </label>
                            <input required disabled={!editing}  value={company.number_of_employees || ''} onChange={handleOnchange} name='number_of_employees' type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="Combien d'employés avez-vous ?" />
                          </div>
                        </div>
                        <div className="w-full lg:w-1/2 px-4">
                          <div className="relative w-full mb-3">
                            <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                              Téléphone
                            </label>
                            <input required disabled={!editing}  value={company.tel || ''} onChange={handleOnchange} name='tel' type="tel" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="Numéro de téléphone" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="mt-6 border-b-1 border-blueGray-300" />

                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    Informations de contact
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                          Adresse
                        </label>
                        <input required disabled={!editing}  value={company.address || ''} onChange={handleOnchange} name='address' type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09" />
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                          Ville
                        </label>
                        <input required disabled={!editing}  value={company.city || ''} onChange={handleOnchange} name='city' type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="New York" />
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                          Pays
                        </label>
                        <input required disabled={!editing}  value={company.country || ''} onChange={handleOnchange} name='country'  type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="United States" />
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                          Code Postal 
                        </label>
                        <input required disabled={!editing}  value={company.postal_code || ''} onChange={handleOnchange} name='postal_code'  type="text" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" placeholder="Code Postal " />
                      </div>
                    </div>
                  </div>
                  <hr className="mt-6 border-b-1 border-blueGray-300" />

                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    A propos de nous
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-12/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                          Description de l'entreprise
                        </label>
                        <textarea disabled={!editing}   value={company.description || ''} name='description' onChange={handleOnchange} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ring-gray-700 focus:ring-gray-700 w-full ease-linear transition-all duration-150" rows={4}>{company.description||''}</textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
    
            </div>
          </form>
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
