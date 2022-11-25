import React, { useState, useEffect } from "react";
import { BsShop } from "react-icons/bs";
import { FaBoxOpen, FaUserAlt, FaUsers } from "react-icons/fa";
import { HiCurrencyDollar } from "react-icons/hi";
import { MdAdminPanelSettings } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TotalDashboardProps } from ".";
import Company from "../../Model/Company";
import Storage from "../../service/Storage";
import { setCurrentCompany } from "../../store/features/companies/CompanySlice";
import DashboardLayout from "../../templates/DashboardLayout";
import { http_client } from "../../utils/axios-custum";
import { formatCurrency, roleIs } from "../../utils/function";

type DashbordCompanyProps = {};

const DASHBOARD_URL = "/dashboard";
const DashbordCompany: React.FC<DashbordCompanyProps> = () => {
  const [loading, setLoading] = useState(true);
  const [company,setCompany] = useState<Company>({})

  const [dashboardInfo, setDashboardInfo] = useState<TotalDashboardProps>({
    totalCash: 0,
    totalCustomer: 0,
    totalProduct: 0,
    totalUser: 0,
    totalOrder: 0,
  });

  // const companiesStore = useSelector((state: any) => state.companies);

  const navigate = useNavigate()
  const { id } = useParams();
  const dispatch = useDispatch()

  useEffect(() => {

    if(!roleIs('admin')){
      navigate('/dashbord')
    }

    setLoading(true);

    http_client(Storage.getStorage("auth").token)
      .get(`${DASHBOARD_URL}?id=${id}`)
      .then((res) => {
        setLoading(false);
        setDashboardInfo(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });

      http_client(Storage.getStorage("auth").token)
        .get(`/company/${id}`)
        .then(res => {
          setCompany(res.data);
        })
        .catch(err => {
          console.log(err);
        })

  }, []);

  return (
    <DashboardLayout
      title="page d'administration"
      headerContent={
        <>
          {/* <button
            onClick={() => dispatch(setCurrentCompany(company))}
            className={`flex justify-start text-sm border-4 border-cyan-700 items-center space-x-2 rounded px-2 py-1 text-white bg-cyan-700 hover:bg-cyan-800 transition w-auto ml-3`}
          >
            <MdAdminPanelSettings className=" text-2xl mr-2" /> gérer ma
            boutique
          </button> */}
        </>
      }
    >
      <div className="mx-auto max-w-7xl pb-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="min-h-[24rem]  rounded-lg border-4 border-dashed border-gray-300">
            <div className="grid grid-cols-3 gap-3 p-4">
              <button className="bg-white  transition cursor-default p-4 rounded-md flex justify-start items-start">
                <span className="inline-block overflow-hidden">
                  <FaUserAlt className="text-4xl text-[#603d57]" />
                </span>
                <div className="ml-3">
                  <h1 className="text-2xl font-bold text-gray-600 pb-1 border-b-2">
                    {dashboardInfo.totalUser} Utilisateur(s)
                  </h1>
                  <h2 className="text-sm font-bold text-[#603d57]">
                    Gestion des utilisateurs
                  </h2>
                </div>
              </button>

              <button
                className={`bg-white  transition cursor-default p-4 rounded-md flex justify-start items-start`}
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
                      ) || 0,
                      "XAF"
                    )}
                  </h1>
                  <h2 className="text-sm font-bold text-[#603d57]">
                    Gestion de la caisse
                  </h2>
                </div>
              </button>
              <button
                className={`bg-white cursor-default transition p-4 rounded-md flex justify-start items-start`}
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
              </button>
              <button
                className={`bg-white  transition cursor-default p-4 rounded-md flex justify-start items-start`}
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
              </button>
              <button
                className={`bg-white  transition cursor-default p-4 rounded-md flex justify-start items-start`}
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashbordCompany;
