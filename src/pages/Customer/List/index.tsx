import { PDFDownloadLink } from "@react-pdf/renderer";
import { Modal } from "flowbite-react";
import React, { FC, useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { BiUserPlus } from "react-icons/bi";
import { BsBuilding, BsPrinterFill } from "react-icons/bs";
import { FaEye, FaTrash } from "react-icons/fa";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { TbArrowsRightLeft } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../atoms/Loader";
import Customer from "../../../Model/Customer";
import Storage from "../../../service/Storage";
import UserService from "../../../service/UserService";
import CustomerPrint from "../../../templates/CustomerPrint";
import DashboardLayout from "../../../templates/DashboardLayout";
import { http_client } from "../../../utils/axios-custum";
import { formatDate } from "../../../utils/function";

type TypeCustomerList = {};

const GET_CUSTOMER_URL = "/customers";
const DELETE_CUSTOMER_COMPANY_URL = "customers";

const CustomerList: FC<TypeCustomerList> = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Customer[]>([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentIdComapany, setCurrentIdCompany] = useState<string | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const filteredItems = users.filter(
    (item) =>
      (item.firstname &&
        item.firstname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.lastname &&
        item.lastname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.city &&
        item.city.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.address &&
        item.address.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.tel &&
        item.tel.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.email &&
        item.email.toLowerCase().includes(filterText.toLowerCase()))
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
            autoFocus
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

  const onClick = (id: string) => {
    setCurrentIdCompany(id);
    setShowModal(!showModal);
  };

  const confirmDelete = () => {
    setShowModal(false);

    setDeleting(true);
    // delete user company
    http_client(Storage.getStorage("auth").token)
      .delete(`${DELETE_CUSTOMER_COMPANY_URL}/${currentIdComapany}`)
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

  const onClose = () => {
    setShowModal(false);
  };

  const columns: TableColumn<Customer>[] = [
    {
      name: (
        <span className="  font-bold text-xs text-[#ac3265] uppercase">
          Nom
        </span>
      ),
      cell: (row) => (
        <span className="font-bold">
          {row.firstname} {row.lastname}
        </span>
      ),
      sortable: true,
    },
    {
      name: (
        <span className="  font-bold text-xs text-[#ac3265] uppercase">
          Téléphone
        </span>
      ),
      cell: (row) => <span className="">{row.tel || "Aucun"}</span>,
      sortable: true,
    },
    {
      name: (
        <span className="  font-bold text-xs text-[#ac3265] uppercase">
          Total commande
        </span>
      ),
      cell: (row) => <span>{row.orders?.length || '0'} Commande{(row.orders?.length || 0) > 1 && 's'}</span>,
      sortable: true,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          Date de création
        </span>
      ),
      selector: (row) => formatDate(row.created_at || ""),
    },
    {
      name: "",
      cell: (row) => (
        <h1 className=" flex -translate-x-3 items-center justify-center">
          <Link
            to={`/customers/create/${row.id}`}
            className="font-medium disabled text-xs ml-1 flex-none  text-green-500 p-1 bg-green-100 rounded-full inline-block dark:text-green-500 hover:underline"
          >
            Liste des commandes
          </Link>
          <Link
            to={`/customers/create/${row.id}`}
            className="font-medium ml-2 text-base flex-none text-blue-500 p-2 bg-blue-100 rounded-full inline-block dark:text-blue-500 hover:underline"
          >
            <FaEye />
          </Link>
          <button
            onClick={(_) => onClick(row.id || "1")}
            className="font-medium ml-2 text-red-500 flex-none w-8 h-8 justify-center items-center  bg-red-100 rounded-full inline-flex dark:text-red-500 hover:underline"
          >
            <FaTrash />
          </button>
        </h1>
      ),
    },
  ];

  useEffect(() => {
    const fetUsers = async () => {
      const res = await http_client(Storage.getStorage("auth").token).get(
        GET_CUSTOMER_URL
      );
      setUsers(res.data.data);
      setLoading(false);
    };
    fetUsers();
  }, [navigate]);

  return (
    <DashboardLayout
      titleClass="w-[24%]"
      title="Gestion des clients"
      headerContent={
        <>
          <div className="ml-4 w-[74%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            <span>
              | <span className="ml-2">Liste</span>
            </span>{" "}
            <div className="flex items-center justify-end">
              <Link
                to="/my/company/view"
                className={`flex ${
                  UserService.getUser().role === "ENTREPRISE" &&
                  !UserService.getUser().as_company &&
                  "disabled"
                }  justify-start text-sm border-4 border-[#7e3151] items-center space-x-2 rounded px-2 py-1 text-white bg-[#ac3265] w-auto ml-3`}
              >
                <BsBuilding className="mr-2" /> Voir mon entreprise{" "}
              </Link>
              <Link
                to="/customers/create/new"
                className={`flex ${
                  UserService.getUser().role === "ENTREPRISE" &&
                  !UserService.getUser().as_company &&
                  "disabled"
                }  justify-start text-sm border-4 border-gray-700 items-center space-x-2 rounded px-2 py-1 text-white bg-gray-700 hover:bg-gray-800 transition w-auto ml-3`}
              >
                Crée un nouveau client <BiUserPlus className="ml-2 text-lg" />
              </Link>
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
                Voulez vous vraiment supprimer le client ?
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
        <div className="flex space-x-4 font-bold items-center">
          <PDFDownloadLink document={<CustomerPrint customers={users} />} fileName="liste-des-clients.pdf" className='text-sm text-white px-4 rounded-md bg-gray-700 py-2'> <BsPrinterFill size={16} className='inline-block mr-1' /> 
            Imprimer la liste des clients
          </PDFDownloadLink >
        </div>
      </div>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <>
            <DataTable
              className=" rounded-md overflow-hidden"
              title="Clients"
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

export default CustomerList;
