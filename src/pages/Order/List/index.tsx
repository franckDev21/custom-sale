import React, { useState, useEffect } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { BiPencil } from 'react-icons/bi'
import { BsPrinterFill } from 'react-icons/bs'
import { FaEye, FaShoppingCart, FaTrash } from 'react-icons/fa'
import { HiRefresh } from 'react-icons/hi'
import { ImSearch } from 'react-icons/im'
import { Link } from 'react-router-dom'
import Loader from '../../../atoms/Loader'
import Order from '../../../Model/Order'
import Storage from '../../../service/Storage'
import DashboardLayout from '../../../templates/DashboardLayout'
import { http_client } from '../../../utils/axios-custum'
import { formatCurrency, formatDate } from '../../../utils/function'

const GET_ORDER_URL = '/orders'

const OrderList = () => {

  const [loading, setLoading] = useState(true);
  const [orders,setOrders] = useState<Order[]>([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentIdComapany, setCurrentIdCompany] = useState<string | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const filteredItems = orders.filter(
    (item) =>
      (item.reference &&
        item.reference.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.created_at &&
        item.created_at.toLowerCase().includes(filterText.toLowerCase())) || 
      (item.quantite &&
        item.quantite.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item.customer?.lastname &&
        item.customer.lastname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.customer?.firstname &&
        item.customer.firstname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.user?.firstname &&
        item.user.firstname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.user?.lastname &&
        item.user.lastname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.cout &&
        item.cout.toString().toLowerCase().includes(filterText.toLowerCase()))
  );

  const onClick = (id: string) => {
    setCurrentIdCompany(id);
    setShowModal(!showModal);
  };


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
            placeholder="Search your product"
          />
          <span className=" absolute" onClick={handleClear}>
            x
          </span>
        </div>
      </>
    );
  }, [filterText, resetPaginationToggle]);

  const columns: TableColumn<Order>[] = [

    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Référence</span>,
      cell: (row) => <div className="font-bold flex space-y-1 flex-col justify-start items-start"># {row.reference}</div>,
      sortable: true,
    },
    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Date de création</span>,
      cell: (row) => <span className="">
        {formatDate(row.created_at || "")|| "Aucun"}
      </span>,
      sortable: true,
    },
    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Quantité</span>,
      cell: (row) => <span>{row.quantite}</span>,
      sortable: true,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          Coût
        </span>
      ),
      cell: (row) =>  <span className='font-semibold'>{formatCurrency(parseInt(row.cout?.toString() || '0',10) || 0,'XAF')}</span>,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          état
        </span>
      ),
      selector: (row) => row.etat || '',
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          Customer
        </span>
      ),
      selector: (row) => `${row.customer?.firstname} ${row.customer?.lastname}` || '',
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          Autor
        </span>
      ),
      selector: (row) => `${row.user?.firstname} ${row.user?.lastname}` || '',
    },
    {
      name: "",
      cell: (row) => (
        <h1 className=" flex items-center justify-center">
          <Link
            to={`/products/show/${row.id}/${row.reference?.toString().split(' ').join('-').toLowerCase()}`}
            className="font-medium ml-1 text-base text-blue-500 p-2 bg-blue-100 rounded-md inline-block dark:text-blue-500 hover:underline"
          >
            <FaEye />
          </Link>
          <Link
            to={`/products/edit`}
            className="font-medium ml-1 text-base text-gray-700 p-2 bg-gray-200 rounded-md inline-block dark:text-gray-500 hover:underline"
          >
            <BiPencil />
          </Link>
          <button
            onClick={(_) => onClick(row.id || "1")}
            className="font-medium ml-1 text-red-500 w-8 h-8 justify-center items-center  bg-red-100 rounded-md inline-flex dark:text-red-500 hover:underline"
          >
            <FaTrash />
          </button>
        </h1>
      ),
    },
  ];

  useEffect(() => {
    const fetOrders = async () => {
      const res = await http_client(Storage.getStorage("auth").token).get(
        GET_ORDER_URL
      );
      setOrders(res.data);
      setLoading(false);
    };
    fetOrders();
  },[])
  
  return (
    <DashboardLayout
      title='Order management'
      headerContent={
        <>
          <div className="ml-4 w-[74%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
          <span>| List of orders</span>{" "}
            <form className='flex justify-between space-x-2 w-[60%]'>
              <div className='relative w-[90%]'>
                <ImSearch className='absolute top-1/2 -translate-y-1/2 right-4 opacity-80' size={20} />
                <input type="text" className='px-4 pr-10 bg-gray-100 border-none outline-none w-full ring-0 focus:ring-0 rounded-md' placeholder='Search for your product ..'  />
              </div>
              <button className='px-4 py-2 rounded-md bg-[#ac3265] text-white text-sm'>Search</button>
            </form>
          </div>
        </>
      }
    >

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 font-bold items-center">
          <Link to='/orders/print' className='text-sm text-white px-4 rounded-md bg-gray-700 py-2'> <BsPrinterFill size={16} className='inline-block  mr-1' />Print the list of orders</Link>
          <Link to='/orders/create' className='text-sm text-white px-4 rounded-md bg-green-700 py-2'> <FaShoppingCart size={16} className='inline-block mr-1' />  Add a new order</Link>
          <Link to='/approvisionnement' className='text-sm text-[#ac3265] px-4 rounded-md bg-white py-2'> <HiRefresh size={20} /></Link>
        </div>
      </div>


      {/* table */}
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <>
            <DataTable
              className=" rounded-md overflow-hidden"
              title="Products"
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
  )
}

export default OrderList