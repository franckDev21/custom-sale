import React, { FC, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TbArrowsRightLeft } from 'react-icons/tb'
import DashboardLayout from '../../../templates/DashboardLayout'
import { ImSearch } from 'react-icons/im'
import { BsPrinterFill } from 'react-icons/bs'
import { FaBoxOpen } from 'react-icons/fa'
import { HiRefresh } from 'react-icons/hi'
import Product from '../../../Model/Product'
import { http_client } from '../../../utils/axios-custum'
import Storage from '../../../service/Storage'
import { toast } from 'react-toastify'

type TypeProducList = {}

const GET_PRODUCT_URL = '/products'
const DELETE_CUSTOMER_COMPANY_URL = "products";


const ProducList:FC<TypeProducList> = () => {

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentIdComapany, setCurrentIdCompany] = useState<string | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  const filteredItems = products.filter(
    (item) =>
      (item.name &&
        item.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.created_at &&
        item.created_at.toLowerCase().includes(filterText.toLowerCase()))
  );

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
    let usersFilter = products.filter((product) => product.id !== id);
    setProducts(usersFilter);
  };

  const onClose = () => {
    setShowModal(false);
  };


  useEffect(() => {
    const fetUsers = async () => {
      const res = await http_client(Storage.getStorage("auth").token).get(
        GET_PRODUCT_URL
      );
      setProducts(res.data);
      setLoading(false);
    };
    fetUsers();
  }, [navigate]);

  return (
    <DashboardLayout
      title='Product management'
      headerContent={
        <>
          <div className="ml-4 w-[68%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            <Link to='/approvisionnement' className='text-sm text-white px-4 rounded-md bg-cyan-700 py-2'> <TbArrowsRightLeft size={16} className='inline-block rotate-90 mr-1' /> Procurement history</Link>
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
        <Link to='/approvisionnement' className='text-sm text-white px-4 rounded-md bg-yellow-400 py-2'> <TbArrowsRightLeft size={16} className='inline-block  mr-1' /> History of entries</Link>
        <Link to='/approvisionnement' className='text-sm text-white px-4 rounded-md bg-gray-700 py-2'> <BsPrinterFill size={16} className='inline-block mr-1' /> Print the list of products</Link>
        <Link to='/approvisionnement' className='text-sm text-white px-4 rounded-md bg-green-700 py-2'> <FaBoxOpen size={16} className='inline-block mr-1' /> Add new product</Link>
        <Link to='/approvisionnement' className='text-sm text-[#ac3265] px-4 rounded-md bg-white py-2'> <HiRefresh size={20} /></Link>
        </div>
      </div>

      {/* table */}

    </DashboardLayout>
  )
}

export default ProducList