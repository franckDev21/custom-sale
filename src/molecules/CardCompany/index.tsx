import React from "react";
import { Link } from "react-router-dom";

type CardCompanyProps = {
  companyId: string;
  companyName: string;
  companyEmail: string;
};

const CardCompany: React.FC<CardCompanyProps> = ({
  companyId,
  companyName,
  companyEmail,
}) => {
  return (
    <div className="p-5 rounded-md bg-white shadow">
      <div className="space-x-3 flex items-start">
        <div className="w-14 h-14 bg-gray-200 flex-none text-gray-500 rounded-full font-bold flex items-center text-sm justify-center">
          LOGO
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-600">{companyName}</h1>
          <h2 className="text-gray-400 text-sm">{companyEmail}</h2>
        </div>
      </div>

      <div className="mt-3">
        <Link
          to={`company/${companyId}/view`}
          className="px-2 uppercase py-1.5 rounded-md bg-primary text-white text-xs"
        >
          voir la boutique
        </Link>
      </div>
    </div>
  );
};

export default CardCompany;
