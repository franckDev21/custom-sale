import React, { FC, useEffect, useState, ChangeEvent, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TbArrowsRightLeft } from 'react-icons/tb'
import DashboardLayout from '../../../templates/DashboardLayout'
import { ImSearch } from 'react-icons/im'
import { BsPrinterFill } from 'react-icons/bs'
import { FaBoxOpen, FaEye, FaTrash } from 'react-icons/fa'
import { HiOutlineExclamationCircle, HiRefresh } from 'react-icons/hi'
import Product from '../../../Model/Product'
import axiosCustum, { baseURL, http_client } from '../../../utils/axios-custum'
import Storage from '../../../service/Storage'
import { toast } from 'react-toastify'
import DataTable, { TableColumn } from 'react-data-table-component'
import { formatDate, formatCurrency } from '../../../utils/function'
import { Modal } from 'flowbite-react'
import Loader from '../../../atoms/Loader'
import { BiPencil } from 'react-icons/bi'
import { PDFDownloadLink } from '@react-pdf/renderer';

import DefautProductImage from '../../../assets/img/default-product.png';
import ProductPrint from '../../../templates/ProductPrint'
import { AiOutlineVerticalAlignBottom } from 'react-icons/ai'
import UserService from '../../../service/UserService'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { useSelector } from 'react-redux'

type TypeProducList = {}

const GET_PRODUCT_URL = '/products'
const API_STORAGE_URL = `${baseURL}/storage`;
const DELETE_PRODUCT_URL = 'product'
// const BASE64_URL = 'base64'
const IMPORT_PRODUCT_URL = '/import/product'

