import React, { useEffect, useState } from "react";
import { BsBuilding } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import AdminUser from "../../../Model/AdminUser";
import Company from "../../../Model/Company";
import CardCompany from "../../../molecules/CardCompany";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { http_client } from "../../../utils/axios-custum";

type CompanyListProps = {};

const GET_COMPANIES_FORM_ADMIN_USER = "companies";
const DASHBOARD_ADMIN_USER_URL = "/dashboard/admin";

const CompanyList: React.FC<CompanyListProps> = () => {
  const [adminUser, setAdminUser] = useState<AdminUser>({});
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {

    Promise.all([
      http_client(Storage.getStorage("auth").token).get(
        GET_COMPANIES_FORM_ADMIN_USER
      ),
      http_client(Storage.getStorage("auth").token).get(
        DASHBOARD_ADMIN_USER_URL
      )
    ])
      .then((res) => {
        setCompanies(res[0].data);
        setAdminUser(res[1].data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <DashboardLayout
      title="Liste de mes entreprises"
      headerContent={
        <div className="font-bold text-2xl text-[#ac3265] flex items-center justify-between">
          <div className="flex items-center justify-end">
            <button className="flex text-lg cursor-default  justify-start border-4 items-center space-x-2 rounded px-2 py-1 text-gray-700 bg-gray-50 w-auto ml-3">
              <BsBuilding />{" "}
              <span className="pl-1">
                {" "}
                {adminUser.companies?.length} Entreprise(s)
              </span>
            </button>
            <button className="flex text-lg cursor-default  justify-start border-4 items-center space-x-2 rounded px-2 py-1 text-gray-700 bg-gray-50 w-auto ml-3">
              <HiUserGroup />{" "}
              <span className="pl-1">
                {" "}
                {adminUser.users?.length} Utilisateur(s)
              </span>
            </button>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-3 p-4">
          {companies.map((company) => (
            <CardCompany
              key={company.id}
              companyId={company.id?.toString() || ""}
              companyName={company.name || ""}
              companyEmail={company.email || ""}
              urlCompany={company.logo || ''}
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyList;
