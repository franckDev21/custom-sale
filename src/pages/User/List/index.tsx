import React, { useState, useEffect } from "react";
import User from "../../../Model/User";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { http_client } from "../../../utils/axios-custum";

import DataTable, { TableColumn } from "react-data-table-component";
import Loader from "../../../atoms/Loader";
import { extraiText, formatDate } from "../../../utils/function";
import { FaTrash } from "react-icons/fa";
import { MdOutgoingMail } from "react-icons/md";

import "./List.scss";

type TypeUserList = {};

const GET_USERS_URL = "/users";

const UserList: React.FC<TypeUserList> = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const filteredItems = users.filter(
    (item) =>
      (item.company?.name &&
        item.company.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.firstname &&
        item.firstname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.lastname &&
        item.lastname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.email &&
        item.email.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.company?.email &&
        item.company.email.toLowerCase().includes(filterText.toLowerCase()))
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            onChange={(e) => setFilterText(e.target.value)}
            type="text"
            id="table-search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focuslue-500 block w-80 pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focuslue-500"
            placeholder="Search htmlFor items"
          />
          <span className=" absolute" onClick={handleClear}>
            x
          </span>
        </div>
      </>
    );
  }, [filterText, resetPaginationToggle]);

  useEffect(() => {
    const fetUsers = async () => {
      const res = await http_client(Storage.getStorage("auth").token).get(
        GET_USERS_URL
      );
      setUsers(res.data.data);
      setLoading(false);
    };
    fetUsers();
  }, []);

  const columns: TableColumn<User>[] = [
    {
      name: <span className=" text-gray-500 text-sm uppercase">Name</span>,
      selector: (row) => row.company?.name || "",
      sortable: true,
    },
    {
      name: <span className=" text-gray-500 text-sm uppercase">Email</span>,
      selector: (row) => row.email || "",
      sortable: true,
    },
    {
      name: (
        <span className=" text-gray-500 text-sm uppercase">Country city</span>
      ),
      cell: (row) => (
        <h1 className="py-4">
          <span className="font-semibold inline-block pb-1">
            {row.company?.country || ""}
          </span>{" "}
          <br /> {row.company?.city || ""}
        </h1>
      ),
      sortable: true,
    },
    {
      name: <span className=" text-gray-500 text-sm uppercase">User </span>,
      cell: (row) => (
        <h1 className="flex flex-col min-w-[200px]">
          <span className="font-medium text-gray-900 inline-block pb-1">
            {row.firstname} {row.lastname}
          </span>
          <span>{extraiText(row.email || "")}</span>
        </h1>
      ),
    },
    {
      name: (
        <span className="text-gray-500 text-sm uppercase translate-x-5">
          State
        </span>
      ),
      cell: (row) => (
        <h1 className="pl-3 translate-x-4">
          <span className="w-14 cursor-pointer rounded-full flex justify-end items-center h-6 bg-green-200 py-1.5 px-0.5">
            <span className="w-5 h-5 bg-white shadow rounded-full"></span>
          </span>
        </h1>
      ),
    },
    {
      name: "Created at",
      selector: (row) => formatDate(row.created_at || ""),
    },
    {
      name: "",
      cell: (row) => (
        <h1>
          <a
            href="/"
            className="font-medium ml-2 text-base text-blue-500 p-2 bg-blue-100 rounded-full inline-block dark:text-blue-500 hover:underline"
          >
            <MdOutgoingMail />
          </a>
          <a
            href="/"
            className="font-medium ml-2 text-red-500 p-2 bg-red-100 rounded-full inline-block dark:text-red-500 hover:underline"
          >
            <FaTrash />
          </a>
        </h1>
      ),
    },
  ];

  return (
    <DashboardLayout
      title="Users"
      headerContent={
        <>
          <div className="ml-4 w-[80%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            | List of users
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <>
            <DataTable
              className=" rounded-md overflow-hidden"
              title="Companies"
              pagination
              columns={columns}
              data={filteredItems}
              paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
              responsive
            />
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

export default UserList;
