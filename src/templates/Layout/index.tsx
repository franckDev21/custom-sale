import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet} from 'react-router-dom';
// import Header from '../../molecules/Header/Header';

type Layout = {}

const AuthLayout: React.FC<Layout> = () => {

  const auth = useSelector((state :any) => state.auth)
  console.log(auth)

  return <>
    <Outlet />
  </>
}

export default AuthLayout