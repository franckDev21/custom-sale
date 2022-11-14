import React, { useState, FormEvent, ChangeEvent, useRef } from "react";
import { FaCheckCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { HiOutlineArrowNarrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../atoms/Loader";
import User from "../../../Model/User";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { http_client } from "../../../utils/axios-custum";

type CreateUserProps = {
  type?: string;
};

const CREATE_USER_URL = "/users/create";
const CREATE_ADMIN_USER_URL = "/admin/user/create";

const CreateUser: React.FC<CreateUserProps> = ({ type = "user" }) => {
  const [sending, setSending] = useState(false);
  const [errForm, setErrForm] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<User>({
    active: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // ref
  const inputPassword = useRef(null);
  const inputPassword2 = useRef(null);

  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errForm) setErrForm("");

    switch (e.target.name) {
      case "firstname":
        setUser({ ...user, firstname: e.target.value });
        break;
      case "lastname":
        setUser({ ...user, lastname: e.target.value });
        break;
      case "email":
        setUser({ ...user, email: e.target.value });
        break;
      case "tel":
        setUser({ ...user, tel: e.target.value });
        break;
      case "password":
        setUser({ ...user, password: e.target.value });
        break;
      case "active":
        setUser({ ...user, active: e.target.checked === true });
        break;
      default:
        setUser({ ...user, password_confirmation: e.target.value });
        break;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setErrForm("");
    http_client(Storage.getStorage("auth").token)
      .post(type === "admin" ? CREATE_ADMIN_USER_URL : CREATE_USER_URL, user)
      .then((res) => {
        setSending(false);
        toast.success(res.data.message);
        setSuccess(true);
      })
      .catch((err) => {
        setSending(false);
        setErrForm(err.response.data.message);
        console.log(err);
      });
  };

  return (
    <DashboardLayout
      titleClass={type === "admin" ? "w-[35%]" : ""}
      title={
        type === "admin"
          ? "Gestion des administrateurs "
          : "Gestion des utilisateurs"
      }
      headerContent={
        <>
          <div
            className={`ml-4 ${
              type === "admin" ? "w-[60%]" : "w-[70%]"
            } font-bold text-2xl text-[#ac3265] flex items-center justify-between`}
          >
            <span>
              | Ajouter un{" "}
              {type === "admin"
                ? "nouveau administrateur"
                : "nouvelle utilisateur"}{" "}
            </span>
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {success && (
            <div className="p-5 max-w-4xl flex justify-between items-start  mx-auto rounded-lg text-center bg-green-50 border-green-400 border-4 text-green-400 font-bold text-3xl relative">
              <span className="flex items-start justify-start flex-col">
                <span className="flex items-start justify-start">
                  <FaCheckCircle className="mr-2" />{" "}
                  <span>Votre utilisateur a été crée avec succès !</span>
                </span>
                <span className="text-sm italic text-gray-500 ">
                  Un courriel contenant ses informations de connexion a été
                  envoyé à votre utilisateur !{" "}
                </span>
              </span>
              <Link
                to={`${type === "admin" ? "/admins" : "/users"}`}
                className="px-4 items-center justify-center py-2 bg-[#ac3265] transition hover:bg-[#8a2a52] active:scale-[96%] text-white rounded-md text-base inline-block ml-4"
              >
                Liste
              </Link>
            </div>
          )}
          {!success && (
            <form
              onSubmit={handleSubmit}
              className="p-5 max-w-4xl mx-auto rounded-lg  bg-white relative"
            >
              <Link
                to="/users"
                className="text-3xl inline-block text-[#ac3265] hover:text-gray-700"
              >
                <HiOutlineArrowNarrowLeft />
              </Link>

              {errForm && (
                <div className="px-3 py-1 rounded-md mb-2 text-center text-sm font-bold text-red-500 bg-red-100">
                  {errForm}
                </div>
              )}

              <div className="flex justify-between items-start space-x-4 mb-4">
                <div className=" flex-col flex w-1/2">
                  <label htmlFor="firstname">Prénom</label>
                  <input
                    autoFocus
                    required
                    onChange={handleOnchange}
                    name="firstname"
                    value={user.firstname || ""}
                    type="text"
                    placeholder="Entrer le prénom de l'utilisateur"
                    className="px-3 mt-2 rounded-md border-none focus:ring-2 ring-gray-700 focus:ring-gray-700 py-2 bg-gray-100 w-full"
                  />
                </div>
                <div className=" flex-col flex w-1/2">
                  <label htmlFor="lastname">Nom</label>
                  <input
                    required
                    onChange={handleOnchange}
                    name="lastname"
                    value={user.lastname || ""}
                    type="text"
                    placeholder="Entrer le prénom de le nom"
                    className="px-3 mt-2 rounded-md border-none focus:ring-2 ring-gray-700 focus:ring-gray-700 py-2 bg-gray-100 w-full"
                  />
                </div>
              </div>

              <div className="flex justify-between items-start space-x-4 mb-4">
                <div className=" flex-col flex w-1/2">
                  <label htmlFor="email">Email</label>
                  <input
                    required
                    onChange={handleOnchange}
                    name="email"
                    value={user.email || ""}
                    type="email"
                    placeholder="Email de l'utilisateur"
                    className="px-3 mt-2 rounded-md border-none focus:ring-2 ring-gray-700 focus:ring-gray-700 py-2 bg-gray-100 w-full"
                  />
                </div>
                <div className=" flex-col flex w-1/2">
                  <label htmlFor="tel">Téléphone</label>
                  <input
                    required
                    onChange={handleOnchange}
                    name="tel"
                    value={user.tel || ""}
                    type="tel"
                    placeholder="Numéro de téléphone ..."
                    className="px-3 mt-2 rounded-md border-none focus:ring-2 ring-gray-700 focus:ring-gray-700 py-2 bg-gray-100 w-full"
                  />
                </div>
              </div>

              <div className="flex justify-between items-start space-x-4">
                <div className=" flex-col flex w-1/2">
                  <label htmlFor="firstname" className="mb-2">
                    Mot de passe
                  </label>
                  <div className="relative inline-block">
                    <input
                      required
                      ref={inputPassword}
                      onChange={handleOnchange}
                      name="password"
                      value={user.password || ""}
                      type="password"
                      placeholder="mot de passe de l'utilisateur"
                      className="px-3 inline-block rounded-md border-none focus:ring-2 ring-gray-700 focus:ring-gray-700 py-2 bg-gray-100 w-full"
                    />
                    <span
                      onClick={(_) => {
                        if (inputPassword.current) {
                          if ((inputPassword.current as any).type === "text") {
                            (inputPassword.current as any).type = "password";
                            setShowPassword(false);
                          } else {
                            (inputPassword.current as any).type = "text";
                            setShowPassword(true);
                          }
                        }
                      }}
                      className=" text-[#5c3652] text-xl cursor-pointer absolute top-1/2 -translate-y-1/2 right-2"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
                <div className=" flex-col flex w-1/2">
                  <label htmlFor="firstname" className="mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative inline-block">
                    <input
                      required
                      ref={inputPassword2}
                      onChange={handleOnchange}
                      name="password_confirmation"
                      value={user.password_confirmation || ""}
                      type="password"
                      placeholder="Confirmation du mot de passe"
                      className="px-3 inline-block rounded-md border-none focus:ring-2 ring-gray-700 focus:ring-gray-700 py-2 bg-gray-100 w-full"
                    />
                    <span
                      onClick={(_) => {
                        if (inputPassword2.current) {
                          if ((inputPassword2.current as any).type === "text") {
                            (inputPassword2.current as any).type = "password";
                            setShowPassword2(false);
                          } else {
                            (inputPassword2.current as any).type = "text";
                            setShowPassword2(true);
                          }
                        }
                      }}
                      className=" text-[#5c3652] text-xl cursor-pointer absolute top-1/2 -translate-y-1/2 right-2"
                    >
                      {showPassword2 ? <FaEyeSlash /> : <FaEye />}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-start mt-3 mb-1">
                <input
                  type="checkbox"
                  onChange={handleOnchange}
                  checked={user.active}
                  name="active"
                  id="active"
                  className="accent-primary rounded text-[#ac3265] w-6 h-6 mr-2 outline-none ring-0 shadow-md  focus:outline-none focus:ring-0"
                />
                <label
                  htmlFor="active"
                  className="text-gray-500 cursor-pointer"
                >
                  Voulez-vous directement activer{" "}
                  {type === "admin" ? "l'administrateur" : "l'utilisateur"} a sa
                  création ?
                </label>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  className={`px-4 ${
                    sending && "disabled"
                  } flex justify-center items-center py-[0.48rem] bg-[#ac3265] hover:bg-[#951f50] transition min-w-[200px] text-white text-sm font-semibold rounded-md`}
                >
                  {sending ? (
                    <Loader className=" inline-block text-xl" />
                  ) : type === "admin" ? (
                    "Enregister l'administrateur"
                  ) : (
                    "Enregister l'utilisateur"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateUser;
