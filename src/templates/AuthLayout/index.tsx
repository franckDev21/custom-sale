import React from 'react'
import { useSelector } from 'react-redux';
import { Outlet} from 'react-router-dom';

type AuthLayoutType = {}

const AuthLayout: React.FC<AuthLayoutType> = () => {

  const auth = useSelector((state :any) => state.auth)
  console.log(auth)

  return (
    <main>
      <Outlet />
    </main>
  )
}

export default AuthLayout