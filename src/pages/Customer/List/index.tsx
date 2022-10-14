import React, { FC, useEffect, useState } from 'react'
import { BiUserPlus } from 'react-icons/bi'
import { BsBuilding } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'
import Customer from '../../../Model/Customer'
import Storage from '../../../service/Storage'
import UserService from '../../../service/UserService'
import DashboardLayout from '../../../templates/DashboardLayout'
import { http_client } from '../../../utils/axios-custum'

type TypeCustomerList = {}

const GET_CUSTOMER_URL = '/customers'

const CustomerList:FC<TypeCustomerList> = () => {

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<Customer[]>([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentIdComapany, setCurrentIdCompany] = useState<string | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [activations, setActivations] = useState(false);

  const navigate = useNavigate();

  const filteredItems = users.filter(
    (item) =>
      (item.firstname &&
        item.firstname.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.lastname &&
        item.lastname
          .toLowerCase()
          .includes(filterText.toLowerCase())) ||
      (item?.city &&
        item.city.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.address &&
        item.address.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.tel &&
        item.tel.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.email &&
        item.email.toLowerCase().includes(filterText.toLowerCase()))
  );



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
      titleClass="w-[30%]"
      title='Customer management'
      headerContent={
        <>
          <div className="ml-4 w-[68%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            <span>|  <span className='ml-2'>List</span></span>{" "}
            <div className="flex items-center justify-end">
              <Link to='/my/company/view' className={`flex ${(UserService.getUser().role === 'ENTREPRISE' && !UserService.getUser().as_company) && 'disabled'}  justify-start text-sm border-4 border-[#7e3151] items-center space-x-2 rounded px-2 py-1 text-white bg-[#ac3265] w-auto ml-3`}><BsBuilding className="mr-2" />  see my company </Link>
              <Link to='/customers/create' className={`flex ${(UserService.getUser().role === 'ENTREPRISE' && !UserService.getUser().as_company) && 'disabled'}  justify-start text-sm border-4 border-gray-700 items-center space-x-2 rounded px-2 py-1 text-white bg-gray-700 hover:bg-gray-800 transition w-auto ml-3`}>Create a new customer <BiUserPlus className="ml-2 text-lg" /></Link>
            </div>
          </div>
        </>
      }
    >

    </DashboardLayout>
  )
}

export default CustomerList