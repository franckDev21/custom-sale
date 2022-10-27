import { Modal } from 'flowbite-react'
import React, { useState, FormEvent, useEffect, ChangeEvent } from 'react'
import { GiMoneyStack } from 'react-icons/gi'
import { BsPrinterFill } from 'react-icons/bs'
import { FaMinus, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Loader from '../../atoms/Loader'
import Cash from '../../Model/Cash'
import TotalCash from '../../Model/TotalCash'
import Storage from '../../service/Storage'
import DashboardLayout from '../../templates/DashboardLayout'
import { http_client } from '../../utils/axios-custum'
import { formatCurrency } from '../../utils/function'

type TypeCashier = {}

type TypeInputForm = {
  quantite ?: string|number,
  prix_achat ?: string|number,
}

type TypeOutputForm = {
  quantite ?: string|number,
  type ?: string,
  motif ?: string|number,
}


const GET_CASHIERS_URL = 'cashiers'
const GET_TOTALCASH_URL = 'cashiers/total'

const Cashier: React.FC<TypeCashier> = () => {

  const [loading, setLoading] = useState(true);
  const [cashiers, setCashiers] = useState<Cash[]>([]);
  const [totalCash, setTotalCash] = useState<TotalCash>({});
  const [showInputModal, setShowInputModal] = useState(false);
  const [showOutputModal, setShowOutputModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sending2, setSending2] = useState(false);
  const [modalType, setModalType] = useState('INPUT');
  const [dataInputForm,setDataInputForm] = useState<TypeInputForm>({})
  const [dataOutputForm,setDataOutputForm] = useState<TypeOutputForm>({
    type : 'CONTENEUR'
  })


  const onClose = () => {
    if(modalType === 'INPUT'){
      setShowInputModal(false);
    }else{
      setShowOutputModal(false)
    }
  };

  const onClick = (mode='INPUT') => {
    if(mode === 'INPUT'){
      setShowInputModal(!showInputModal);
    }else{
      setShowOutputModal(!showOutputModal);
    }
  };

  const handleOnchange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    if(modalType === 'INPUT'){
      switch (e.target.name) {
        case 'quantite':
          setDataInputForm({...dataInputForm,quantite : e.target.value})
          break;
        case 'prix_achat':
          setDataInputForm({...dataInputForm,prix_achat : e.target.value})
          break;
      }
    }else{
      switch (e.target.name) {
        case 'quantite':
          setDataOutputForm({...dataOutputForm,quantite : e.target.value})
          break;
        case 'type':
          setDataOutputForm({...dataOutputForm,type : e.target.value})
          break;
        case 'motif':
          setDataOutputForm({...dataOutputForm,motif : e.target.value})
          break;
      }
    }
  }

  const confirmAddOutput = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending2(true)
    
  }

  const confirmAddInput = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
   
  }

  useEffect(() => { 
    Promise.all([
      http_client(Storage.getStorage("auth").token).get(`${GET_CASHIERS_URL}`),
      http_client(Storage.getStorage("auth").token).get(`${GET_TOTALCASH_URL}`)
    ]).then(res => {
        setCashiers(res[0].data);
        setTotalCash(res[1].data)
        setLoading(false);
    }).catch(err => {
      setLoading(false)
      console.log(err);
    })
  },[])

  return (
    <DashboardLayout
      title='Cashier'
      headerContent={
        <>
          <div className="ml-4 w-[90%] font-bold text-2xl text-[#ac3265] flex items-center justify-end">
            <div className='flex justify-between space-x-2 '>
              <Link to='/orders/print' className='text-sm text-white px-4 rounded-md bg-gray-700 py-2'> <BsPrinterFill size={16} className='inline-block  mr-1' />Print the list of cashiers</Link>
              <button onClick={_ => {
                    onClick('OUTPUT')
                    setModalType('OUTPUT')
                  }} className='text-sm text-white px-4 rounded-md bg-red-400 py-2'> <FaMinus size={16} className='inline-block  mr-1' />Add an output</button>
                  <button onClick={_ => {
                    onClick('INPUT')
                    setModalType('INPUT')
                  }} className='text-sm text-white px-4 rounded-md bg-green-700 py-2'> <FaPlus size={16} className='inline-block mr-1' />Add an entry</button>
            </div> 
          </div>
        </>
      }
    >
      {/* modal add an output */}
      <React.Fragment>
          <Modal
            show={showOutputModal || sending2}
            size="xl"
            popup={true}
            onClose={onClose}
          >
            <Modal.Header />
            <Modal.Body>
              <form onSubmit={confirmAddOutput} className="text-left">
                <h3 className="mb-5 font-bold text-lg pb-3 border-b text-[#ac3265] dark:text-gray-400">
                  Add output for the product
                </h3>
                <div className="flex flex-col space-y-4 mt-4 mb-6">
                  <div>
                    <label htmlFor="quantite" className="inline-block mb-2 font-semibold text-gray-700">Quantity</label>
                    <input name="quantite" onChange={handleOnchange} value={dataOutputForm.quantite || ''} required autoFocus type="number" id="quantite" placeholder="Quantity of supply" min={0} className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' />
                  </div>
                    <div>
                      <label htmlFor="price" className="inline-block mb-2 font-semibold text-gray-700">Output type  </label>
                     
                    </div>
                  
                  <div>
                    <label htmlFor="motif" className="inline-block mb-2 font-semibold text-gray-700">Your reason</label>
                    <textarea name="motif" onChange={handleOnchange} value={dataOutputForm.motif || ''} required id="quantite" placeholder="Enter your reason" className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' rows={6}></textarea>
                  </div>
                </div>
                <div className="flex justify-center space-x-3">
                  <button
                    color="failure"
                    className={`bg-green-500 ${sending2 && 'disabled'} hover:bg-green-700 transition text-white rounded-md px-3 font-semibold uppercase py-2 w-1/2 inline-block`}
                  >
                    {sending2 ? (
                      <Loader className="flex justify-center text-lg items-center" />
                    ) : (
                      "Confirm output"
                    )}
                  </button>
                  <button
                    color="gray"
                    onClick={onClose}
                    className="bg-gray-500 hover:bg-gray-700 transition text-white rounded-md px-3 font-semibold uppercase py-2 w-1/2 inline-block"
                  >
                    No, cancel
                  </button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        </React.Fragment>
        {/* modal add an entry */}
        <React.Fragment>
          <Modal
            show={showInputModal || sending}
            size="xl"
            popup={true}
            onClose={onClose}
          >
            <Modal.Header />
            <Modal.Body>
              <form onSubmit={confirmAddInput} className="text-left">
                <h3 className="mb-5 font-bold text-lg pb-3 border-b text-[#ac3265] dark:text-gray-400">
                  Add a supply for this product
                </h3>
                <div className="flex flex-col space-y-4 mt-4 mb-6">
                  <div>
                    <label htmlFor="quantite" className="inline-block mb-2 font-semibold text-gray-700">Quantity <span className=" italic text-sm font-light "></span></label>
                    <input name="quantite" onChange={handleOnchange} value={dataInputForm.quantite || ''} required autoFocus type="number" id="quantite" placeholder="Quantity of supply" min={0} className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' />
                  </div>
                  <div>
                    <label htmlFor="price" className="inline-block mb-2 font-semibold text-gray-700">Purchase price  </label>
                    <input name="prix_achat" onChange={handleOnchange} value={dataInputForm.prix_achat || ''} required type="number" id="price" placeholder="price (FCFA)" min={0} className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' />
                  </div>
                </div>
                <div className="flex justify-center space-x-3">
                  <button
                    color="failure"
                    className={`bg-green-500 ${sending && 'disabled'} hover:bg-green-700 transition text-white rounded-md px-3 font-semibold uppercase py-2 w-1/2 inline-block`}
                  >
                    {sending ? (
                      <Loader className="flex justify-center text-lg items-center" />
                    ) : (
                      "Confirm registration"
                    )}
                  </button>
                  <button
                    color="gray"
                    onClick={onClose}
                    className="bg-gray-500 hover:bg-gray-700 transition text-white rounded-md px-3 font-semibold uppercase py-2 w-1/2 inline-block"
                  >
                    No, cancel
                  </button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        </React.Fragment>


        {loading ? 
          <div className="h-[400px] flex justify-center items-center text-8xl text-[#5c3652]">
          <Loader />
          </div>:
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <span
              className="py-4 mb-2 rounded-2xl overflow-hidden px-8 border-slate-200 border-8  text-5xl font-bold text-gray-500 bg-slate-50 inline-block">
              <GiMoneyStack className=' inline-block' /> Total : <span
                className="text-primary">{formatCurrency(parseInt(totalCash.montant?.toString() || '0',10),'XAF')}</span>
              </span>

              
          </div>
        }


    </DashboardLayout>
  )
}

export default Cashier