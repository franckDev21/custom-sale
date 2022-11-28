import React, { useEffect, useState } from "react";
import { AiFillFolderOpen } from "react-icons/ai";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../atoms/Loader";
import AdminUser from "../../../Model/AdminUser";
import Company from "../../../Model/Company";
import CardCompany from "../../../molecules/CardCompany";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { http_client } from "../../../utils/axios-custum";

type AdminUserDetailProps = {};

const GET_ADMIN_USER_URL = "admins";
const TOGGLE_ACTIVE_COMPANY_ADMIN_USER_URL = "admin-user/toggle-active/company";

const AdminUserDetail: React.FC<AdminUserDetailProps> = () => {
  const [adminUser, setAdminUser] = useState<AdminUser>({});
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [activation, setActivation] = useState(false);

  const { id } = useParams();

  const toggleActive = (idCompany: string) => {
    setActivation(true);
    http_client(Storage.getStorage("auth").token)
      .post(`${TOGGLE_ACTIVE_COMPANY_ADMIN_USER_URL}/${idCompany}/${id}`)
      .then((res) => {
        setActivation(false);
        updateActive(idCompany || "1");
        toast.success(res.data.message);
      })
      .catch((err: any) => {
        setActivation(false);
        console.log(err);
      });
  };

  const updateActive = (id: string) => {
    let companyFind = companies.find(
      (company) =>
        company.id?.toString().toLocaleLowerCase() ===
        id.toString().toLocaleLowerCase()
    );
    let companiesFilter = companies.filter(
      (company) =>
        company.id?.toString().toLocaleLowerCase() !==
        id.toString().toLocaleLowerCase()
    );
    let newCompany: Company = {
      ...companyFind,
      active: companyFind?.active ? false : true,
    };
    let newCompanyTab = [...companiesFilter, newCompany];
    setCompanies(newCompanyTab);
  };

  useEffect(() => {
    http_client(Storage.getStorage("auth").token)
      .get(`${GET_ADMIN_USER_URL}/${id}`)
      .then((res) => {
        setLoading(false);
        setAdminUser(res.data);
        setCompanies(res.data.companies);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [id]);

  return (
    <DashboardLayout
      titleClass="w-[40%]"
      headerContent={
        <>
          <div className="ml-4 w-[70%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            <span>
              | Liste des boutiques de : {adminUser.firstname}{" "}
              {adminUser.lastname}{" "}
            </span>
          </div>
        </>
      }
      title="Gestion des administrateurs"
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <>
            {companies.length >= 1 ? (
              <div className="grid grid-cols-3 gap-3 p-4">
                {companies.map((company) => (
                  <CardCompany
                    key={company.id}
                    companyEmail={company.email || ""}
                    companyId={company.id?.toString() || ""}
                    companyName={company.name || ""}
                    companyActive={company.active}
                    editing={true}
                    activation={activation}
                    onActive={() => {
                      toggleActive(company.id?.toString() || "");
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className=" flex justify-center items-center text-gray-500 min-h-[300px] flex-col text-5xl font-bold w-full text-center ">
                <AiFillFolderOpen className=" text-8xl " />
                Aucune Entreprise
              </div>
            )}
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

export default AdminUserDetail;
