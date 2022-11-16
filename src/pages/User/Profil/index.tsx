import { Alert } from "flowbite-react";
import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { FaBuilding, FaPen } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { toast } from "react-toastify";

import {
  HiChevronDoubleLeft,
  HiEye,
  HiInformationCircle,
} from "react-icons/hi";
import Loader from "../../../atoms/Loader";
import User from "../../../Model/User";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { baseURL, http_client } from "../../../utils/axios-custum";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/features/auth/authSlice";
import { BsBuilding } from "react-icons/bs";
import { Link } from "react-router-dom";
import { roleIs } from "../../../utils/function";

type TypeProfil = {};

type TypePassword = {
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
};

const GET_INFO_USER_URL = "auth/user/info";
const UPDATE_INFO_USER_URL = "auth/user";
const UPDATE_USER_PASSWORD_URL = "auth/user/password";
const UPDATE_PICTURE_USER_URL = "auth/user/picture";
const DASHBOARD_ADMIN_USER_URL = "/dashboard/admin";

const API_STORAGE_URL = `${baseURL}/storage`;

const Profil: FC<TypeProfil> = () => {
  const [user, setUser] = useState<User>({});
  const [password, setPassword] = useState<TypePassword>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [sending, setSending] = useState(false);
  const [sending2, setSending2] = useState(false);
  const [errorUpdateInfo, setErrorUpdateInfo] = useState("");
  const [errorUpdatePass, setErrorUpdatePass] = useState("");
  const [companiesFromAdmin, setcompaniesFromAdmin] = useState<number>(0);
  const [urlImg, setUrlImg] = useState(
    "https://ernglobal.org/wp-content/uploads/2017/10/default-user-image.png"
  );
  const [imgSending, setImgSending] = useState(false);

  const dispatch = useDispatch();

  // method
  const handleOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorUpdateInfo) setErrorUpdateInfo("");
    switch (e.target.name) {
      case "email":
        setUser({ ...user, email: e.target.value });
        break;
      case "firstname":
        setUser({ ...user, firstname: e.target.value });
        break;
      case "lastname":
        setUser({ ...user, lastname: e.target.value });
        break;
    }
  };

  const handlePassWordOnchange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorUpdatePass) setErrorUpdatePass("");
    switch (e.target.name) {
      case "old_password":
        setPassword({ ...password, old_password: e.target.value });
        break;
      case "new_password":
        setPassword({ ...password, new_password: e.target.value });
        break;
      case "confirm_password":
        setPassword({ ...password, confirm_password: e.target.value });
        break;
    }
  };

  const handleUpdateInfo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);

    const userInfo = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };

    // update user info
    http_client(Storage.getStorage("auth").token)
      .post(UPDATE_INFO_USER_URL, userInfo)
      .then((res) => {
        // setUser(res.data);
        setSending(false);
        setUser(res.data);

        let oltAuth = Storage.getStorage("auth");

        Storage.setStorage("auth", {
          token: Storage.getStorage("auth").token,
          user: res.data,
          prermissions: oltAuth.prermissions,
          roles: oltAuth.roles,
        });

        toast.success("Vos informations ont été mises à jour avec succès !");
        setEditing(false);
      })
      .catch((err) => {
        setSending(false);
        setErrorUpdateInfo(err.response.data.message);
        console.log(err);
      });
  };

  const handleUpdatePassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending2(true);
    // update user info
    http_client(Storage.getStorage("auth").token)
      .post(UPDATE_USER_PASSWORD_URL, password)
      .then((res) => {
        setSending2(false);
        if (res.data.message) {
          toast.success(res.data.message);
          setEditing(false);
        } else {
          setErrorUpdatePass(res.data);
        }
      })
      .catch((err) => {
        setSending2(false);
        setErrorUpdateInfo(err.response.data.message);
        console.log(err);
      });
  };

  const handleChangImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setUrlImg(
        "https://ernglobal.org/wp-content/uploads/2017/10/default-user-image.png"
      );
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setImgSending(true);
    // update user info
    http_client(Storage.getStorage("auth").token)
      .post(UPDATE_PICTURE_USER_URL, formData)
      .then((res) => {
        setImgSending(false);
        if (res.data.message) {
          toast.success(res.data.message);
          setEditing(false);
          let url = URL.createObjectURL(file);
          setUrlImg(url);

          let { user, token } = Storage.getStorage("auth");

          let auth = {
            user: { ...user, photo: res.data.path },
            token: token,
          };

          Storage.setStorage("auth", auth);

          dispatch(setAuth(Storage.getStorage("auth")));
        } else {
          setErrorUpdatePass(res.data);
        }
      })
      .catch((err) => {
        setImgSending(false);
        toast.error(err.response.data.message);
        console.log(err);
      });
  };

  useEffect(() => {
    // DASHBOARD_ADMIN_USER_URL
    Promise.all([
      http_client(Storage.getStorage("auth").token).post(GET_INFO_USER_URL),
      http_client(Storage.getStorage("auth").token).get(
        DASHBOARD_ADMIN_USER_URL
      ),
    ]).then((res) => {
      setUser(res[0].data);
      if (roleIs("admin")) {
        setcompaniesFromAdmin(res[1].data.totalCompany);
      }
      if (res[0].data.photo) {
        setUrlImg(`${API_STORAGE_URL}/${res[0].data.photo}`);
      }
      setLoading(false);
    });
  }, []);

  return (
    <DashboardLayout
      titleClass="w-[21%]"
      title="Bienvenue 👋 😊 "
      headerContent={
        <>
          <div className="ml-4 w-[79%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            <span>
              {" "}
              {!loading && (
                <>
                  | {user.firstname} {user.lastname}
                </>
              )}
            </span>

            <div className="flex items-center justify-end">
              <BsBuilding />{" "}
              <Link
                to="/my/company/view"
                className={`flex ${
                  user.role === "ENTREPRISE"
                    ? !user.as_company && "disabled"
                    : "disabled"
                } justify-start text-sm border-4 border-[#7e3151] items-center space-x-2 rounded px-2 py-1 text-white bg-[#ac3265] w-auto ml-3`}
              >
                Voir mon entreprise <HiEye className="ml-2" />
              </Link>
            </div>
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <>
            {user.role !== "SUPER" && !user.as_company && !user.company_id && (
              <div className="">
                {!(companiesFromAdmin >= 1) && (
                  <Alert
                    color="info"
                    additionalContent={
                      <React.Fragment>
                        <div className="mt-2 mb-4 text-sm text-blue-700 dark:text-blue-800">
                          Bonjour, vous devez créer au moins une entreprise afin
                          d'utiliser l'application sinon votre compte sera
                          suspendu après les 5 prochains jours. cliquez sur le
                          bouton suivant pour ajouter une nouvelle entreprise
                        </div>
                        <div className="flex">
                          <Link
                            to={`/my/company/create`}
                            type="button"
                            className="mr-2 inline-flex items-center rounded-lg bg-blue-700 px-3 py-1.5 text-center text-xs font-medium text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:bg-blue-800 dark:hover:bg-blue-900"
                          >
                            Créer votre prèmiere entreprise{" "}
                            <FaBuilding className="-mr-0.5 ml-2" />
                          </Link>
                        </div>
                      </React.Fragment>
                    }
                    icon={HiInformationCircle}
                  >
                    <h3 className="text-lg font-medium text-blue-700 dark:text-blue-800">
                      Inscription incomplète
                    </h3>
                  </Alert>
                )}
              </div>
            )}
            <div className="px-4 py-6 sm:px-0">
              <div className="flex justify-start space-x-4">
                <label htmlFor="image" className=" cursor-pointer ">
                  <div className="w-[160px] flex justify-center items-center overflow-hidden bg-gray-50 h-[150px] relative rounded-t-md">
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
                    mettre a jour la photo
                  </button>
                </label>

                <input
                  accept="image/*"
                  name="image"
                  onChange={handleChangImageFile}
                  type="file"
                  id="image"
                  hidden
                  className="hidden"
                />

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
                      className="flex justify-start text-sm border-4 border-[#ac3265] items-center space-x-2 rounded px-2 py-1 text-white bg-[#ac3265] w-auto"
                    >
                      Editer mon profil <FaPen className="ml-2" />
                    </button>
                  </div>
                ) : (
                  <>
                    <form
                      onSubmit={handleUpdateInfo}
                      className="text-lg w-[40%] flex flex-col space-y-2"
                    >
                      {errorUpdateInfo && (
                        <div className="px-4 text-center py-3 text-sm bg-red-100 rounded-md mb-4 text-red-500 font-semibold">
                          {errorUpdateInfo}
                        </div>
                      )}
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
                          {sending ? (
                            <Loader className="text-lg" />
                          ) : (
                            "sauvegarder "
                          )}
                        </button>
                      </div>
                    </form>
                    <form
                      onSubmit={handleUpdatePassword}
                      className="text-lg w-[40%] flex flex-col space-y-2"
                    >
                      {errorUpdatePass && (
                        <div className="px-4 text-center py-3 text-sm bg-red-100 rounded-md mb-4 text-red-500 font-semibold">
                          {errorUpdatePass}
                        </div>
                      )}
                      <div className="flex justify-start items-center space-x-2 rounded px-2 py-1 bg-gray-50">
                        <input
                          type="password"
                          name="old_password"
                          className="w-full inline-block  py-2 rounded-md px-3"
                          placeholder="current password"
                          value={password.old_password || ""}
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
                          value={password.new_password || ""}
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
                          value={password.confirm_password || ""}
                          onChange={handlePassWordOnchange}
                          required
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          type="submit"
                          className="flex self-start justify-start text-sm border-4 border-blue-500 items-center space-x-2 rounded px-4 uppercase font-bold py-1 text-white bg-blue-400 w-auto"
                        >
                          {sending2 ? (
                            <Loader className="text-lg" />
                          ) : (
                            <>
                              Sauvegarder le mot de passe{" "}
                              <RiLockPasswordFill className="ml-2" />
                            </>
                          )}
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
