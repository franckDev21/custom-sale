import React from 'react'
import DashboardLayout from '../../../templates/DashboardLayout'

type TypeCreateUser = {}

const CreateUser:React.FC<TypeCreateUser> = () => {
  return (
    <DashboardLayout
      title='User management'
      headerContent={
        <>
          <div className="ml-4 w-[70%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
           <span>| add a new user</span> 
          </div>
        </>
      }
    >


    </DashboardLayout>
  )
}

export default CreateUser