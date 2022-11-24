import React, { useState } from "react";
import { Link } from "react-router-dom";
import { baseURL } from "../../utils/axios-custum";

type CardCompanyProps = {
  companyId: string;
  companyName: string;
  companyEmail: string;
  companyActive?: boolean;
  editing?: boolean;
  onActive?: () => void;
  activation?: boolean;
  urlCompany?: string;
};

const API_STORAGE_URL = `${baseURL}/storage`;

const CardCompany: React.FC<CardCompanyProps> = ({
  urlCompany,
  companyId,
  companyName,
  companyEmail,
  companyActive = false,
  editing = false,
  onActive = () => {},
  activation = false,
}) => {
  const toggleActive = () => {
    onActive();
  };

  return (
    <div
      className={`p-5 rounded-md bg-white shadow ${activation && "disabled"}`}
    >
      <div className="space-x-3 flex items-start relative">
        {editing && (
          <span
            onClick={(_) => toggleActive()}
            className={`w-14 ${
              activation && "disabled"
            } cursor-pointer rounded-full flex items-center h-6 absolute right-0 -top-2 ${
              companyActive
                ? "bg-green-200 justify-end"
                : "bg-red-200 justify-start"
            }  py-1.5 px-0.5`}
          >
            <span className="w-5 h-5 bg-white shadow rounded-full"></span>
          </span>
        )}
        {!editing && <span className={` absolute -top-2 text-xs px-1 py-0.5 right-0 ${companyActive ? ' text-green-500 bg-green-100':'text-red-400 bg-red-100'}`}>{companyActive ? 'Activé':'Non activé'}</span>}
        <div className="w-14 h-14 bg-gray-200 flex-none text-gray-500 overflow-hidden relative rounded-full font-bold flex items-center text-sm justify-center">
          {urlCompany ? (
            <img src={`${API_STORAGE_URL}/${urlCompany}`} className=' absolute w-full h-full object-cover' alt="logo" />
          ) : (
            "LOGO"
          )}
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-600">{companyName}</h1>
          <h2 className="text-gray-400 text-sm">{companyEmail}</h2>
        </div>
      </div>

      {!editing && (
        <div className="mt-3 space-x-2">
          <Link
            to={`${companyId}/view`}
            className="px-2 uppercase py-1.5 rounded-md bg-primary text-white text-xs"
          >
            voir la boutique
          </Link>

         {companyActive && <Link
            to={`/companies/${companyId}/dashoard`}
            className="px-2 uppercase py-1.5 rounded-md bg-gray-700 text-white text-xs"
          >
            Dashboard
          </Link>}
        </div>
      )}
    </div>
  );
};

export default CardCompany;
