import React, { useEffect, useState } from "react";
import DashboardLayout from "../../templates/DashboardLayout";
import { HiCurrencyDollar, HiInformationCircle } from "react-icons/hi";
import User from "../../Model/User";
import UserService from "../../service/UserService";
import {
  FaBoxOpen,
  FaBuilding,
  FaEye,
  FaUserAlt,
  FaUsers,
} from "react-icons/fa";
import { BsBuilding, BsPlusLg, BsShop } from "react-icons/bs";
import { Link } from "react-router-dom";
import { TbArrowsRightLeft } from "react-icons/tb";
import { http_client } from "../../utils/axios-custum";
import Storage from "../../service/Storage";
import { formatCurrency, isContains, roleIs } from "../../utils/function";
import { Alert } from "flowbite-react";
import { RiAdminFill } from "react-icons/ri";

type TypeDashboard = {};

type TotalDashboardProps = {
  totalUser?: string | number;
  totalCash?: string | number;
  totalProduct?: string | number;
  totalCustomer?: string | number;
  totalOrder?: string | number;
};

const DASHBOARD_URL = "/dashboard";
const DASHBOARD_ADMIN_USER_URL = "/dashboard/admin";
const DASHBOARD_SUPER_USER_URL = "/dashboard/super";

const Dashboard: React.FC<TypeDashboard> = () => {
  const [user, setUser] = useState<User>({});
  const [adminUser, setAdminUser] = useState<{
    totalCompany?: string;
    totalUsers?: string;
    firstname?: string;
    lastname?: string;
  }>({});
  const [usersFromAdmin, setUsersFromAdmin] = useState<number>(0);
  const [companiesFromAdmin, setcompaniesFromAdmin] = useState<number>(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [loading, setLoading] = useState(true);

  const [dashboardInfo, setDashboardInfo] = useState<TotalDashboardProps>({
    totalCash: 0,
    totalCustomer: 0,
    totalProduct: 0,
    totalUser: 0,
    totalOrder: 0,
  });

  useEffect(() => {
    setLoading(true);
    let url = roleIs("admin")
      ? DASHBOARD_ADMIN_USER_URL
      : roleIs("super")
      ? DASHBOARD_SUPER_USER_URL
      : DASHBOARD_URL;
    http_client(Storage.getStorage("auth").token)
      .get(url)
      .then((res) => {
        setLoading(false);
        if (roleIs("admin")) {
          setAdminUser(res.data);
          setUsersFromAdmin(res.data.totalUsers);
          setcompaniesFromAdmin(res.data.totalCompany);
        } else if (roleIs("super")) {
          setTotalAdmin(res.data);
        } else {
          setUser(UserService.getUser());
          setDashboardInfo(res.data);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, []);

  return (
    <DashboardLayout
      title="Tableau de bord"
      headerContent={
        <>
          <div className="ml-4 font-bold text-2xl text-[#5c3652]">
            {" "}
            | Bienvenue{" "}
            <span className="uppercase">
              {roleIs("admin") ? (
                <>
                  {adminUser.firstname} {adminUser.lastname}
                </>
              ) : (
                <>
                  {user.firstname} {user.lastname}
                </>
              )}
            </span>
          </div>
          {isContains(UserService.getAuth().roles || [""], "admin") && (
            <>
              <Link
                to="/companies"
                className={`flex ${
                  UserService.getUser().role === "ENTREPRISE" &&
                  !UserService.getUser().as_company &&
                  "disabled"
                }  justify-start text-sm border-4 border-[#7e3151] items-center space-x-2 rounded px-2 py-1 text-white bg-[#ac3265] w-auto ml-3`}
              >
                <FaEye className="mr-2" />
                Voir mes différentes boutiques
              </Link>
              <Link
                to="/admins/create/new"
                className={`flex justify-start text-sm border-4 border-gray-700 items-center space-x-2 rounded px-2 py-1 text-white bg-gray-700 hover:bg-gray-800 transition w-auto ml-3`}
              >
                <BsBuilding className="mr-2" />
                Créer une entreprise <BsPlusLg />
              </Link>
            </>
          )}
        </>
      }
    >
      {!isContains(UserService.getAuth().roles || [""], "super") &&
        isContains(UserService.getAuth().roles || [""], "admin") &&
        !loading && (
          <div className="">
            {!(companiesFromAdmin >= 1) && (
              <Alert
                color="info"
                additionalContent={
                  <React.Fragment>
                    <div className="mt-2 mb-4 text-sm text-blue-700 dark:text-blue-800">
                      Bonjour, vous devez créer au moins une entreprise afin
                      d'utiliser l'application sinon votre compte sera suspendu
                      après les 5 prochains jours. cliquez sur le bouton suivant
                      pour ajouter une nouvelle entreprise
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
      <div className="mx-auto max-w-7xl pt-4 sm:px-6 lg:px-8">
        {isContains(
          UserService.getAuth().roles || [""],
          "gerant" ||
            isContains(UserService.getAuth().roles || [""], "user") ||
            isContains(UserService.getAuth().roles || [""], "caissier")
        ) && (
          <div className="flex space-x-4 font-bold items-center">
            {UserService.getUser().role !== "SUPER" && (
              <Link
                to="/products/history/all"
                className="text-sm text-white px-4 rounded-md bg-yellow-400 py-2"
              >
                {" "}
                <TbArrowsRightLeft
                  size={16}
                  className="inline-block  mr-1"
                />{" "}
                Historiques des entrées sorties produits
              </Link>
            )}
            {UserService.getUser().role !== "SUPER" && (
              <Link
                to="/products/procurements"
                className="text-sm text-white px-4 rounded-md bg-cyan-700 py-2"
              >
                {" "}
                <TbArrowsRightLeft
                  size={16}
                  className="inline-block rotate-90 mr-1"
                />
                Historique des approvisionnements
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-7xl pb-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="min-h-[24rem]  rounded-lg border-4 border-dashed border-gray-300">
            <div className="grid grid-cols-3 gap-3 p-4">
              {roleIs("super") && (
                <Link
                  to="/admins"
                  className={`bg-white ${
                    UserService.getUser().role === "SUPER" && "disabled"
                  } cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start`}
                >
                  <span className="inline-block overflow-hidden">
                    <RiAdminFill className="text-5xl text-[#603d57]" />
                  </span>
                  <div className="ml-3">
                    <h1 className="text-2xl font-bold text-gray-600 pb-1 border-b-2">
                      {`${totalAdmin} Administrateur(s)`}
                    </h1>
                    <h2 className="text-sm font-bold text-[#603d57]">
                      Gestion de administrateurs
                    </h2>
                  </div>
                </Link>
              )}

              {(isContains(UserService.getAuth().roles || [""], "admin") ||
                isContains(UserService.getAuth().roles || [""], "gerant")) && (
                <Link
                  to="/users"
                  className="bg-white cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start"
                >
                  <span className="inline-block overflow-hidden">
                    <FaUserAlt className="text-4xl text-[#603d57]" />
                  </span>
                  <div className="ml-3">
                    <h1 className="text-2xl font-bold text-gray-600 pb-1 border-b-2">
                      {roleIs("admin")
                        ? usersFromAdmin
                        : dashboardInfo.totalUser}{" "}
                      Utilisateur(s)
                    </h1>
                    <h2 className="text-sm font-bold text-[#603d57]">
                      {isContains(UserService.getAuth().roles || [""], "super")
                        ? "Gestion des administrateurs"
                        : "Gestion des utilisateurs"}
                    </h2>
                  </div>
                </Link>
              )}

              {isContains(UserService.getAuth().roles || [""], "admin") &&
                !isContains(UserService.getAuth().roles || [""], "super") && (
                  <Link
                    to="/companies"
                    className={`bg-white ${
                      UserService.getUser().role === "SUPER" && "disabled"
                    } cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start`}
                  >
                    <span className="inline-block overflow-hidden">
                      <BsBuilding className="text-5xl text-[#603d57]" />
                    </span>
                    <div className="ml-3">
                      <h1 className="text-2xl font-bold text-gray-600 pb-1 border-b-2">
                        {`${companiesFromAdmin} Entreprise(s)`}
                      </h1>
                      <h2 className="text-sm font-bold text-[#603d57]">
                        Gestion de entreprises
                      </h2>
                    </div>
                  </Link>
                )}

              {!isContains(UserService.getAuth().roles || [""], "admin") &&
                !isContains(UserService.getAuth().roles || [""], "super") && (
                  <Link
                    to="/cashiers"
                    className={`bg-white ${
                      UserService.getUser().role === "SUPER" && "disabled"
                    } cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start`}
                  >
                    <span className="inline-block overflow-hidden">
                      <HiCurrencyDollar className="text-5xl text-[#603d57]" />
                    </span>
                    <div className="ml-3">
                      <h1 className="text-2xl font-bold text-gray-600 pb-1 border-b-2">
                        {formatCurrency(
                          parseInt(
                            dashboardInfo.totalCash?.toString() || "0",
                            10
                          ),
                          "XAF"
                        )}
                      </h1>
                      <h2 className="text-sm font-bold text-[#603d57]">
                        Gestion de la caisse
                      </h2>
                    </div>
                  </Link>
                )}

              {!isContains(UserService.getAuth().roles || [""], "admin") &&
                !isContains(UserService.getAuth().roles || [""], "super") && (
                  <Link
                    to="/products"
                    className={`bg-white ${
                      UserService.getUser().role === "SUPER" && "disabled"
                    } cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start`}
                  >
                    <span className="inline-block overflow-hidden">
                      <FaBoxOpen className="text-5xl text-[#603d57]" />
                    </span>
                    <div className="ml-3">
                      <h1 className="text-2xl font-bold text-gray-600 pb-1 border-b-2">
                        {dashboardInfo.totalProduct} produits(s)
                      </h1>
                      <h2 className="text-sm font-bold text-[#603d57]">
                        Gestion des produits
                      </h2>
                    </div>
                  </Link>
                )}

              {!isContains(UserService.getAuth().roles || [""], "admin") &&
                !isContains(UserService.getAuth().roles || [""], "super") && (
                  <Link
                    to="/customers"
                    className={`bg-white ${
                      UserService.getUser().role === "SUPER" && "disabled"
                    } cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start`}
                  >
                    <span className="inline-block overflow-hidden">
                      <FaUsers className="text-5xl text-[#603d57]" />
                    </span>
                    <div className="ml-3">
                      <h1 className="text-2xl font-bold text-gray-600 pb-1 border-b-2">
                        {dashboardInfo.totalCustomer} Client(s)
                      </h1>
                      <h2 className="text-sm font-bold text-[#603d57]">
                        Gestion des clients
                      </h2>
                    </div>
                  </Link>
                )}

              {!isContains(UserService.getAuth().roles || [""], "admin") &&
                !isContains(UserService.getAuth().roles || [""], "super") && (
                  <Link
                    to="/orders"
                    className={`bg-white ${
                      UserService.getUser().role === "SUPER" && "disabled"
                    } cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start`}
                  >
                    <span className="inline-block overflow-hidden">
                      <BsShop className="text-5xl text-[#603d57]" />
                    </span>
                    <div className="ml-3 mr-2">
                      <h1 className="text-2xl font-bold text-gray-600 pb-1 border-b-2">
                        {dashboardInfo.totalOrder} Commande(s)
                      </h1>
                      <h2 className="text-sm font-bold text-[#603d57]">
                        Gestion des commandes
                      </h2>
                    </div>
                  </Link>
                )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
