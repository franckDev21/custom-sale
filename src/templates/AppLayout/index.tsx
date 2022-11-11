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

  // useEffect(() => )

  return <>
    {children}
  </>
}

export default AppLayout