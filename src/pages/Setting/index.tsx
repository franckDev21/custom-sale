import { Modal } from 'flowbite-react'
import React, { useState,useEffect , FormEvent, ChangeEvent } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { BsPlusLg, BsPrinterFill } from 'react-icons/bs'
import { FaTimes, FaTrash } from 'react-icons/fa'
import { HiOutlineExclamationCircle, HiRefresh } from 'react-icons/hi'
import { toast } from 'react-toastify'
import Loader from '../../atoms/Loader'
import Category from '../../Model/Category'
import ProductSupplier from '../../Model/ProductSupplier'
import Storage from '../../service/Storage'
import DashboardLayout from '../../templates/DashboardLayout'
import { http_client } from '../../utils/axios-custum'
import { formatDate } from '../../utils/function'

type TypeSetting = {}

type TypeSupplier = {
  name ?: string,
  address ?: string,
  tel ?: string,
  email ?: string,
}

const GET_CATEGORIES_URL = "categories";
const GET_PRODUCT_SUPPLIER_URL = "product-suppliers";
const CREATE_SUPPLIERS_URL = 'product-suppliers'

const Setting:React.FC<TypeSetting> = () => {

  const [categories,setCategories] = useState<Category[]>([])
  const [productSupplies,setProductSupplies] = useState<ProductSupplier[]>([])
  const [loading, setLoading] = useState(true);
  const [sendingOne, setSendingOne] = useState(false);
  const [sendingTwo, setSendingTwo] = useState(false);
  const [showFormCategory, setShowFormCategory] = useState(false);
  const [showFormSupplier, setShowFormSupplier] = useState(false);
  const [categorieInput, setCategorieInput] = useState('');
  const [supplierForm,setSupplierForm] = useState<TypeSupplier>({})
  const [filterText, setFilterText] = useState("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [filterTextTwo, setFilterTextTwo] = useState("");
  const [resetPaginationToggleTwo, setResetPaginationToggleTwo] = useState(false);
  const [currentIdCategory, setCurrentIdCategory] = useState<string | null>(null);
  const [currentIdSuppliers, setCurrentIdSuppliers] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showModalTwo, setShowModalTwo] = useState(false);
  const [deletingTwo, setDeletingTwo] = useState(false);

  const filteredItems = categories.filter(
    (item) =>
      (item?.created_at &&
        item.created_at.toLowerCase().includes(filterText.toLowerCase()))  ||
      (item?.name &&
        item.name.toLowerCase().includes(filterText.toLowerCase())) 
  );

  const filteredItemsTwo = productSupplies.filter(
    (item) =>
      (item?.name &&
        item.name.toLowerCase().includes(filterTextTwo.toLowerCase()))  ||
      (item?.address &&
        item.address.toLowerCase().includes(filterTextTwo.toLowerCase()))  ||
      (item?.email &&
        item.email.toLowerCase().includes(filterTextTwo.toLowerCase()))  ||
      (item?.tel &&
        item.tel.toLowerCase().includes(filterTextTwo.toLowerCase()))  ||
      (item?.created_at &&
        item.created_at.toLowerCase().includes(filterTextTwo.toLowerCase()))  ||
      (item?.name &&
        item.name.toLowerCase().includes(filterTextTwo.toLowerCase())) 
  );

  const confirmDelete = () => {
    setShowModal(false);

    setDeleting(true);
    // delete order
    http_client(Storage.getStorage("auth").token)
      .delete(`${GET_CATEGORIES_URL}/${currentIdCategory}`)
      .then((res) => {
        setDeleting(false);
        deleteCategory(currentIdCategory || "1");
        if(res.data.message){
          toast.success(res.data.message);
        }else{
          toast.error(res.data.error);
        }
      })
      .catch((err: any) => {
        setDeleting(false);
        console.log(err);
      });
  }

  const confirmDeleteTwo = () => {
    setShowModalTwo(false);

    setDeletingTwo(true);
    // delete order
    http_client(Storage.getStorage("auth").token)
      .delete(`${CREATE_SUPPLIERS_URL}/${currentIdSuppliers}`)
      .then((res) => {
        setDeletingTwo(false);
        deleteSuppliers(currentIdSuppliers || "1");
        if(res.data.message){
          toast.success(res.data.message);
        }else{
          toast.error(res.data.error);
        }
      })
      .catch((err: any) => {
        setDeletingTwo(false);
        console.log(err);
      });
  }

  const deleteCategory = (id: string) => {
    let categoriesFilter = categories.filter((category) => category.id !== id);
    setCategories(categoriesFilter);
  };

  const deleteSuppliers= (id: string) => {
    let suppliersFilter = productSupplies.filter((supplier) => supplier.id !== id);
    setProductSupplies(suppliersFilter);
  };

  const onClick = (id: string) => {
    setCurrentIdCategory(id);
    setShowModal(!showModal);
  };

  const onClose = () => {
    setShowModal(false);
  };

  const onClickTwo = (id: string) => {
    setCurrentIdSuppliers(id);
    setShowModalTwo(!showModalTwo);
  };

  const onCloseTwo = () => {
    setShowModalTwo(false);
  };

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

  const subHeaderComponentMemoTwo = React.useMemo(() => {
    const handleClear = () => {
      if (filterTextTwo) {
        setResetPaginationToggleTwo(!resetPaginationToggleTwo);
        setFilterTextTwo("");
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
            onChange={(e) => setFilterTextTwo(e.target.value)}
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
  }, [filterTextTwo, resetPaginationToggleTwo]);

  const columns: TableColumn<Category>[] = [
    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Date de création</span>,
      cell: (row) => <span className="">
        {formatDate(row.created_at || "")|| "Aucun"}
      </span>,
      sortable: true,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          Nom de la catégorie
        </span>
      ),
      selector: (row) => `${row.name}` || '',
    },
    {
      name: "",
      cell: (row) => (
        <h1 className=" flex items-center justify-center">
          
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

  const columnsTwo: TableColumn<ProductSupplier>[] = [
    {
      name: <span className="  font-bold text-xs text-[#ac3265] uppercase">Date de création</span>,
      cell: (row) => <span className="">
        {formatDate(row.created_at || "")|| "Aucun"}
      </span>,
      sortable: true,
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          category name
        </span>
      ),
      selector: (row) => `${row.name}` || '',
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          email
        </span>
      ),
      selector: (row) => row.email || 'Aucun',
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          address
        </span>
      ),
      selector: (row) => row.address || 'Aucun',
    },
    {
      name: (
        <span className=" font-bold text-xs text-[#ac3265] uppercase">
          tel
        </span>
      ),
      selector: (row) => row.tel || 'Aucun',
    },
    {
      name: "",
      cell: (row) => (
        <h1 className=" flex items-center justify-center">
          
          <button
            onClick={(_) => onClickTwo(row.id || "1")}
            className="font-medium ml-1 text-red-500 w-8 h-8 justify-center items-center  bg-red-100 rounded-md inline-flex dark:text-red-500 hover:underline"
          >
            <FaTrash />
          </button>
        </h1>
      ),
    },
  ];

  const handleSubmitOne = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSendingOne(true)
    http_client(Storage.getStorage("auth").token).post(GET_CATEGORIES_URL,{name: categorieInput})
      .then(res => {
        setSendingOne(false)
        toast.success(res.data.message)
        setCategorieInput('')
        reload()
      })
      .catch(err => {
        setSendingOne(false)
        console.log(err);
      })
  }

  const handleSubmitTwo = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSendingTwo(true)
    http_client(Storage.getStorage("auth").token).post(CREATE_SUPPLIERS_URL,supplierForm)
      .then(res => {
        setSendingTwo(false)
        toast.success(res.data.message)
        setSupplierForm({})
        reload()
      })
      .catch(err => {
        setSendingTwo(false)
        console.log(err);
      })
  }

  const handleOnchange = (e: ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    switch (e.target.name) {
      case 'name':
        setSupplierForm({...supplierForm,name : e.target.value})
        break;
      case 'address':
        setSupplierForm({...supplierForm,address : e.target.value})
        break;
      case 'tel':
        setSupplierForm({...supplierForm,tel : e.target.value})
        break;
      case 'email':
        setSupplierForm({...supplierForm,email : e.target.value})
        break;
    }
  }

  const reload = () => {
    Promise.all([
      http_client(Storage.getStorage("auth").token).get(GET_CATEGORIES_URL),
      http_client(Storage.getStorage("auth").token).get(GET_PRODUCT_SUPPLIER_URL),
    ]).then((res: any) => {
      setLoading(false)

      setCategories(res[0].data)
      setProductSupplies(res[1].data)
    })
    .catch(err => {
      console.log(err);
      setLoading(false)
    });
  }

  useEffect(() => {
    reload()
  },[])

  return (
    <DashboardLayout
      title='Paramètre'
    >
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
              voulez vous vraiment supprimer cette catégorie ?
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
                    "Oui,supprimer"
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

      <React.Fragment>
        <Modal
          show={showModalTwo || deletingTwo}
          size="md"
          popup={true}
          onClose={onCloseTwo}
        >
        <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 " />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Voulez vous vraiment supprimer ce fournisseur ?
              </h3>
              <div className="flex justify-center gap-4">
                <button
                  color="failure"
                  className="bg-red-500 text-white rounded-md px-4 py-2"
                  onClick={confirmDeleteTwo}
                >
                  {deletingTwo ? (
                    <Loader className="flex justify-center items-center" />
                  ) : (
                    "Oui,supprimer"
                  )}
                </button>
                <button
                  color="gray"
                  onClick={onCloseTwo}
                  className="bg-gray-500 text-white rounded-md px-4 py-2"
                >
                  Non, annuler
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 font-bold items-center mb-4">
          <h1 className='text-3xl text-primary font-bold'>Liste des categories |</h1>
          <div className="flex space-x-4 font-bold items-center">
            <button onClick={() => setShowFormCategory(!showFormCategory)} className='text-sm text-white px-4 rounded-md bg-green-700 py-2'> <BsPlusLg size={16} className='inline-block  mr-1' />Ajouter une nouvelle catégorie</button>
            <button  className='text-sm text-white px-4 rounded-md bg-gray-700 py-2'> <BsPrinterFill size={16} className='inline-block  mr-1' />Imprimer la liste des catégories </button>
            <button  className='text-sm text-[#ac3265] px-4 rounded-md bg-white py-2'> <HiRefresh size={20} /></button>
          </div>
        </div>
        
        {showFormCategory && 
          <form onSubmit={handleSubmitOne} className='p-4 bg-white rounded-md text-lg mb-4'>
            <label htmlFor="name" className='flex space-y-3 flex-col relative'>
              <span>Nom de la catégorie</span>
              <div className="flex justify-start space-x-3">
                <input required value={categorieInput} onChange={e => setCategorieInput(e.target.value)} type="text" placeholder='Nom de la catégorie' className='px-4 w-[40%] rounded-md py-2 bg-gray-100'   />
                <button type='submit' className={`bg-green-400 ${!categorieInput && 'disabled select-none'} hover:bg-green-600 transition text-white px-4 py-2 uppercase font-bold rounded-md flex items-center`}>{sendingOne ? <Loader className='text-lg inline-block' />:'Sauvegarder'}</button>
              </div>
              <span onClick={() => setShowFormCategory(false)} title='Close' className=' absolute -top-4 right-0 bg-red-100 p-2 rounded-md transition text-red-500 cursor-pointer hover:bg-red-500 hover:text-white'><FaTimes /></span>
            </label>
          </form>
        }
        
        {!loading ? (
          <>
            <DataTable
              className=" rounded-md overflow-hidden"
              title="Categories"
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

      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="flex space-x-4 font-bold items-center mb-4 mt-10">
          <h1 className='text-3xl text-primary font-bold'>Liste des fournisseurs |</h1>
          <div className="flex space-x-4 font-bold items-center">
            <button onClick={() => setShowFormSupplier(!showFormSupplier)} className='text-sm text-white px-4 rounded-md bg-green-700 py-2'> <BsPlusLg size={16} className='inline-block  mr-1' />Ajouter un nouveau fournisseurr</button>
            <button  className='text-sm text-white px-4 rounded-md bg-gray-700 py-2'> <BsPrinterFill size={16} className='inline-block  mr-1' />Imprimer la liste des fournisseurs</button>
            <button  className='text-sm text-[#ac3265] px-4 rounded-md bg-white py-2'> <HiRefresh size={20} /></button>
          </div>
        </div>
  
        {showFormSupplier && 
          <form onSubmit={handleSubmitTwo} className='p-4 bg-white rounded-md text-lg mb-4'>
            <label htmlFor="name" className='flex space-y-3 flex-col relative'>
              <span>Création d’un nouveau fournisseur</span>
              <div className="flex justify-start space-x-3">
                <input required value={supplierForm.name || ''} onChange={handleOnchange} type="text" name='name' placeholder='Nom' className='px-4 w-1/2 rounded-md py-2 bg-gray-100'   />
                <input  value={supplierForm.address || ''} onChange={handleOnchange} type="address" name='address' placeholder='address (optionnel)' className='px-4 w-1/2 placeholder:italic rounded-md py-2 bg-gray-100'   />
              </div>
              <div className="flex justify-start space-x-3 mt-3">
                <input  value={supplierForm.email || ''} onChange={handleOnchange} name='email' type="email" placeholder='email (optionnel)' className='px-4 placeholder:italic w-1/2 rounded-md py-2 bg-gray-100'   />
                <input  value={supplierForm.tel || ''} onChange={handleOnchange} type="tel" name='tel' placeholder='tel (optionnel)' className='px-4 placeholder:italic w-1/2 rounded-md py-2 bg-gray-100'   />
              </div>
              <span onClick={() => setShowFormSupplier(false)} title='Close' className=' absolute -top-4 right-0 bg-red-100 p-2 rounded-md transition text-red-500 cursor-pointer hover:bg-red-500 hover:text-white'><FaTimes /></span>

              <button type='submit' className={`bg-green-400 ${(!supplierForm.name) && 'disabled select-none'} self-start hover:bg-green-600 transition text-white px-4 py-2 uppercase font-bold rounded-md flex items-center`}>{sendingTwo ? <Loader className='text-lg inline-block' />:'Save'}</button>
            </label>
          </form>

        }

        {!loading ? (
          <>
            <DataTable
              className=" rounded-md overflow-hidden"
              title="Suppliers"
              pagination
              columns={columnsTwo}
              data={filteredItemsTwo}
              paginationResetDefaultPage={resetPaginationToggleTwo} // optionally, a hook to reset pagination to page 1
              subHeader
              subHeaderComponent={subHeaderComponentMemoTwo}
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

export default Setting