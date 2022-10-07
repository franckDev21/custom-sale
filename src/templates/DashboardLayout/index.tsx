import React from 'react'
import HeaderDashboard from '../../molecules/HeaderDashboard'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type TypeDashboardLayout = {
  children ?: React.ReactNode,
  title ?: string,
  headerContent ?: React.ReactNode,
  titleClass ?: string
}

const DashboardLayout: React.FC<TypeDashboardLayout> = ({ children= <></>, title='', headerContent=<></>, titleClass='' }) => {
  return (
    <div className="min-h-screen bg-gray-200">
      <HeaderDashboard />

      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8 flex justify-start items-center">
          <h1 className={`${titleClass} text-3xl font-bold tracking-tight text-gray-900`}>{title}</h1>
          {headerContent && headerContent}
        </div>
      </header>

      <main>
        {children}
      </main>

      <ToastContainer />
    </div>
  )
}

export default DashboardLayout