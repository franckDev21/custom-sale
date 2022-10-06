import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Storage from '../../service/Storage'


const RequireAuth = () => {
  const auth = useSelector((state:any) => state.auth)
  const location = useLocation()
  let authStorage = Storage.getStorage('auth')

  return  ((auth.user && auth.token) || (authStorage && (authStorage.token && authStorage.user )) ) ? <Outlet /> : <Navigate to='/login' state={{ from: location }} replace />
}

export default RequireAuth