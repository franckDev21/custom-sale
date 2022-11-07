import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../templates/DashboardLayout'
import { HiCurrencyDollar } from 'react-icons/hi'
import User from '../../Model/User'
import UserService from '../../service/UserService'
import { FaBoxOpen, FaUserAlt, FaUsers } from 'react-icons/fa'
import { BsShop } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { TbArrowsRightLeft } from 'react-icons/tb'
import { http_client } from '../../utils/axios-custum'
import Storage from '../../service/Storage'
import { formatCurrency } from '../../utils/function'

type TypeDashboard = {}

type TotalDashboardProps = {
  totalUser ?: string|number,
  totalCash ?: string|number,
  totalProduct ?: string|number,
  totalCustomer ?: string|number,
  totalOrder ?: string|number,
}

const DASHBOARD_URL = '/dashboard';

const Dashboard: React.FC<TypeDashboard> = () => {

  // if the component is destroyed, we delete the local Storage => we disconnect it

  const [user,setUser] = useState<User>({})
  const [dashboardInfo,setDashboardInfo] = useState<TotalDashboardProps>({
    totalCash : 0,
    totalCustomer : 0,
    totalProduct : 0,
    totalUser : 0,
    totalOrder : 0
  })

  useEffect(() => {
    setUser(UserService.getUser())

    http_client(Storage.getStorage("auth").token).get(DASHBOARD_URL)
      .then(res => {
        setDashboardInfo(res.data)
      })
      .catch(err => {
        console.log(err);
      })
  },[])

  return (
  <DashboardLayout title='Tableau de bord' headerContent={
    <>
      <div className="ml-4 font-bold text-2xl text-[#5c3652]"> | Bienvenue <span className='uppercase'>{user.firstname} {user.lastname}</span></div>
    </>
  }>
    <div className="mx-auto max-w-7xl pt-4 sm:px-6 lg:px-8">
      <div className="flex space-x-4 font-bold items-center">
        {UserService.getUser().role !== 'SUPER' && <Link to='/products/history/all' className='text-sm text-white px-4 rounded-md bg-yellow-400 py-2'> <TbArrowsRightLeft size={16} className='inline-block  mr-1' /> Historiques des entrées sorties produits</Link>}
        {UserService.getUser().role !== 'SUPER' && <Link to='/products/procurements' className='text-sm text-white px-4 rounded-md bg-cyan-700 py-2'> <TbArrowsRightLeft size={16} className='inline-block rotate-90 mr-1' />Historique des approvisionnements</Link>}
      </div>
    </div>

    <div className="mx-auto max-w-7xl pb-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="min-h-[24rem]  rounded-lg border-4 border-dashed border-gray-300">
          <div className="grid grid-cols-3 gap-3 p-4">
          
          <Link to='/users' className="bg-white cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start">
            <span className='inline-block overflow-hidden'><FaUserAlt className='text-4xl text-[#603d57]' /></span>
            <div className='ml-3'>
              <h1 className='text-2xl font-bold text-gray-600 pb-1 border-b-2'>{dashboardInfo.totalUser} Utilisateur(s)</h1>
              <h2 className='text-sm font-bold text-[#603d57]'>Gestion des utilisateurs</h2>
            </div>
          </Link>

          <Link to='/cashiers' className={`bg-white ${UserService.getUser().role === 'SUPER' && 'disabled'} cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start`}>
            <span className='inline-block overflow-hidden'><HiCurrencyDollar className='text-5xl text-[#603d57]' /></span>
            <div className='ml-3'>
              <h1 className='text-2xl font-bold text-gray-600 pb-1 border-b-2'>{formatCurrency(parseInt(dashboardInfo.totalCash?.toString() || '0',10),'XAF')}</h1>
              <h2 className='text-sm font-bold text-[#603d57]'>Gestion de la caisse</h2>
            </div>
          </Link>

          <Link to='/products' className={`bg-white ${UserService.getUser().role === 'SUPER' && 'disabled'} cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start`}>
            <span className='inline-block overflow-hidden'><FaBoxOpen className='text-5xl text-[#603d57]' /></span>
            <div className='ml-3'>
              <h1 className='text-2xl font-bold text-gray-600 pb-1 border-b-2'>{dashboardInfo.totalProduct} produits(s)</h1>
              <h2 className='text-sm font-bold text-[#603d57]'>Gestion des produits</h2>
            </div>
          </Link>

          <Link to='/customers' className={`bg-white ${UserService.getUser().role === 'SUPER' && 'disabled'} cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start`}>
            <span className='inline-block overflow-hidden'><FaUsers className='text-5xl text-[#603d57]' /></span>
            <div className='ml-3'>
              <h1 className='text-2xl font-bold text-gray-600 pb-1 border-b-2'>{dashboardInfo.totalCustomer} Client(s)</h1>
              <h2 className='text-sm font-bold text-[#603d57]'>Gestion des clients</h2>
            </div>
          </Link>

          <Link to='/orders' className={`bg-white ${UserService.getUser().role === 'SUPER' && 'disabled'} cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start`}>
            <span className='inline-block overflow-hidden'><BsShop className='text-5xl text-[#603d57]' /></span>
            <div className='ml-3 mr-2'>
              <h1 className='text-2xl font-bold text-gray-600 pb-1 border-b-2'>{dashboardInfo.totalOrder} Commande(s)</h1>
              <h2 className='text-sm font-bold text-[#603d57]'>Gestion des commandes</h2>
            </div>
          </Link>

          </div>
        </div>
      </div>
    </div>

  </DashboardLayout>
  )
}

export default Dashboard