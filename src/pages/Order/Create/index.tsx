import React, { useState, useEffect, FormEvent } from "react";
import { BsCheckLg } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import { TiTimes } from 'react-icons/ti';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../../atoms/Loader";
import Customer from "../../../Model/Customer";
import Product from "../../../Model/Product";
import ProductCart from "../../../Model/ProductCart";
import CustomerForm from "../../../molecules/CustomerForm";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { baseURL, http_client } from "../../../utils/axios-custum";
import { formatCurrency } from "../../../utils/function";

const GET_MY_CUSTOMERS = "/customers"; // changer et recuperer seulement les clients du user connecter
const GET_PRODUCTS = "/products"; // changer et recuperer seulement les clients du user connecter

const OrderCreate = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [client, setClient] = useState("");
  const [desc, setDesc] = useState("");
  const [carts, setCarts] = useState<ProductCart[]>([]);
  const [productSearch, setProductSearch] = useState<Product[]>([]);
  const [filter, setFilter] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [addNewClientState,setAddNewClientState] = useState(false);
  const [sending,setSending] = useState(false)
  const [success,setSuccess] = useState(false)
  const [orderId,setOrderId] = useState(0)

  const API_STORAGE_URL = `${baseURL}/storage`;
  const CREATE_ORDER_URL = "orders";

  const commander = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setSending(true)

    let data = {
      client,
      carts,
      desc,
      total_qte: isValid().qte,
      totalCommande: isValid().prix
    }

    console.log(data);
    
    http_client(Storage.getStorage("auth").token).post(CREATE_ORDER_URL,data)
      .then(res => {
        setSending(false)
        setSuccess(true)
        
        console.log(res.data);
        
        if(res.data.message){
          toast.success(res.data.message)
          setOrderId(res.data.order_id)
        }else{
          toast.error(res.data.error)
        }
        
      })
      .catch(err => {
        setSending(false)
        console.log(err);
      })


  }

  const addToCart = (product: ProductCart) => {
    if(!product.is_stock) return

    let exist = carts.find(p => p.id === product.id) ? true : false

    let newProduct : ProductCart;

    if(!exist){
      let nbreUnites;
      
      if(product.product_type?.name === 'VENDU_PAR_KG'){
        nbreUnites =  ((parseInt(product.qte_en_stock?.toString() || '0',10) || 0) * (parseInt(product.poids?.toString() || '0',10) || 0)) + (parseInt(product.unite_restante?.toString() || '0',10) || 0);
      }else if(product.product_type?.name === 'VENDU_PAR_PIECE'){
        nbreUnites = product.qte_en_stock || 0;
      } else if(product.product_type?.name === 'VENDU_PAR_LITRE'){
        nbreUnites =  ((parseInt(product.qte_en_stock?.toString() || '0',10) || 0) * parseInt(product.qte_en_litre?.toString() || '0',10)) + (parseInt(product.unite_restante?.toString() || '0',10) || 0);
      } else if (product.product_type?.name === 'VENDU_PAR_NOMBRE_PAR_CONTENEUR'){
        nbreUnites =  ((parseInt(product.qte_en_stock?.toString() || '0',10) || 0) * parseInt(product.nbre_par_carton?.toString() || '0',10)) + (parseInt(product.unite_restante?.toString() || '0',10) || 0);
      }

      newProduct = {
        ...product,
        qte : 1,
        max : nbreUnites,
        prix_de_vente : product.product_type?.name === 'VENDU_PAR_PIECE' ? product.prix_unitaire : null,
        type_de_vente : product.product_type?.name !== 'VENDU_PAR_PIECE' ? "DETAIL":"PIECE"
      }

      setCarts(state => [...state,newProduct])
    }else{
      let copieCarts = carts;
      let produitFind = copieCarts.find(p => p.id === product.id);

      if(produitFind){
        produitFind.qte = (parseInt(produitFind.qte?.toString() || '0',10) || 0) + 1
        copieCarts = carts.filter(p => p.id !== product.id)
        copieCarts = [...copieCarts,produitFind]
        setCarts(copieCarts)
      }
      
    }
    setFilter('')
  }

  const findProduct = (id: string) => {
    return carts.find(product => product.id === id)
  }

  const setPriceShop = (id: string,value:string) => {
    let copieCarts  = carts;
    let produitFind = copieCarts.find(product => product.id === id);
    if(produitFind){
      produitFind.prix_de_vente = parseInt(value,10) || 0
      copieCarts = carts.filter(product => product.id !== id)
      copieCarts = [...copieCarts,produitFind]
      setCarts(copieCarts)
    }
  }

  const setQte = (id: string,value: string) => {
    let copieCarts = carts;
    let produitFind = copieCarts.find(product => product.id === id);
    if(produitFind){
      produitFind.qte = parseInt(value,10) || null
      copieCarts = carts.filter(product => product.id !== id)
      copieCarts = [...copieCarts,produitFind]
      setCarts(copieCarts)
    }
  }

  const setTypeDeVente = (id:string,value:string) =>{
    let copieCarts  = carts;
    let produitFind = copieCarts.find(product => product.id === id);
    let nbreUnites

    if(produitFind){
      if(value === 'DETAIL'){
      
        produitFind.prix_de_vente = null

        if(produitFind.product_type?.name === 'VENDU_PAR_KG'){
          nbreUnites =  ((parseInt(produitFind.qte_en_stock?.toString() || '0',10) || 0) * (parseInt(produitFind.poids?.toString() || '0',10) || 0)) + (parseInt(produitFind.unite_restante?.toString() || '0',10) || 0);
        }else if(produitFind.product_type?.name === 'VENDU_PAR_PIECE'){
          nbreUnites = produitFind.qte_en_stock || 0;
        } else if(produitFind.product_type?.name === 'VENDU_PAR_LITRE'){
          nbreUnites =  ((parseInt(produitFind.qte_en_stock?.toString() || '0',10) || 0) * parseInt(produitFind.qte_en_litre?.toString() || '0',10)) + (parseInt(produitFind.unite_restante?.toString() || '0',10) || 0);
        } else if (produitFind.product_type?.name === 'VENDU_PAR_NOMBRE_PAR_CONTENEUR'){
          nbreUnites =  ((parseInt(produitFind.qte_en_stock?.toString() || '0',10) || 0) * parseInt(produitFind.nbre_par_carton?.toString() || '0',10)) + (parseInt(produitFind.unite_restante?.toString() || '0',10) || 0);
        }
    
      }else{
        produitFind.prix_de_vente = produitFind.prix_unitaire
        nbreUnites = produitFind.qte_en_stock
      }

      produitFind.max = nbreUnites
      produitFind.type_de_vente = value
      copieCarts = carts.filter(product => product.id !== id)
      copieCarts = [...copieCarts,produitFind]
      setCarts(copieCarts)

    }

  }

  const isValid = () => {
    let som = 0
    let prix = 0
    carts.forEach(product => {
      som += (parseInt(product.qte?.toString() || '0',10) || 0)
      prix += ((parseInt(product.qte?.toString() || '0',10) || 0) * (parseInt((product.prix_de_vente?.toString() || '0'),10) || 0))
    })
    return {
      ok : ((som > 0) && client !== ''),
      prix : prix,
      qte : som
    }
  }

  const getCustomer = (id: string): Customer|null => {    
    return customers.find(c => c.id?.toString() === id.toString()) || null
  }

  const deleteProduct = (id: string) => {
    let cartFiltereds = carts.filter(product => product.id !== id)
    setCarts(cartFiltereds)
  }

  const search = () => {
    if(filter !== ''){
      let newTab = products.filter(product => ((product.name || '').toLowerCase().includes(filter.toLowerCase()) || (product.type_approvisionnement || '').toLowerCase().includes(filter.toLowerCase()) || (product.prix_unitaire || 0).toString().toLowerCase().includes(filter.toLowerCase())))
      let tab: ProductCart[] = []
      if(newTab.length > 0){
        newTab.forEach((product,i) => {
          if(i <= 5){
            tab.push(product)
          }
        })
      }
      setProductSearch(tab)
    }else{
      setProductSearch([])
    }
  }

  useEffect(() => {
    search()
  },[filter])

  useEffect(() => {
    if(addNewClientState){
      http_client(Storage.getStorage("auth").token).get(GET_MY_CUSTOMERS)
        .then(res => {
          setCustomers(res.data.data) 
        })
        .catch(err => {
          console.log(err);
        })
    }
  },[addNewClientState])

  useEffect(() => {
    const fetUsers = async () => {
      const res = await Promise.all([
        http_client(Storage.getStorage("auth").token).get(GET_MY_CUSTOMERS),
        http_client(Storage.getStorage("auth").token).get(GET_PRODUCTS),
      ]);

      setCustomers(res[0].data.data);
      setProducts(res[1].data);
      setLoading(false);
    };
    fetUsers();
  }, []);

  return (
    <DashboardLayout
      title="Gestion des commandes"
      headerContent={
        <>
          <div className="ml-4 w-[64%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            <span>| Creation d'une commande</span>
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <div className="p-4 bg-white rounded-md flex space-x-4">

            {success ? <>
              <div className="flex flex-col py-16 justify-center w-full items-center space-y-5">
                <span className="text-7xl text-green-700"><BsCheckLg /> </span>
                <h3 className="text-3xl text-gray-600 w-[40%] text-center mx-auto font-bold">La commande a été enregistrée avec succès !</h3>
                <p>La commande de <span className="text-primary">{getCustomer(client || '1')?.firstname} {getCustomer(client || '1')?.lastname}</span> a été enregistré  </p>
                <div className="flex items-center justify-center space-x-4">
                  <Link to='/orders' className="px-4 py-2 bg-slate-600 text-white rounded-md">Liste des commandes </Link>
                  <Link to={`/orders/show/${orderId || 0}/1659495`} className="px-4 py-2 bg-primary text-white rounded-md">Voir la commande</Link>
                </div>
              </div>
            </>:<>
              {!showClientForm &&
                <div className="mb-4 w-1/2">
                  <h3 className="text-lg font-semibold text-gray-500 mb-3">
                    Client
                  </h3>
                  <div className="mt-1 flex justify-between items-center w-full">
                    <select
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      className="px-6 w-[70%] py-2 border-2 bg-gray-100 rounded-md shadow-sm border-gray-500 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-600 outline-none border-none"
                    >
                      <option value="">-- Choisissez votre client --</option>
                      {customers.map((customer) => (
                        <option value={customer.id} key={customer.id}>
                          {customer.firstname} {customer.lastname}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setShowClientForm(true)}
                      className="px-4 py-2 ml-2 w-[30%] bg-primary bg-opacity-80 hover:bg-opacity-100 rounded-md text-white"
                    >
                      Nouveau client
                    </button>
                  </div>

                  <div className="my-2 flex flex-col mt-4">
                    <h3 className="text-lg font-semibold text-gray-500 mb-3">
                      Description de la commande{" "}
                      <span className="text-gray-400 text-sm italic font-normal">
                        (Facultatif)
                      </span>
                    </h3>
                    <div className="mt-1 flex justify-between items-center">
                      <textarea
                        value={desc}
                        onChange={(e) => setDesc(e.target.value)}
                        className="px-6 w-full py-2 placeholder:italic bg-gray-100 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-600 outline-none border-none"
                        id=""
                        cols={30}
                        rows={10}
                        placeholder="Entrez la description de la commande ici..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              } 

              {showClientForm && 
                <CustomerForm onClickBack={(value) => setShowClientForm(value)} addNewClient={(value) => {
                  setShowClientForm(false)
                  setAddNewClientState(value)
                }} />
              }

              <form onSubmit={commander} className="w-1/2 ml-2">
                <div className="relative z-50">
                  <input type="text" value={filter} onChange={(e) => setFilter(e.target.value)} placeholder='Réchercher un produit ici' className='px-6 w-full py-2 bg-gray-100 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-600 outline-none border-none' />
                  <span className="fa-solid fa-magnifying-glass absolute top-1/2 -translate-y-1/2 right-4 text-gray-500">
                    <HiOutlineSearch size={20} />
                  </span>
                  
                  <div className="bg-gray-300 absolute w-full flex-col flex justify-start items-start top-full left-0 ring-0 rounded-b-md">
                    {productSearch.map((product: Product) => (
                      <div style={{ zIndex: 1000 }} onClick={() => addToCart(product)} key={product.id} className="w-full z-50 flex justify-start items-start mb-2 p-1 hover:bg-gray-200 transition cursor-pointer">
                        <div className="w-10 relative h-10 overflow-hidden">
                          <img src={`${product.image ? `${API_STORAGE_URL}/${product.image}` :'/static/img/product.png'}`} className=" absolute z-0 h-auto w-full object-cover" alt="imageproduit" />
                        </div>
                        <div className="ml-2 -translate-y-1">
                          <h2 className="font-semibold text-gray-600">{product.name}</h2>
                          <h2 className="font-semibold text-sm text-primary">prix unitaire : {formatCurrency(parseInt(product.prix_unitaire?.toString()||'0',10) || 0)} 
                            {product.is_stock ?  <>
                              <span className="px-2 font-normal rounded-lg mx-2 py-1 text-xs bg-green-100 text-green-500">En stock</span> | {product.qte_en_stock} {product.type_approvisionnement}(s) 
                              
                            </>: <span className="px-2 font-normal rounded-lg mx-2 py-1 text-xs bg-red-100 text-red-500">stock vide</span>}
                          
                          </h2> 
                        </div>
                      </div>
                    ))}

                  </div>
                </div>

                <div className="mt-3 z-0">
                  {carts.length > 0 ? (
                    <>
                    {carts.map((product,i) => (
                      <div key={`${product.id}-${i}`} className="w-full flex justify-start items-start mb-2 p-1 relative z-10 ">
                        <span onClick={() => deleteProduct(product.id || '0')} className="fa-solid fa-times absolute right-2 cursor-pointer inline-block ml-2 bg-red-100 p-2 top-2 text-red-500 z-50">
                          <TiTimes />
                          </span>
                        
                        { product.product_type?.name !== 'VENDU_PAR_PIECE' && 
                        <select onChange={e => setTypeDeVente(product.id || '0',e.target.value)} className="absolute right-14 top-2 appearance-none px-8 text-sm text-center font-bold ml-2 py-0.5 bg-gray-100 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-600 outline-none border-none">
                          <option value="DETAIL">Detail</option>
                          <option value="PIECE">{product.type_approvisionnement}</option>
                        </select>}

                        <div className="w-24 h-24 relative overflow-hidden z-10">
                          <img src={`${product.image ? `${API_STORAGE_URL}/${product.image}` :'/static/img/product.png'}`} className=" z-0 h-auto w-full object-cover" alt="imageproduit" />
                        </div>

                        <div className="ml-2 -translate-y-1">
                          <h2 className="font-semibold text-gray-600">{product.name}</h2>
                          <h2 className="font-semibold text-sm text-primary">Prix unitaire {product.type_approvisionnement} : {formatCurrency(parseInt(product.prix_unitaire?.toString() || '0',10),'XAF')}</h2> 
                          <div>
                            <input min={0} max={product.max} value={findProduct(product.id || '0')?.qte || 0} onChange={(e) => setQte(product.id || '0',e.target.value)}    type="number" className="mt-1 appearance-none px-1 text-center font-bold w-20 py-1 bg-gray-100 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-600 outline-none border-none" required />
                            <input min={0} value={findProduct(product.id || '0')?.prix_de_vente || ''} onChange={e => setPriceShop(product.id || '0',e.target.value)} placeholder='prix de vente' type="number" className="mt-1 appearance-none pl-2 pr-1 font-bold ml-2 py-1 bg-gray-100 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-gray-600 outline-none border-none" required />
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                  ):(
                    <div className="min-h-[200px] text-center text-gray-500 text-2xl bg-slate-100 rounded-md flex flex-col justify-center items-center">
                      <span className="fa-solid fa-cart-shopping text-3xl text-primary">
                        <FaShoppingCart />
                      </span>
                      <span className="mb-2 mt-1">Aucun produit séléctionner </span>
                      <span className="text-base px-5">veillez réchercher le(s) et cliquez dessus pour les ajoutes dans la commande</span>
                    </div>
                  )}
                  <div className="my-4 border-y flex justify-end items-center">
                    <span className="text-3xl text-gray-500 font-bold py-3 inline-block">
                      <span className="text-secondary pr-2">Total :  </span>
                      <span>{formatCurrency(isValid().prix,'XAF')}</span>
                    </span>
                  </div>
                  <div className="py-3">
                    <button className={`bg-primary  ${(!isValid().ok || sending) && 'disabled'} border-2 border-primary transition text-white px-6 py-2 w-full rounded-md`}>{sending ? <Loader className="inline-block text-xl" /> :"Commander"}</button>
                  </div>
                </div>
              </form>
            </>}

          </div>
        ) : (
          <div className="h-[400px] flex justify-center items-center text-8xl text-[#5c3652]">
            <Loader />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrderCreate;