const ProducList:FC<TypeProducList> = () => {

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentIdComapany, setCurrentIdCompany] = useState<string | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [exporting,setExporting] = useState(false);
  const navigate = useNavigate()

  const companiesStore = useSelector((state: any) => state.companies);

  const formExcelRef = useRef(null)

  const filteredItems = products.filter(
    (item) =>
      (item.name &&
        item.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item?.created_at &&
        item.created_at.toLowerCase().includes(filterText.toLowerCase())) || 
      (item.product_supplier?.name &&
        item.product_supplier.name.toLowerCase().includes(filterText.toLowerCase())) ||
      (item.category?.name &&
        item.category.name.toLowerCase().includes(filterText.toLowerCase()))
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

  const columns: TableColumn<Product>[] = [

    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Name</span>,
      cell: (row) => <div className="font-bold flex space-y-1 flex-col justify-start items-start">
        <div className=' relative flex justify-center items-center'>
          {row.image ? <img width={70} height={70} src={`${API_STORAGE_URL}/${row.image}`} alt='productimage' />:<img width={70} height={70} src={DefautProductImage} className='opacity-50' alt='default-product' />}
        </div>
        <span>{row.name} </span>
      </div>,
      sortable: true,
    },
    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Date</span>,
      cell: (row) => <span className="">
        {formatDate(row.created_at || "")|| "Aucun"}
      </span>,
      sortable: true,
    },
    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Quantité</span>,
      cell: (row) => <span>{row.qte_en_stock} {row.type_approvisionnement}{(row.qte_en_stock || 0) > 1 && 's'} 
      {row.product_type?.name === 'VENDU_PAR_NOMBRE_PAR_CONTENEUR' && ` de ${row.nbre_par_carton} et ${row.unite_restante || 0} Unité${(row.unite_restante || 0) > 1 ? 's':''} restante`} 
      {row.product_type?.name === 'VENDU_PAR_LITRE' && ` de ${row.qte_en_litre} ${row.product_type.unite_de_mesure} et ${row.unite_restante || 0} Unité${(row.unite_restante || 0) > 1 ? 's':''} restante`} 
      {row.product_type?.name === 'VENDU_PAR_KG' && ` de ${row.poids} ${row.product_type.unite_de_mesure} et ${row.unite_restante || 0} Unité${(row.unite_restante || 0) > 1 ? 's':''} restante`} 
      </span>,
      sortable: true,
    },
    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Encore en stock</span>,
      cell: (row) => <div>{row.is_stock ? <span className='px-1 inline-block text-xs py-1 text-green-600 bg-green-100 rounded-full'>Oui, en stock</span>:<span className='px-1 inline-block text-xs py-1 text-red-500 bg-red-100 rounded-full'>Non stock écoulé</span>}</div>,
      sortable: true,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          Prix unitaire
        </span>
      ),
      cell: (row) =>  <span className='font-semibold'>{formatCurrency(parseInt(row.prix_unitaire?.toString() || '0',10) || 0,'XAF')}</span>,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          Fournisseur
        </span>
      ),
      selector: (row) => row.product_supplier?.name || '',
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          Categorie
        </span>
      ),
      selector: (row) => row.category?.name || '',
    },
    {
      name: "",
      cell: (row) => (
        <h1 className=" flex items-center justify-center">
          <Link
            title={`View ${row.name}`}
            to={`/products/show/${row.id}/${row.name?.split(' ').join('-').toLowerCase()}`}
            className="font-medium ml-1 text-base text-blue-500 p-2 bg-blue-100 rounded-md inline-block dark:text-blue-500 hover:underline"
          >
            <FaEye />
          </Link>
          <Link
            title={`Edit ${row.name}`}
            to={`/products/edit/${row.id}/${row.name?.split(' ').join('-').toLowerCase()}`}
            className="font-medium ml-1 text-base text-gray-700 p-2 bg-gray-200 rounded-md inline-block dark:text-gray-500 hover:underline"
          >
            <BiPencil />
          </Link>
          <button
            onClick={(_) => onClick(row.id || "1")}
            className="font-medium ml-1 text-red-500 w-8 h-8 justify-center items-center  bg-red-100 rounded-md inline-flex dark:text-red-500 hover:underline"
          >
            <FaTrash />
          </button>
        </h1>
      ),
    },
  ];

  const onClick = (id: string) => {
    setCurrentIdCompany(id);
    setShowModal(!showModal);
  };

  const confirmDelete = () => {
    setShowModal(false);

    setDeleting(true);
    // delete user company
    http_client(Storage.getStorage("auth").token)
      .delete(`${DELETE_PRODUCT_URL}/${currentIdComapany}`)
      .then((res) => {
        setDeleting(false);
        deleteProduct(currentIdComapany || "1");
        toast.success(res.data.message);
      })
      .catch((err: any) => {
        setDeleting(false);
        console.log(err);
      });
  };
  
  const deleteProduct = (id: string) => {
    let usersFilter = products.filter((product) => product.id !== id);
    setProducts(usersFilter);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const download = () => {
    // let id = window.setTimeout(() => {
    //   navigate('/products/preview/list')
    //   clearTimeout(id)
    // },3000)
  }

  const uploadCsv = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      return;
    }

    // setExporting(true)
    const formData = new FormData(formExcelRef.current || undefined)
    
    http_client(Storage.getStorage("auth").token).post(IMPORT_PRODUCT_URL,formData)
      .then(res => {
        console.log(res.data);
        if(res.data.message){
          reload().then(res => {
            setExporting(false)
          })
          toast.success(res.data.message)
        }
      })
      .catch(err => {
        setExporting(false)
        console.log(err);
        toast.error("Votre liste de produit n’as pas pu être enregistrer ! (Erreur de formatage ou un utilisateur existe déjà) !")
      })

  }

  const reload = () => {
    return new Promise((resolve,reject) => {
      const fetUsers = async () => {
        const res = await http_client(Storage.getStorage("auth").token).get(
          companiesStore.currentCompany ? `${GET_PRODUCT_URL}?id=${companiesStore.currentCompany.id}`:GET_PRODUCT_URL
        );
        resolve(true)
        setProducts(res.data);
      };
      fetUsers();
    })
  }

  useEffect(() => {
    const fetUsers = async () => {
      const res = await http_client(Storage.getStorage("auth").token).get(
        companiesStore.currentCompany ? `${GET_PRODUCT_URL}?id=${companiesStore.currentCompany.id}`:GET_PRODUCT_URL
      );
      setProducts(res.data);
      setLoading(false);
    };
    fetUsers();
  }, []);

  return (
    <DashboardLayout
      title='Gestion des produits'
      headerContent={
        <>
          <div className="ml-4 w-[68%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            <Link to='/products/procurements' className='text-sm text-white px-4 rounded-md bg-cyan-700 py-2'> <TbArrowsRightLeft size={16} className='inline-block rotate-90 mr-1' /> Historique d'approvisionnement </Link>
            <form className='flex justify-between space-x-2 w-[60%]'>
              <div className='relative w-[90%]'>
                <ImSearch className='absolute top-1/2 -translate-y-1/2 right-4 opacity-80' size={20} />
                <input type="text" className='px-4 pr-10 bg-gray-100 border-none outline-none w-full ring-0 focus:ring-0 rounded-md' placeholder='Search for your product ..'  />
              </div>
              <button className='px-4 py-2 rounded-md bg-[#ac3265] text-white text-sm'>Search</button>
            </form>
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 font-bold items-center">
          {UserService.getUser().role !== 'SUPER' && <Link to='/products/history/all' className='text-sm text-white px-4 rounded-md bg-yellow-400 py-2'> <TbArrowsRightLeft size={16} className='inline-block  mr-1' />Historique des entrées sorties</Link>}
          <PDFDownloadLink onClick={download} document={<ProductPrint companyId={companiesStore.currentCompany.id || undefined} products={products} />} fileName="liste-des-produits.pdf" className='text-sm text-white px-4 rounded-md bg-gray-700 py-2'> <BsPrinterFill size={16} className='inline-block mr-1' /> 
            Imprimer la liste des produits 
          </PDFDownloadLink >
          {(UserService.getUser().company_id || companiesStore.currentCompany) && <Link to='/products/create' className='text-sm text-white px-4 rounded-md bg-green-700 py-2'> <FaBoxOpen size={16} className='inline-block mr-1' /> Ajouter un nouveau produit</Link>}
          <label htmlFor='image' className={`${exporting && 'disabled'} flex items-center text-sm cursor-pointer text-white px-4 rounded-md bg-blue-700 py-2`}>
            
            {exporting ? <Loader className='inline-block text-2xl' />:
              <>
                <AiOutlineVerticalAlignBottom size={16} className='inline-block mr-1' /> Importer
              </>
            }

            <RiFileExcel2Fill className='ml-2' />

            <form ref={formExcelRef} className='inline-block'>
              <input onChange={uploadCsv} id='image' type="file" name="file" hidden className='hidden' />
            </form>
          </label>
          <Link to='/products' className='text-sm text-[#ac3265] px-4 rounded-md bg-white py-2'> <HiRefresh size={20} /></Link>
        </div>
        {/* <img src="data:image/jpeg;base64," alt='' /> */}
      </div>

      <React.Fragment>
        <Modal
          show={showModal || deleting}
          size="md"
          popup={true}
          onClose={onClose}
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 " />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Voulez-vous vraiment supprimer ce produit ?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  color="failure"
                  className="bg-red-500 text-white rounded-md px-4 py-2"
                  onClick={confirmDelete}
                >
                  {deleting ? (
                    <Loader className="flex justify-center items-center" />
                  ) : (
                    "Oui, supprimer"
                  )}
                </button>
                <button
                  color="gray"
                  onClick={onClose}
                  className="bg-gray-500 text-white rounded-md px-4 py-2"
                >
                  Non, annuler
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>

      {/* table */}
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <>
            <DataTable
              className=" rounded-md overflow-hidden"
              title="Produits"
              pagination
              columns={columns}
              data={filteredItems}
              paginationResetDefaultPage={resetPaginationToggle} // optionally, a hook to reset pagination to page 1
              subHeader
              subHeaderComponent={subHeaderComponentMemo}
              persistTableHead
              responsive
            />
          </>
        ) : (
          <div className="h-[400px] flex justify-center items-center text-8xl text-[#5c3652]">
            <Loader />
          </div>
        )}
      </div>

    </DashboardLayout>
  )
}

export default ProducList