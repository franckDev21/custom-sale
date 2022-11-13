import React from "react";
import { BsBuilding } from "react-icons/bs";
import { HiUserGroup } from "react-icons/hi";
import CardCompany from "../../../molecules/CardCompany";
import DashboardLayout from "../../../templates/DashboardLayout";

type CompanyListProps = {};

const CompanyList: React.FC<CompanyListProps> = () => {
  return (
    <DashboardLayout
      title="Liste de mes entreprises"
      headerContent={
        <div className="font-bold text-2xl text-[#ac3265] flex items-center justify-between">
          <div className="flex items-center justify-end">
            <button className="flex text-lg cursor-default  justify-start border-4 items-center space-x-2 rounded px-2 py-1 text-gray-700 bg-gray-50 w-auto ml-3">
              <BsBuilding /> <span className="pl-1"> 17 Entreprise(s)</span>
            </button>
            <button className="flex text-lg cursor-default  justify-start border-4 items-center space-x-2 rounded px-2 py-1 text-gray-700 bg-gray-50 w-auto ml-3">
              <HiUserGroup /> <span className="pl-1"> 34 Utilisateur(s)</span>
            </button>
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-3 p-4">
          {([1, 2, 3, 4, 5] as any[]).map((n) => (
            <CardCompany
              key={n}
              companyId={n}
              companyName="Superco - douala"
              companyEmail="www.superco@gmail.com"
            />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CompanyList;
