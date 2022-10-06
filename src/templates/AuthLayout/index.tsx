import React, { FC } from 'react'
import Header from '../../molecules/Header/Header'

type TypeAuthLayout = {
  children : React.ReactNode
}

const AuthLayout: FC<TypeAuthLayout> = ({ children }) => {
  return <>
    <Header />
    {children}
  </>
}

export default AuthLayout