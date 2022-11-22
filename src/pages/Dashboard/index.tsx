import React, {
  ChangeEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import DashboardLayout from "../../templates/DashboardLayout";
import {
  HiCurrencyDollar,
  HiInformationCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
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
import { Alert, Modal } from "flowbite-react";
import { RiAdminFill } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import Loader from "../../atoms/Loader";
import Company from "../../Model/Company";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  setCompanies,
  setCurrentCompany,
  switchToAdmin,
} from "../../store/features/companies/CompanySlice";

type TypeDashboard = {};

export type TotalDashboardProps = {
  totalUser?: string | number;
  totalCash?: string | number;
  totalProduct?: string | number;
  totalCustomer?: string | number;
  totalOrder?: string | number;
};

const DASHBOARD_URL = "/dashboard";
const DASHBOARD_ADMIN_USER_URL = "/dashboard/admin";
const DASHBOARD_SUPER_USER_URL = "/dashboard/super";
const GET_ALL_COMPANIES_FOR_ADMIN_URL = "/companies";

const Dashboard: React.FC<TypeDashboard> = () => {
  const [user, setUser] = useState<User>({});
  const [showModal, setShowModal] = useState(false);
  const [adminUser, setAdminUser] = useState<{
    totalCompany?: string;
    totalUsers?: string;
    firstname?: string;
    lastname?: string;
  }>({});
  const [usersFromAdmin, setUsersFromAdmin] = useState<number>(0);
  const [companiesFromAdmin, setcompaniesFromAdmin] = useState<number>(0);
  const [companiesAdmin, setCompaniesAdmin] = useState<Company[]>([]);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [loading, setLoading] = useState(true);

  const companiesStore = useSelector((state: any) => state.companies);
  const dispatch = useDispatch();

  const selectCompanyRef = useRef(null);

  const [dashboardInfo, setDashboardInfo] = useState<TotalDashboardProps>({
    totalCash: 0,
    totalCustomer: 0,
    totalProduct: 0,
    totalUser: 0,
    totalOrder: 0,
  });

  const onClick = () => {
    setShowModal(!showModal);
  };

  const onClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    setLoading(true);
    let url =
      roleIs("admin") && !companiesStore.currentCompany
        ? DASHBOARD_ADMIN_USER_URL
        : roleIs("super")
        ? DASHBOARD_SUPER_USER_URL
        : companiesStore.currentCompany
        ? `${DASHBOARD_URL}?id=${companiesStore.currentCompany.id}`
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

    if (roleIs("admin")) {
      http_client(Storage.getStorage("auth").token)
        .get(`${GET_ALL_COMPANIES_FOR_ADMIN_URL}`)
        .then((res) => {
          setCompaniesAdmin(res.data);
          dispatch(setCompanies(res.data));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    if (roleIs("admin") && companiesStore.currentCompany) {
      console.log("change");

      let url = `${DASHBOARD_URL}?id=${companiesStore.currentCompany.id}`;
      http_client(Storage.getStorage("auth").token)
        .get(url)
        .then((res) => {
          setLoading(false);
          setDashboardInfo(res.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }

    if (roleIs("admin") && !companiesStore.currentCompany) {
      console.log("change");

      let url = DASHBOARD_ADMIN_USER_URL;
      http_client(Storage.getStorage("auth").token)
        .get(url)
        .then((res) => {
          setLoading(false);
          setAdminUser(res.data);
          setUsersFromAdmin(res.data.totalUsers);
          setcompaniesFromAdmin(res.data.totalCompany);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  }, [companiesStore]);

  const changeCompany = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value !== "empty") {
      dispatch(setCurrentCompany(JSON.parse(e.target.value)));
    } else {
      dispatch(switchToAdmin());
    }

    if (selectCompanyRef.current) {
      (selectCompanyRef.current as HTMLSelectElement).value = "empty";
    }

    setShowModal(false);
  };

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
          {roleIs("admin") && (
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

              {(companiesFromAdmin >= 1 || companiesStore.currentCompany) && (
                <button
                  onClick={() => onClick()}
                  className={`flex justify-start text-sm border-4 border-cyan-700 items-center space-x-2 rounded px-2 py-1 text-white bg-cyan-700 hover:bg-cyan-800 transition w-auto ml-3`}
                >
                  <MdAdminPanelSettings className=" text-2xl mr-2" /> gérer mes
                  différentes entreprise
                </button>
              )}
            </>
          )}
        </>
      }
    >
      {!roleIs("super") && roleIs("admin") && !loading && (
        <div className="">
          {!(companiesFromAdmin >= 1) && !companiesStore.currentCompany && (
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
        {roleIs("admin") && companiesStore.currentCompany && (
          <>
            <div className=" text-3xl font-bold">
              Vous êtes connecté a l’entreprise :{" "}
              <span className=" text-primary">
                {companiesStore.currentCompany.name}
              </span>{" "}
            </div>
          </>
        )}
        {isContains(
          UserService.getAuth().roles || [""],
          "gerant" ||
            isContains(UserService.getAuth().roles || [""], "user") ||
            isContains(UserService.getAuth().roles || [""], "caissier")
        ) && (
          <div
            className={`flex space-x-4 font-bold items-center ${
              roleIs("caissier") && "disabled"
            }`}
          >
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

      <React.Fragment>
        <Modal show={showModal} size="md" popup={true} onClose={onClose}>
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <BsBuilding className="mx-auto mb-4 h-14 w-14 text-gray-400 " />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Choisissez l’entreprise que vous voulez gérer
              </h3>

              <select
                className="px-4 py-2 w-full mb-3 text-center bg-gray-200 text-base rounded-md"
                onChange={changeCompany}
                ref={selectCompanyRef}
              >
                <option value="empty">
                  {" "}
                  --- Choisissez votre entreprise ---{" "}
                </option>
                {companiesAdmin.map((company) => (
                  <option key={company.id} value={JSON.stringify(company)}>
                    {company.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-center gap-4">
                {companiesStore.currentCompany && (
                  <button
                    color="failure"
                    className="bg-green-500 w-full text-white rounded-md px-4 py-2"
                    onClick={() => {
                      dispatch(switchToAdmin());
                    }}
                  >
                    Revenir en tant qu’administrateur
                  </button>
                )}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>

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

              {(roleIs("admin") || roleIs("gerant")) && (
                <Link
                  to="/users"
                  className="bg-white cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start"
                >
                  <span className="inline-block overflow-hidden">
                    <FaUserAlt className="text-4xl text-[#603d57]" />
                  </span>
                  <div className="ml-3">
                    <h1 className="text-2xl font-bold text-gray-600 pb-1 border-b-2">
                      {roleIs("admin") && !companiesStore.currentCompany
                        ? usersFromAdmin
                        : dashboardInfo.totalUser}{" "}
                      Utilisateur(s)
                    </h1>
                    <h2 className="text-sm font-bold text-[#603d57]">
                      {roleIs("super")
                        ? "Gestion des administrateurs"
                        : "Gestion des utilisateurs"}
                    </h2>
                  </div>
                </Link>
              )}

              {roleIs("admin") &&
                !roleIs("super") &&
                !companiesStore.currentCompany && (
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

              {((!roleIs("admin") && !roleIs("super")) ||
                companiesStore.currentCompany) && (
                <Link
                  to="/cashiers"
                  className={`bg-white ${
                    UserService.getUser().role === "SUPER" && "disabled"
                  } ${
                    roleIs("user") && "disabled"
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

              {((!roleIs("admin") && !roleIs("super")) ||
                companiesStore.currentCompany) && (
                <Link
                  to="/products"
                  className={`bg-white ${
                    UserService.getUser().role === "SUPER" && "disabled"
                  } cursor-pointer ${
                    roleIs("caissier") && "disabled"
                  } hover:shadow-lg transition p-4 rounded-md flex justify-start items-start`}
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

              {((!roleIs("admin") && !roleIs("super")) ||
                companiesStore.currentCompany) && (
                <Link
                  to="/customers"
                  className={`bg-white ${
                    UserService.getUser().role === "SUPER" && "disabled"
                  } cursor-pointer hover:shadow-lg ${
                    roleIs("caissier") && "disabled"
                  } transition p-4 rounded-md flex justify-start items-start`}
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

              {((!roleIs("admin") && !roleIs("super")) ||
                companiesStore.currentCompany) && (
                <Link
                  to="/orders"
                  className={`bg-white ${
                    UserService.getUser().role === "SUPER" && "disabled"
                  } cursor-pointer hover:shadow-lg transition p-4 ${
                    roleIs("caissier") && "disabled"
                  } rounded-md flex justify-start items-start`}
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
