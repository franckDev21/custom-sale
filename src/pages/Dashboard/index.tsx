import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../templates/DashboardLayout'
import { HiUserGroup } from 'react-icons/hi'
import User from '../../Model/User'
import UserService from '../../service/UserService'

type TypeDashboard = {}

const Dashboard: React.FC<TypeDashboard> = () => {

  // if the component is destroyed, we delete the local Storage => we disconnect it

  const [user,setUser] = useState<User>({})

  useEffect(() => {
    setUser(UserService.getUser())
  },[])

  return (
  <DashboardLayout title='Dashboard' headerContent={
    <>
      <div className="ml-4 font-bold text-2xl text-[#5c3652]"> | Welcome <span className='uppercase'>{user.firstname} {user.lastname}</span></div>
    </>
  }>

    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="min-h-[24rem]  rounded-lg border-4 border-dashed border-gray-300">
          <div className="grid grid-cols-4 gap-4 p-4">
          <div className="bg-white cursor-pointer hover:shadow-lg transition p-4 rounded-md flex justify-start items-start">
            <span className='inline-block overflow-hidden'><HiUserGroup className='text-5xl text-[#603d57]' /></span>
            <div className='ml-2'>
              <h1 className='text-2xl font-bold text-gray-600 pb-1 border-b-2'>45 Users</h1>
              <h2 className='text-sm font-bold text-[#603d57]'>Management of the users</h2>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>

  </DashboardLayout>
  )
}

export default Dashboard