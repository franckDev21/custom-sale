import React, { ChangeEvent, FC, FormEvent, useRef, useState } from "react";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi";
import Steper from "../../molecules/Steper";
import LOGO from "../../assets/img/logo/logo2.png";
import "./Star.scss";
import { Link, useNavigate } from "react-router-dom";
import { AiFillCheckCircle } from "react-icons/ai";
import User from "../../Model/User";
import Company from "../../Model/Company";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosCustum, { http_client } from "../../utils/axios-custum";
import Storage from "../../service/Storage";
import { toast } from "react-toastify";
import { setAuth } from "../../store/features/auth/authSlice";
import { useDispatch } from "react-redux";
// import { useSelector } from "react-redux";
import Loader from "../../atoms/Loader";

type TypeStar = {};

const REGISTER_URL = 'auth/register'
const CREATE_COMPANY_URL = "my/company";

const Star: FC<TypeStar> = () => {
  const [step, setStep] = useState(1);
  const [errForm, setErrForm] = useState('');
  const [sending,setSending] = useState(false);
  const [success,setSuccess] = useState(false);

  const [showPassword,setShowPassword] = useState(false)
  const inputPassword = useRef(null)

  const [user,setUser]  = useState<User>({
    type : 'ENTREPRISE'
  })

  const [company,setCompany]  = useState<Company>({
    tel: null
  })

  // redux
  const dispatch = useDispatch()
  // const auth = useSelector((state: any) => state.auth)

      //
  const navigate = useNavigate()

  const next = () => {
    if (step <= 3) {
      setStep((s) => s + 1);
    }
  };

  const prev = () => {
    if (step >= 0) {
      setStep((s) => s - 1);
    }
  };

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    if(errForm) setErrForm('');

    switch (e.target.name) {
      case 'firstname':
        setUser({...user,firstname : e.target.value})
        break;
      case 'lastname':
        setUser({...user,lastname : e.target.value})
        break;
      case 'email':
        setUser({...user,email : e.target.value})
        break;
      case 'tel':
        setUser({...user,tel : e.target.value})
        break;
      case 'password':
        setUser({...user,password : e.target.value})
        break;
      case 'active':
          setUser({...user,active : e.target.checked === true})
          break;
      default:
        setUser({...user,password_confirmation : e.target.value})
        break;
    }
  }

  const handleOnchangeTwo = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => {
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
      case 'number_of_employees':
        setCompany({...company,number_of_employees : e.target.value})
          break;
    }
  }

  const sumitFormOne = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    next()
  }

  const sumitFormTwo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    next()
  }

  const submitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    axiosCustum.post(REGISTER_URL,user)
      .then(res => {
        
        dispatch(setAuth(res.data))
        // Storage.setStorage('auth',res.data)

        toast.success(res.data.message)
        
        axiosCustum.post(`${CREATE_COMPANY_URL}/${res.data.user.id}`,company)
          .then(res => {
            toast.success(res.data.message)

            // let user: User = Storage.getStorage('auth').user
            // let newUser : User = { ...user, as_company: true, company_id: res.data.company_id }

            // Storage.setStorage('auth',{
            //   'token' : Storage.getStorage('auth').token,
            //   'user' : newUser
            // })

            setSuccess(true)

            setSending(false);
            

            // navigate('/dashboard')
            
          })
          .catch(err => {
            console.log(err);
            setSending(false);
          })
      })
      .catch((err: any) => {
        setSending(false)
        setErrForm(err.response.data.message)
        console.log(err)
      })
    
  }

  return (
    <div className="relative min-h-screen flex overflow-hidden">
      <Link to="/" className="absolute z-20 inline-block top-3 left-3">
        <img src={LOGO} className=" " width={100} alt="logo" />
      </Link>
      <div className="flex flex-col sm:flex-row items-center overflow-hidden md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
        <div
          className="sm:w-1/2 xl:w-3/6 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative"
          style={{
            backgroundImage: `url("https://www.gestimum.com/wp-content/uploads/logiciel-gestion-stock.jpg")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute bg-gradient-to-b from-[#ac3265c1] to-[#ac3265b3] opacity-75 inset-0 z-0"></div>
          <div className="w-full  max-w-md z-10">
            <div className="sm:text-4xl xl:text-3xl font-extrabold mb-6" style={{ lineHeight: '1.4' }}>
              La gestion et management simplifiés avec <span className=' rounded-full text-primary bg-white px-3  '>gm smart</span>
            </div>
            <div className="sm:text-sm xl:text-md text-gray-200 font-normal" style={{ textShadow: '1px 1px 20px black' }}>
              {" "}
              Choisissez un logiciel fait pour vos besoins . De la gestion commerciale à la gestion comptable, <span className="text-primary bg-white bg-opacity-50 px-1 py-1 font-bold">gm smart</span> vous aide et vous accompagne tout au long de la croissance de votre entreprise . Des interfaces intuitives et ergonomie pour un manipulation simple 
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
          <div className="max-w-md w-full space-y-4">

            {success ? <>
              <div className="p-6 bg-green-100 text-green-500 shadow rounded-md text-3xl font-bold text-center first-letter:text-primary">
                Merci pour votre inscription. Notre équipe vous contactera pour la validation de vos accès
              </div>
            </>:<>

            <div className="text-center">
              <h2 className="mt-0 text-3xl font-bold text-gray-700">
                Bienvenue !
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {/* Create your account and start right away */}
                Créer rapidement votre compte et commencer à profiter
              </p>
            </div>
            <div>
              <Steper step={step} />
            </div>
            <div className="flex flex-row justify-center items-center space-x-3"></div>

            {step === 1 && (
              <>
                <form onSubmit={sumitFormOne} className="mt-0 relative">
                  <div className="relative flex justify-between items-start space-x-3">
                    <div>
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Prénom
                      </label>
                      <input
                        onChange={handleOnchange} 
                        name='firstname'
                        min={3}
                        value={user.firstname || ''}
                        className=" w-full px-4 py-2 border-b text-sm border-gray-300 focus:outline-none  focus:border-indigo-500"
                        type=""
                        placeholder="Entrer votre prénom"
                        required
                      />
                    </div>
                    <div>
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Nom
                      </label>
                      <input
                        onChange={handleOnchange} 
                        name='lastname'
                        min={3}
                        value={user.lastname || ''}
                        className=" w-full px-4 py-2 border-b text-sm border-gray-300 focus:outline-none  focus:border-indigo-500"
                        type=""
                        placeholder="Entrer votre nom"
                        required
                      />
                    </div>
                  </div>
                  <div className="relative mt-4">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                      Email
                    </label>
                    <input
                      onChange={handleOnchange} 
                      name='email'
                      value={user.email || ''}
                      className=" w-full focus:ring-0 border-t-0 border-x-0  px-4 py-2 border-b text-sm border-gray-300 focus:outline-none  focus:border-indigo-500"
                      type="email"
                      placeholder="mail@gmail.com"
                      required
                    />
                  </div>
                  <div className="mt-4 content-center">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        ref={inputPassword}
                        onChange={handleOnchange} 
                        min={2}
                        name='password'
                        value={user.password || ''}
                        className="w-full border-x-0 border-t-0 ring-0 focus:ring-0 outline-none  content-center text-base px-4 py-2 border-b  border-gray-300 focus:outline-none focus:border-indigo-500"
                        type="password"
                        placeholder="Entrer votre mot de passe"
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
                  <div className="pt-8">
                    <button
                      type="submit"
                      className="w-full items-center  flex justify-center bg-gradient-to-r from-[#ac3265] to-[#ac3265ee]  hover:bg-gradient-to-l hover:from-gray-700 hover:to-gray-600 text-gray-100 p-4  rounded-full tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                    >
                      <span>Etape suivante</span>{" "}
                      <HiArrowRight className="text-xl ml-4 text-white" />
                    </button>
                  </div>
                </form>
              </>
            )}
            {step === 2 && (
              <>
                <form onSubmit={sumitFormTwo} className="mt-0 relative">
                  <div className="relative flex justify-between items-start space-x-4">
                    <div className="w-1/2">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Nom de votre entreprise
                      </label>
                      <input
                        onChange={handleOnchangeTwo}
                        name='name'
                        min={2}
                        value={company.name || ''}
                        className=" w-full px-4 py-2 border-b text-sm border-gray-300 focus:outline-none  focus:border-indigo-500"
                        type=""
                        placeholder="Entrer le nom de votre Entreprise"
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Email de l’entreprise
                      </label>
                      <input
                        onChange={handleOnchangeTwo}
                        name='email'
                        value={company.email || ''}
                        className=" w-full px-4 border-x-0 border-t-0 py-2 border-b text-sm border-gray-300 focus:outline-none  focus:border-indigo-500"
                        type="email"
                        placeholder="company@gmail.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="relative flex justify-between items-start space-x-4 mt-4">
                    <div className="w-1/2">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Nombre d'employés
                      </label>
                      <input
                        onChange={handleOnchangeTwo}
                        name='number_of_employees'
                        value={company.number_of_employees || ''}
                        className=" w-full focus:ring-0 border-t-0 border-x-0 text-sm px-4 py-2 border-b border-gray-300 focus:outline-none  focus:border-indigo-500"
                        type="number"
                        min={1}
                        placeholder="combien d'employés ? "
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Adresse de l’entreprise
                      </label>
                      <input
                        onChange={handleOnchangeTwo}
                        name='address'
                        value={company.address || ''}
                        className=" w-full px-4 py-2 border-b text-sm border-gray-300 focus:outline-none  focus:border-indigo-500"
                        type=""
                        placeholder="2622 El Camino Real"
                        required
                      />
                    </div>
                  </div>
                  <div className="relative flex justify-between items-start space-x-4 mt-4">
                    <div className="w-1/2">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Pays
                      </label>
                      <input
                        onChange={handleOnchangeTwo}
                        name='country'
                        value={company.country || ''}
                        className=" w-full outline-none ring-0 focus:ring-0 border-t-0 border-x-0 text-sm px-4 py-2 border-b border-gray-300 focus:outline-none  focus:border-indigo-500"
                        type="text"
                        placeholder="Pays de l'entreprise"
                        required
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                        Ville
                      </label>
                      <input
                        onChange={handleOnchangeTwo}
                        name='city'
                        value={company.city || ''}
                        className=" w-full px-4 py-2 border-b text-sm border-gray-300 focus:outline-none  focus:border-indigo-500"
                        type=""
                        placeholder="ville de l'entreprise"
                        required
                      />
                    </div>
                  </div>
                  <div className="pt-8 flex items-center justify-center space-x-4">
                    <button
                      onClick={(_) => prev()}
                      className=" items-center  flex justify-center min-w-[240px] bg-gradient-to-r from-[#ac3265] to-[#ac3265ee]  hover:bg-gradient-to-l hover:from-gray-700 hover:to-gray-600 text-gray-100 px-6 py-2  rounded-md tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                    >
                      <HiArrowLeft className="text-xl mr-4 text-white" />{" "}
                      <span>Etape précédente</span>
                    </button>
                    <button
                      type="submit"
                      className=" items-center  flex justify-center min-w-[240px] bg-gradient-to-r from-[#ac3265] to-[#ac3265ee]  hover:bg-gradient-to-l hover:from-gray-700 hover:to-gray-600 text-gray-100 px-6 py-2  rounded-md tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                    >
                      <span>Etape suivante</span>{" "}
                      <HiArrowRight className="text-xl ml-4 text-white" />
                    </button>
                  </div>
                </form>
              </>
            )}
            {step === 3 && (
              <>
                <form onSubmit={submitForm} className="mt-0 relative">
                  <div className="p-3 bg-gray-700 text-white text-center font-bold rounded-sm">
                    <div className="flex items-center justify-center">
                    <AiFillCheckCircle className="mr-3 text-2xl" /> <span>corfirmation </span>
                    </div>
                    
                  </div>
                  <button className={`px-6 justify-center ${sending && 'disabled'} items-center flex py-3 font-bold hover:bg-green-800 transition bg-green-700 border-4 rounded-full mt-3 min-w-[250px] mx-auto text-white`}>
                    {sending ? <Loader className="text-2xl" />:'Confirmer l’enregistrement de mon compte'}
                  </button>

                  <div className="pt-8 flex items-center justify-center space-x-4">
                    <button
                      onClick={(_) => prev()}
                      className=" items-center text-md flex justify-center min-w-[240px] bg-gradient-to-r from-[#ac3265] to-[#ac3265ee]  hover:bg-gradient-to-l hover:from-green-700 hover:to-gray-600 text-gray-100 px-6 py-2  rounded-md tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                    >
                      <HiArrowLeft className="text-xl mr-4 text-white" />{" "}
                      <span>Etape précédente</span>
                    </button>
                    <button
                      type="submit"
                      className=" items-center opacity-0 disabled  flex justify-center min-w-[240px] bg-gradient-to-r from-[#ac3265] to-[#ac3265ee]  hover:bg-gradient-to-l hover:from-gray-700 hover:to-gray-600 text-gray-100 px-6 py-2  rounded-md tracking-wide font-semibold  shadow-lg cursor-pointer transition ease-in duration-500"
                    >
                      <span>Next step</span>{" "}
                      <HiArrowRight className="text-xl ml-4 text-white" />
                    </button>
                  </div>
                </form>
              </>
            )}
            <p className="flex flex-col absolute -bottom-10 text-sm font-bold underline text-[#ac3265] w-full z-20 right-0 items-center justify-center mt-0 text-center text-md italic">
              <span>Home page</span>
            </p>
              
            </>}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Star;
