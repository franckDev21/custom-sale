import React, { useState, useEffect } from 'react'
import { FaFileInvoiceDollar } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import Loader from '../../../atoms/Loader'
import Order from '../../../Model/Order'
import Storage from '../../../service/Storage'
import DashboardLayout from '../../../templates/DashboardLayout'
import { baseURL, http_client } from '../../../utils/axios-custum'
import DefautProductImage from '../../../assets/img/default-product.png';
import OrderProduct from '../../../Model/OrderProduct'
import { formatCurrency } from '../../../utils/function'
import { PDFDownloadLink } from '@react-pdf/renderer'
import FactureDocument from '../../../templates/FactureDocument'
import { BsPrinterFill } from 'react-icons/bs'
import Invoice from '../../../Model/Invoice'

const GET_ORDER_URL = 'orders';
const API_STORAGE_URL = `${baseURL}/storage`;
const CREATE_INVOICE_URL = 'invoices'
// orders/{order}/facture

const OrderShow = () => {

  const [loading, setLoading] = useState(true);
  const [order,setOrder] = useState<Order>({})
  const [orderProducts,setOrderProducts] = useState<OrderProduct[]>([])
  const [invoice,setInvoice] = useState<Invoice>({})

  const { reference,id } = useParams()

  const invoices = async () => {
    const res = await http_client(Storage.getStorage("auth").token).post(`${CREATE_INVOICE_URL}/${id}`)
    console.log(res.data);
    
  }

  useEffect(() => {
    const fetOrders = async () => {
      const res = await Promise.all([
        http_client(Storage.getStorage("auth").token).get(`${GET_ORDER_URL}/${id}`),
        http_client(Storage.getStorage("auth").token).get(`${GET_ORDER_URL}/${id}/invoice`)
      ]);
      setOrder(res[0].data.order);
      setOrderProducts(res[0].data.products);

      setInvoice(res[1].data.data)
      setLoading(false);
    };
    fetOrders();
  },[id])

  return (
    <DashboardLayout
      title='Gestion des commandes'
      headerContent={
        <>
          <div className="ml-4 w-[68%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
          <span>| order #{reference} | {order.customer?.firstname} {order.customer?.lastname}</span>{" "}
            <div className='flex justify-between space-x-2 '>
              <Link to='/invoices' className='px-4 py-2 rounded-md bg-slate-500 hover:bg-slate-700 transition text-white text-sm flex items-center'><FaFileInvoiceDollar className='mr-2' />Liste de toute les factures</Link>
            </div> 
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? <>
          <div className="p-4 bg-white rounded-md">
            <header className='flex justify-between items-center py-4 border-b w-full mb-2'>
              <div className='text-2xl font-bold text-gray-600'>Total prix :  <span className='text-primary'> {formatCurrency(parseInt(order.cout?.toString() || '0') || 0,'XAF')}</span></div>
              <div className="flex text-xs space-x-4">
                <PDFDownloadLink onClick={invoices} document={<FactureDocument invoice={invoice} order={order} orderProducts={orderProducts} />} fileName="facture.pdf" className='px-4 py-2 bg-green-500 hover:bg-green-600 font-bold transition text-white rounded-md'> <BsPrinterFill size={16} className='inline-block mr-1' /> 
                  Imprimer la facture du client
                </PDFDownloadLink >
                {/* <button className='px-4 py-2 bg-primary opacity-80 hover:opacity-100 transition font-bold text-white rounded-md' >INVOICE THE CUSTOMER</button> */}
              </div>
            </header>

            <div className="py-3 border-b">
              <span className='text-2xl font-bold text-gray-600'>Liste de tous les produits de la commande</span>

              <div className='grid grid-cols-3 gap-4'>
                {orderProducts?.map(item => (
                  <div className="mt-3 flex" key={item.id}>
                    {item.product?.image ? 
                    <div className="w-28 h-40 overflow-hidden relative">
                      <img width="100" className=" absolute object-cover h-auto w-full"  src={`${API_STORAGE_URL}/${item.product?.image}`} alt="" />
                    </div>
                    :<img width="100" src={DefautProductImage} alt='produit' /> 
                    }
                    <div className="ml-3">
                      <h2 className="text-xl font-bold underline "><Link to={`/products/show/${item.product?.id}/${item.product?.name?.split(' ').join('-').toLowerCase()}`}>{item.product?.name}</Link></h2>
                      <h2 className="text-lg">Prix unitaire : <span className={`text-primary font-bold ${(item.prix_de_vente || '0').toString() !== (item.product?.prix_unitaire || '0').toString()  ? 'line-through':''}`}>{ formatCurrency(parseInt(item.product?.prix_unitaire?.toString() || '0') || 0,'XAF') }</span></h2>
                      <h2 className="text-lg">Type vente : <span className="px-4 py-0.5 bg-orange-100 text-orange-400 text-sm">{item.type_de_vente}</span></h2>
                      {(item.prix_de_vente || '0').toString() !== (item.product?.prix_unitaire || '0').toString() && (
                         <h2 className="text-lg">Prix unitaire de vente : <span className="text-primary font-bold">{ formatCurrency(parseInt(item.prix_de_vente || '0') || 0,'XAF') }</span></h2>
                      )}
                      <h2 className="text-base text-gray-600 font-bold">Quantité commander : { item.qte } </h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>:
          <div className="h-[400px] flex justify-center items-center text-8xl text-[#5c3652]">
            <Loader />
          </div>
        }
      </div>
    </DashboardLayout>
  )
}

export default OrderShow