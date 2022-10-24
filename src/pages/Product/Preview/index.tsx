import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import DashboardLayout from '../../../templates/DashboardLayout'
import { ComponentToPrint } from '../ComponentToPrint'

const ProductPreview = () => {

  const componentRef = useRef(null);

  return (
    <DashboardLayout 
      title='Print product list'
    >
      
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      />
      <ComponentToPrint ref={componentRef} />
      

    </DashboardLayout>
  )
}

export default ProductPreview