import { PDFViewer } from '@react-pdf/renderer';
import React from 'react'
import MyDocument from '../../../templates/MyDocument';

export const ComponentToPrint = React.forwardRef((props, ref:any) => {
  return (
    <div ref={ref}>
      <MyDocument className='w-full' />
    </div>
  );
});
