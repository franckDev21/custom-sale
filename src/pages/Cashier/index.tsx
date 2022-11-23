import { Modal } from 'flowbite-react'
import React, { useState, FormEvent, useEffect, ChangeEvent } from 'react'
import { GiMoneyStack } from 'react-icons/gi'
import { BsPrinterFill } from 'react-icons/bs'
import { FaEye, FaMinus, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import Loader from '../../atoms/Loader'
import Cash from '../../Model/Cash'
import TotalCash from '../../Model/TotalCash'
import Storage from '../../service/Storage'
import DashboardLayout from '../../templates/DashboardLayout'
import { http_client } from '../../utils/axios-custum'
import { formatCurrency, formatDate } from '../../utils/function'
import DataTable, { TableColumn } from 'react-data-table-component'
import { AiOutlineToTop, AiOutlineVerticalAlignBottom } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { resolve } from 'path'
import { PDFDownloadLink } from '@react-pdf/renderer'
import CashierPrint from '../../templates/CashierPrint'
import UserService from '../../service/UserService'
import { useSelector } from 'react-redux'

type TypeCashier = {}

type TypeForm = {
  montant ?: string|number,
  motif ?: string|number,
}


const GET_CASHIERS_URL = 'cashiers'
const GET_TOTALCASH_URL = 'cashiers/total'
const CREATE_INTPUT_URL = 'cashiers';
const CREATE_OUTPUT_URL = 'cashiers/output';

const Cashier: React.FC<TypeCashier> = () => {

  const [loading, setLoading] = useState(true);
  const [cashiers, setCashiers] = useState<Cash[]>([]);
  const [totalCash, setTotalCash] = useState<TotalCash>({});
  const [filterText, setFilterText] = useState("");
  const [showInputModal, setShowInputModal] = useState(false);
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showOutputModal, setShowOutputModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sending2, setSending2] = useState(false);
  const [modalType, setModalType] = useState('INPUT');
  const [dataInputForm,setDataInputForm] = useState<TypeForm>({})
  const [dataOutputForm,setDataOutputForm] = useState<TypeForm>({})
  const [errorMessage,setErrorMessage] = useState('')

  const companiesStore = useSelector((state: any) => state.companies); 

  const filteredItems = cashiers.filter(
    (item) =>
      (item.motif &&
        item.motif.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item.type &&
        item.type.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item.montant &&
        item.montant.toString().toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.created_at &&
        item.created_at.toLowerCase().includes(filterText.toLowerCase())) 
  );

  const subHeaderComponentMemo = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    return (
      <>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            autoFocus
            onChange={(e) => setFilterText(e.target.value)}
            type="text"
            id="table-search"
            className="bg-gray-100 border border-none focus:ring-2 text-gray-900 text-xs rounded-lg focus:ring-gray-700 focuslue-500 block w-80 pl-10 p-3 focus:bg-white  dark:bg-gray-700 dark:border-gray-600 ring-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-700 "
            placeholder="Search your product"
          />
          <span className=" absolute" onClick={handleClear}>
            x
          </span>
        </div>
      </>
    );
  }, [filterText, resetPaginationToggle]);

  const columns: TableColumn<Cash>[] = [
    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Date d'ajout</span>,
      cell: (row) => <span className="">
        {formatDate(row.created_at || "")|| "Aucun"}
      </span>,
      sortable: true,
    },
    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">montant</span>,
      cell: (row) => <div className='flex justify-start items-start flex-col py-3'>
        <p className=' text-base font-bold'>
          {formatCurrency(parseInt(row.montant?.toString() || '0',10),'XAF')}
        </p>
      </div>,
      sortable: true,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          Type
        </span>
      ),
      selector: (row) => `${row.type}` || '',
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          utilisateur
        </span>
      ),
      selector: (row) => `${row.user?.firstname} ${row.user?.lastname}` || '',
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          motif
        </span>
      ),
      selector: (row) => `${row.motif}` || '',
    },
    
    {
      name: "",
      cell: (row) => (
        <h1 className=" flex items-center justify-center">

          {row.order_id && <Link
            to={`/orders/show/${row.order?.id}/${(Date.now())}`}
            className="font-medium ml-1 text-base text-blue-500 p-2 bg-blue-100 rounded-md inline-block dark:text-blue-500 hover:underline"
          >
            <FaEye />
          </Link>}
        </h1>
      ),
    },
  ];

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
        case 'montant':
          setDataInputForm({...dataInputForm,montant : e.target.value})
          break;
        case 'motif':
          setDataInputForm({...dataInputForm,motif : e.target.value})
          break;
      }
    }else{
      switch (e.target.name) {
        case 'montant':
          setDataOutputForm({...dataOutputForm,montant : e.target.value})
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
    
    http_client(Storage.getStorage("auth").token).post(companiesStore.currentCompany ? `${CREATE_OUTPUT_URL}?id=${companiesStore.currentCompany.id}`:`${CREATE_OUTPUT_URL}`,dataOutputForm)
      .then(res => {
        setSending2(false)
        if(res.data.message){
          reloadData().then((res2:any) => {
            toast.success(res.data.message)
            setShowOutputModal(false)
            setDataOutputForm({})
          })
        }else{
          setShowOutputModal(false)
          toast.error(res.data.error)
        }
      })
      .catch(err => {
        setSending2(false)
        setErrorMessage(err.response?.data?.message || err.message)
        toast.error(err.response?.data?.message || err.message)
      })
  }

  const confirmAddInput = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMessage('')

    setSending(true)
    http_client(Storage.getStorage("auth").token).post(companiesStore.currentCompany? `${CREATE_INTPUT_URL}?id=${companiesStore.currentCompany.id}`:`${CREATE_INTPUT_URL}`,dataInputForm)
      .then(res => {
        reloadData().then((res2:any) => {
          setSending(false)
          setShowInputModal(false)
          setDataInputForm({})
          toast.success(res.data.message)
        })
      })
      .catch(err => {
        setSending(false)
        setShowInputModal(false)
        setErrorMessage(err.response?.data?.message || err.message)
      })
  }

  const reloadData = async () => {
    return new Promise((resolve,reject) => {
      Promise.all([
        http_client(Storage.getStorage("auth").token).get(companiesStore.currentCompany ? `${GET_CASHIERS_URL}?id=${companiesStore.currentCompany.id}`:`${GET_CASHIERS_URL}`),
        http_client(Storage.getStorage("auth").token).get(companiesStore.currentCompany ? `${GET_TOTALCASH_URL}?id=${companiesStore.currentCompany.id}`:`${GET_TOTALCASH_URL}`)
        ]).then(res => {
            setCashiers(res[0].data);
            setTotalCash(res[1].data)
            setLoading(false);
            resolve(true)
        }).catch(err => {
          setLoading(false)
          console.log(err);
          resolve(true)
        })

    })
  }

  useEffect(() => { 
    Promise.all([
      http_client(Storage.getStorage("auth").token).get(companiesStore.currentCompany ? `${GET_CASHIERS_URL}?id=${companiesStore.currentCompany.id}`:`${GET_CASHIERS_URL}`),
      http_client(Storage.getStorage("auth").token).get(companiesStore.currentCompany ? `${GET_TOTALCASH_URL}?id=${companiesStore.currentCompany.id}`:`${GET_TOTALCASH_URL}`)
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
      title='Caisse'
      headerContent={
        <>
          <div className="ml-4 w-[90%] font-bold text-2xl text-[#ac3265] flex items-center justify-end">
          {(UserService.getUser().company_id || companiesStore.currentCompany)&& 
            <div className='flex justify-between space-x-2 '>
              <PDFDownloadLink document={<CashierPrint companyId={companiesStore.currentCompany.id || undefined} cashiers={cashiers} total={totalCash.montant} />} fileName="caisse.pdf" className='text-sm text-white px-4 rounded-md bg-gray-700 py-2'> <BsPrinterFill size={16} className='inline-block mr-1' /> 
                Imprimer l'état de la caisse
              </PDFDownloadLink >
              <button onClick={_ => {
                    onClick('OUTPUT')
                    setModalType('OUTPUT')
                  }} className='text-sm text-white px-4 rounded-md bg-red-400 py-2'> <FaMinus size={16} className='inline-block  mr-1' />Ajouter une nouvelle sortie</button>
                  <button onClick={_ => {
                    onClick('INPUT')
                    setModalType('INPUT')
                  }} className='text-sm text-white px-4 rounded-md bg-green-700 py-2'> <FaPlus size={16} className='inline-block mr-1' />Ajouter une nouvelle entrée</button>
            </div> 
            }
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
                  Ajouter une sortie en caisse <AiOutlineToTop className=' inline-block ml-2 text-3xl' />
                </h3>
                <div className="flex flex-col space-y-4 mt-4 mb-6">
                  <div>
                    <label htmlFor="quantite" className="inline-block mb-2 font-semibold text-gray-700">Votre montant</label>
                    <input name="montant" onChange={handleOnchange} value={dataOutputForm.montant || ''} required autoFocus type="number" id="quantite" placeholder="Entrer montant du retrait " min={0} className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' />
                  </div>
                  
                  <div>
                    <label htmlFor="motif" className="inline-block mb-2 font-semibold text-gray-700">Your reason</label>
                    <textarea name="motif" onChange={handleOnchange} value={dataOutputForm.motif || ''} required id="quantite" placeholder="Entrer la raison de votre retrait" className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' rows={6}></textarea>
                  </div>
                </div>
                <div className="flex justify-center space-x-3">
                  <button
                    color="failure"
                    className={`bg-green-500 text-sm ${sending2 && 'disabled'} hover:bg-green-700 transition text-white rounded-md px-3 font-semibold uppercase py-2 w-1/2 inline-block`}
                  >
                    {sending2 ? (
                      <Loader className="flex justify-center text-lg items-center" />
                    ) : (
                      "Confirmer la sortie"
                    )}
                  </button>
                  <button
                    color="gray"
                    onClick={onClose}
                    className="bg-gray-500 text-sm  hover:bg-gray-700 transition text-white rounded-md px-3 font-semibold uppercase py-2 w-1/2 inline-block"
                  >
                    Non, annuler
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
                Ajouter une entrée en caisse <AiOutlineVerticalAlignBottom className=' inline-block ml-2 text-3xl' />
                </h3>
                <div className="flex flex-col space-y-4 mt-4 mb-6">
                  <div>
                    <label htmlFor="quantite" className="inline-block mb-2 font-semibold text-gray-700">Votre montant <span className=" italic text-sm font-light "></span></label>
                    <input name="montant" onChange={handleOnchange} value={dataInputForm.montant || ''} required autoFocus type="number" id="quantite" placeholder="montant" min={0} className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' />
                  </div>

                  <div>
                    <label htmlFor="motif" className="inline-block mb-2 font-semibold text-gray-700">votre raison</label>
                    <textarea name="motif" onChange={handleOnchange} value={dataInputForm.motif || ''} required id="reason" placeholder="Entrer la raison de l’ajout" className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' rows={6}></textarea>
                  </div>
                </div>
                <div className="flex justify-center space-x-3">
                  <button
                    color="failure"
                    className={`bg-green-500 text-sm ${sending && 'disabled'} hover:bg-green-700 transition text-white rounded-md px-3 font-semibold uppercase py-2 w-1/2 inline-block`}
                  >
                    {sending ? (
                      <Loader className="flex justify-center text-lg items-center" />
                    ) : (
                      "Confirmer l'enregistrement "
                    )}
                  </button>
                  <button
                    color="gray"
                    onClick={onClose}
                    className="bg-gray-500 text-sm hover:bg-gray-700 transition text-white rounded-md px-3 font-semibold uppercase py-2 w-1/2 inline-block"
                  >
                    Non, annuler
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

            <DataTable
              className=" rounded-md overflow-hidden"
              title="Cashiers"
              pagination
              columns={columns}
              data={filteredItems}
              paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
              responsive
            />

          </div>
        }


    </DashboardLayout>
  )
}

export default Cashier