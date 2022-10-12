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
import { BsBuilding } from 'react-icons/bs';

import "./List.scss";
import { Modal } from "flowbite-react";
import { HiEye, HiOutlineExclamationCircle } from "react-icons/hi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import UserService from "../../../service/UserService";
import { BiUserPlus } from "react-icons/bi";

type TypeMyUserList = {};

const GET_USERS_URL = "users";
const DELETE_USERS_COMPANY_URL = "users/companies";
const TOGGLE_ACTIVE_USERS_COMPANY_URL = "users/companies/toggle-active";

const MyUserList: React.FC<TypeMyUserList> = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentIdComapany, setCurrentIdCompany] = useState<string | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [activations, setActivations] = useState(false);

  const filteredItems = users.filter(
    (item) =>
      (item.company?.name &&
        item.company.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.company?.country &&
        item.company.country
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (item.company?.city &&
        item.company.city.toLowerCase().includes(filterText.toLowerCase())) ||
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
            className="bg-gray-100 border border-none focus:ring-2 text-gray-900 text-xs rounded-lg focus:ring-gray-700 focuslue-500 block w-80 pl-10 p-3 focus:bg-white  dark:bg-gray-700 dark:border-gray-600 ring-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-700 "
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
      name: (
        <span className="  font-bold text-xs text-[#ac3265] uppercase">Photo</span>
      ),
      cell: (row) => (
        <h1 className="py-4 w-5 h-5 bg-gray-400">
          
        </h1>
      ),
      sortable: true,
    },
    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Name</span>,
      cell: (row) => <span className="font-bold">
        {row.firstname} {row.lastname}
      </span>,
      sortable: true,
    },
    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Email</span>,
      selector: (row) => row.email || "",
      sortable: true,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase translate-x-5">
          State
        </span>
      ),
      cell: (row) => (
        <h1 className="pl-3 translate-x-4">
          <span
            onClick={(_) => toggleActive(row.id || "1")}
            className={`w-14 ${
              activations && "disabled"
            } cursor-pointer rounded-full flex items-center h-6 ${
              row.active
                ? "bg-green-200 justify-end"
                : "bg-red-200 justify-start"
            }  py-1.5 px-0.5`}
          >
            <span className="w-5 h-5 bg-white shadow rounded-full"></span>
          </span>
        </h1>
      ),
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase translate-x-5">
          Created at
        </span>
      ),
      selector: (row) => formatDate(row.created_at || ""),
    },
    {
      name: "",
      cell: (row) => (
        <h1 className=" flex items-center justify-center">
          <a
            href="/"
            className="font-medium ml-2 text-base text-blue-500 p-2 bg-blue-100 rounded-full inline-block dark:text-blue-500 hover:underline"
          >
            <MdOutgoingMail />
          </a>
          <button
            onClick={(_) => onClick(row.id || "1")}
            className="font-medium ml-2 text-red-500 w-8 h-8 justify-center items-center  bg-red-100 rounded-full inline-flex dark:text-red-500 hover:underline"
          >
            <FaTrash />
          </button>
        </h1>
      ),
    },
  ];

  const onClick = (id: string) => {
    setCurrentIdCompany(id);
    setShowModal(!showModal);
  };

  const confirmDelete = () => {
    setShowModal(false);

    setDeleting(true);
    // delete user company
    http_client(Storage.getStorage("auth").token)
      .delete(`${DELETE_USERS_COMPANY_URL}/${currentIdComapany}`)
      .then((res) => {
        setDeleting(false);
        deleteUser(currentIdComapany || "1");
        toast.success(res.data.message);
      })
      .catch((err: any) => {
        setDeleting(false);
        console.log(err);
      });
  };

  const deleteUser = (id: string) => {
    let usersFilter = users.filter((user) => user.id !== id);
    setUsers(usersFilter);
  };

  const updateActive = (id: string) => {
    let userFind = users.find((user) => user.id === id);
    let usersFilter = users.filter((user) => user.id !== id);
    let newUser: User = {
      ...userFind,
      active: userFind?.active ? false : true,
    };
    let newUsersTab = [...usersFilter, newUser];
    console.log(newUsersTab);

    setUsers(newUsersTab);
  };

  const toggleActive = (id: string) => {
    setActivations(true);
    http_client(Storage.getStorage("auth").token)
      .post(`${TOGGLE_ACTIVE_USERS_COMPANY_URL}/${id}`)
      .then((res) => {
        setActivations(false);
        updateActive(id || "1");
        toast.success(res.data.message);
      })
      .catch((err: any) => {
        setActivations(false);
        console.log(err);
      });
  };

  const onClose = () => {
    setShowModal(false);
  };

  return (
    <DashboardLayout
      titleClass="w-[11%]"
      title="My users"
      headerContent={
        <>
          <div className="ml-4 w-[88%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
           <span>| List of users</span> 
            <div className="flex items-center justify-end">
              <Link to='/my/company/view' className={`flex ${(UserService.getUser().role === 'ENTREPRISE' && !UserService.getUser().as_company) && 'disabled'}  justify-start text-sm border-4 border-[#7e3151] items-center space-x-2 rounded px-2 py-1 text-white bg-[#ac3265] w-auto ml-3`}><BsBuilding className="mr-2" />  see my company </Link>
              <Link to='/users/create' className={`flex ${(UserService.getUser().role === 'ENTREPRISE' && !UserService.getUser().as_company) && 'disabled'}  justify-start text-sm border-4 border-gray-700 items-center space-x-2 rounded px-2 py-1 text-white bg-gray-700 hover:bg-gray-800 transition w-auto ml-3`}>Create a new user <BiUserPlus className="ml-2 text-lg" /></Link>
            </div>
           
          </div>
        </>
      }
    >
      <React.Fragment>
        <Modal
          show={showModal || deleting}
          size="md"
          popup={true}
          onClose={onClose}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 " />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this company ?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  color="failure"
                  className="bg-red-500 text-white rounded-md px-4 py-2"
                  onClick={confirmDelete}
                >
                  {deleting ? (
                    <Loader className="flex justify-center items-center" />
                  ) : (
                    "Yes, I'm sure"
                  )}
                </button>
                <button
                  color="gray"
                  onClick={onClose}
                  className="bg-gray-500 text-white rounded-md px-4 py-2"
                >
                  No, cancel
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <>
            <DataTable
              className=" rounded-md overflow-hidden"
              title="Users"
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

export default MyUserList;
