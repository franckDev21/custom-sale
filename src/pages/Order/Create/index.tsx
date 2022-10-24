import React, { useState, useEffect, FormEvent } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { HiOutlineSearch } from "react-icons/hi";
import Loader from "../../../atoms/Loader";
import Customer from "../../../Model/Customer";
import Product from "../../../Model/Product";
import ProductCart from "../../../Model/ProductCart";
import CustomerForm from "../../../molecules/CustomerForm";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { http_client } from "../../../utils/axios-custum";
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
  const [tabProductSearch, setTabProductSearch] = useState<Product[]>([]);
  const [filter, setFilter] = useState("");
  const [showClientForm, setShowClientForm] = useState(false);
  const [addNewClientState,setAddNewClientState] = useState(false);

  const commander = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  const addToCart = (product: Product) => {
    
  }

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
      title="Order management"
      headerContent={
        <>
          <div className="ml-4 w-[74%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            <span>| Creation of a new order</span>
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {!loading ? (
          <div className="p-4 bg-white rounded-md flex space-x-4">

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
                    <option value="">-- select your customer --</option>
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
                  {tabProductSearch.map((product: Product) => (
                    <div style={{ zIndex: 1000 }} onClick={() => addToCart(product)} key={product.id} className="w-full z-50 flex justify-start items-start mb-2 p-1 hover:bg-gray-200 transition cursor-pointer">
                      <div className="w-10 relative h-10 overflow-hidden">
                        <img src={`${product.image ? `/storage/${product.image}` :'/static/img/product.png'}`} className=" absolute z-0 h-auto w-full object-cover" alt="kl" />
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
                    <span className="text-secondary pr-2">Total : </span>
                    <span>0 F</span>
                  </span>
                </div>
                <div className="py-3">
                  <button className={`bg-primary ${false && 'disabled'} border-2 border-primary transition text-white px-6 py-2 w-full rounded-md`}>{false ? "Enregistrement en cours ...":"Commander"}</button>
                </div>
              </div>
            </form>
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
