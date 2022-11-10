import React, { FC, useEffect } from 'react'
import Storage from '../../service/Storage'

type TypeAppLayout = {
  children : React.ReactNode
}

const AppLayout: FC<TypeAppLayout> = ({ children }) => {
  
  useEffect(() => { 
    return () => {
      Storage.removeStorage('auth')
  	};
  },[])

  return <>
    {children}
  </>
}

export default AppLayout