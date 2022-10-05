import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'


const RequireAuth = () => {
  const auth = useSelector((state:any) => state.auth)
  const location = useLocation()

  return  (auth.user && auth.token) ? <Outlet /> : <Navigate to='/login' state={{ from: location }} replace />
}

export default RequireAuth