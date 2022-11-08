import { Modal } from "flowbite-react";
import React, { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { BiPencil } from "react-icons/bi";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiArrowLeftRightFill } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../atoms/Loader";
import Product from "../../../Model/Product";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { baseURL, http_client } from "../../../utils/axios-custum";
import { extraiText, formatCurrency, formatDate } from "../../../utils/function";

type TypeProductDetail = {};

type TypeInputForm = {
  quantite ?: string|number,
  prix_achat ?: string|number,
}

type TypeOutputForm = {
  quantite ?: string|number,
  type ?: string,
  motif ?: string|number,
}

const GET_PRODUIT_URL = "product";
const API_STORAGE_URL = `${baseURL}/storage`;
const POST_SUPPLY_URL = "products/add";
// products/add/{product}/input/supply

const ProductDetail: React.FC<TypeProductDetail> = () => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>({});
  const [showInputModal, setShowInputModal] = useState(false);
  const [showOutputModal, setShowOutputModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [sending2, setSending2] = useState(false);
  const [modalType, setModalType] = useState('INPUT');
  const [dataInputForm,setDataInputForm] = useState<TypeInputForm>({})
  const [dataOutputForm,setDataOutputForm] = useState<TypeOutputForm>({
    type : 'CONTENEUR'
  })

  const { id } = useParams();

  const confirmAddInput = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending(true)
    // add inPut
    http_client(Storage.getStorage("auth").token).post(`${POST_SUPPLY_URL}/${id}/input/supply`,dataInputForm)
      .then(res => {
        setSending(false)
        setShowInputModal(false);
        setDataInputForm({quantite:'',prix_achat: ''})
        toast.success(res.data.message)
        setProduct(res.data.product)
      })
      .catch(err => {
        setSending(false)
        console.log(err);
      })
    
  }

  const confirmAddOutput = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSending2(true)
    
    // add inPut
    http_client(Storage.getStorage("auth").token).post(`${POST_SUPPLY_URL}/${id}/output/`,dataOutputForm)
      .then(res => {
        setSending2(false)
        setShowOutputModal(false);
        setDataOutputForm({quantite:'',type: '',motif: ''})

        if(res.data.message){
          toast.success(res.data.message)
          setProduct(res.data.product)
        }else if(res.data.error){
          toast.error(res.data.error)
        }else{
          console.log(res.data);
          
        }
        
      })
      .catch(err => {
        setSending2(false)
        console.log(err);
      })
  }

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

  useEffect(() => {
    http_client(Storage.getStorage("auth").token)
      .get(`${GET_PRODUIT_URL}/${id}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [id]);

  return (
    <DashboardLayout
      title="Gestion des produits"
      headerContent={
        <>
          <div className="ml-4 w-[68%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            {!loading && 
              <>
                <span>| {extraiText(product.name||'',17)}</span>

                <div className="flex space-x-4 font-bold items-center ml-4">
                  <button onClick={_ => {
                    onClick('OUTPUT')
                    setModalType('OUTPUT')
                  }} className='text-sm text-white px-4 rounded-md bg-red-400 py-2'> <FaMinus size={16} className='inline-block  mr-1' />Ajouter une sortie</button>
                  <button onClick={_ => {
                    onClick('INPUT')
                    setModalType('INPUT')
                  }} className='text-sm text-white px-4 rounded-md bg-green-700 py-2'> <FaPlus size={16} className='inline-block mr-1' />Ajouter une entrées</button>
                  <Link to='/products/history/all' className='text-sm text-white px-4 rounded-md bg-yellow-400 py-2'> <RiArrowLeftRightFill size={20} className='inline-block rotate-90  mr-1' />Historique d'E/S</Link>
                </div>
              </>
            }

          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">

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
                  Ajouter une sortie produit
                </h3>
                <div className="flex flex-col space-y-4 mt-4 mb-6">
                  <div>
                    <label htmlFor="quantite" className="inline-block mb-2 font-semibold text-gray-700">Quantité</label>
                    <input name="quantite" onChange={handleOnchange} value={dataOutputForm.quantite || ''} required autoFocus type="number" id="quantite" placeholder="Quantité à retirer" min={0} className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' />
                  </div>
                  {product.product_type?.name !== 'VENDU_PAR_PIECE' &&
                    <div>
                      <label htmlFor="price" className="inline-block mb-2 font-semibold text-gray-700">Type de sortie</label>
                      <select name="type" onChange={handleOnchange} value={dataOutputForm.type || ''} required  id="price" placeholder="price (FCFA)" className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600'>
                        <option value=""> -- Sélectionner un type de sortie --</option>
                        <option value="UNITE">En unité</option>
                        <option value="CARTON">{product.type_approvisionnement}</option>
                      </select>
                    </div>
                  }
                  {product.product_type?.name === 'VENDU_PAR_PIECE' && <input type='hidden' className='hidden' name='type' hidden value={dataOutputForm.type} />}
                  <div>
                    <label htmlFor="motif" className="inline-block mb-2 font-semibold text-gray-700">Motif</label>
                    <textarea name="motif" onChange={handleOnchange} value={dataOutputForm.motif || ''} required id="quantite" placeholder="Entrer le motif du retrait" className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' rows={6}></textarea>
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
                      "Confirmer"
                    )}
                  </button>
                  <button
                    color="gray"
                    onClick={onClose}
                    className="bg-gray-500 hover:bg-gray-700 transition text-white rounded-md px-3 font-semibold uppercase py-2 w-1/2 inline-block"
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
                  Ajouter un nouvelle approvisionnement
                </h3>
                <div className="flex flex-col space-y-4 mt-4 mb-6">
                  <div>
                    <label htmlFor="quantite" className="inline-block mb-2 font-semibold text-gray-700">Quantité <span className=" italic text-sm font-light ">({product.type_approvisionnement})</span></label>
                    <input name="quantite" onChange={handleOnchange} value={dataInputForm.quantite || ''} required autoFocus type="number" id="quantite" placeholder="Entrer la quantité d’approvisionnement" min={0} className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' />
                  </div>
                  <div>
                    <label htmlFor="price" className="inline-block mb-2 font-semibold text-gray-700">Prix d’achat </label>
                    <input name="prix_achat" onChange={handleOnchange} value={dataInputForm.prix_achat || ''} required type="number" id="price" placeholder="prix (FCFA)" min={0} className='w-full px-3 placeholder:italic py-2 bg-slate-100 rounded-md outline-none border-none ring-0 focus:ring-2 focus:ring-gray-600' />
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
                      "Enregistrer"
                    )}
                  </button>
                  <button
                    color="gray"
                    onClick={onClose}
                    className="bg-gray-500 hover:bg-gray-700 transition text-white rounded-md px-3 font-semibold uppercase py-2 w-1/2 inline-block"
                  >
                    Non, annuler
                  </button>
                </div>
              </form>
            </Modal.Body>
          </Modal>
        </React.Fragment>

        {loading ? (
          <div className="h-[400px] flex justify-center items-center text-8xl text-[#5c3652]">
            <Loader />
          </div>
        ) : (
          <div className="max-w-5xl bg-white p-5 rounded-md mx-auto flex space-x-5 relative overflow-hidden">
            <Link to={`/products/edit/${product.id}/${product.name?.split(' ').join('-').toLowerCase()}`} className=" absolute top-0 right-0 px-4 py-2 bg-green-400 text-white"><BiPencil size={17} /></Link>
            <div className=" min-h-[400px]  w-[300px]">
              <div className={`h-[300px] overflow-hidden ${!product.image && 'bg-slate-200'} relative`}>
                {product.image && <img className=" absolute h-auto w-full object-cover" src={`${API_STORAGE_URL}/${product.image}` || ''} alt='imagerduit' />}
              </div>
              <div className="mt-4 space-y-6 border-t pt-4">
                <h2><span className="font-semibold">En stock ? </span>: <span className={`px-3 py-2 text-white ${product.is_stock ? 'bg-green-500':'bg-red-500'} rounded-full opacity-70`}>{product.is_stock ? 'Yes still in stock':'No stock sold out'}</span></h2>
                <h2><span className="font-semibold">Stock d'alerte  </span>: <span className={`px-3 py-2 text-red-500 rounded-full opacity-70`}>{product.qte_stock_alert} {product.type_approvisionnement}{(product.qte_stock_alert || 0) > 1 && 's'}</span></h2>
              </div>
            </div>
            <div className="w-[calc(100%-300px)] flex flex-col">
              <div>
                <label htmlFor="desc" className="mb-1 inline-block">Description</label>
                <div className="p-2 rounded-md bg-slate-100">{product.description || 'Empty'}</div>
              </div>

              <div className="flex items-center space-x-3 mt-3 text-xl">
                <label htmlFor="desc" className="mb-1 inline-block">Nom du produit</label>
                <div className="p-2 rounded-md bg-slate-100">{product.name}</div>
              </div>

              <div className="flex items-center space-x-3 mt-3 text-xl">
                <label htmlFor="desc" className="mb-1 inline-block">Quantité en stock</label>
                <div className="p-2 rounded-md bg-slate-100">
                  {product.qte_en_stock} {product.type_approvisionnement}{(product.qte_en_stock || 0) > 1 && 's'}
                  {product.product_type?.name === 'VENDU_PAR_NOMBRE_PAR_CONTENEUR' && ` de ${product.nbre_par_carton} et ${product.unite_restante || 0} Unité${(product.unite_restante || 0) > 1 ? 's':''} restante`}
                  {product.product_type?.name === 'VENDU_PAR_LITRE' && ` de ${product.qte_en_litre} ${product.product_type.unite_de_mesure} et ${product.unite_restante || 0} Unité${(product.unite_restante || 0) > 1 ? 's':''} restante`}
                  {product.product_type?.name === 'VENDU_PAR_KG' && ` de ${product.poids} ${product.product_type.unite_de_mesure} et ${product.unite_restante || 0} Unité${(product.unite_restante || 0) > 1 ? 's':''} restante`}
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-3 text-xl">
                <label htmlFor="desc" className="mb-1 inline-block">Prix unitaire</label>
                <div className="p-2 rounded-md bg-slate-100">{formatCurrency(parseInt(product.prix_unitaire?.toString() || '0' ,10) || 0,'XAF')}</div>
              </div>

              <div className="flex items-center space-x-3 mt-3 text-xl">
                <label htmlFor="desc" className="mb-1 inline-block">Date de création </label>
                <div className="p-2 rounded-md bg-slate-100">{formatDate(product.created_at || '')}</div>
              </div>

              <div className="flex items-center space-x-3 mt-3 text-xl">
                <label htmlFor="desc" className="mb-1 inline-block">Unité de mésure </label>
                <div className="p-2 rounded-md bg-slate-100">{product.product_type?.unite_de_mesure}</div>
              </div>

              <div className="flex space-x-4 mt-3 items-center">
                <div className="flex items-center space-x-3 text-xl">
                  <label htmlFor="desc" className="mb-1 inline-block">Categorie : </label>
                  <div className="p-2 rounded-md text-[#ac3265]">{product.category?.name}</div>
                </div>
                <span className="h-5 w-[1px] bg-slate-400 inline-block"></span>
                <div className="flex items-center space-x-3 text-xl">
                  <label htmlFor="desc" className="mb-1 inline-block">Fournisseur : </label>
                  <div className="p-2 rounded-md text-[#ac3265]">{product.product_supplier?.name}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProductDetail;
