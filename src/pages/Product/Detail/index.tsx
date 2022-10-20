import React, { useState, useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { RiArrowLeftRightFill } from "react-icons/ri";
import { Link, useParams } from "react-router-dom";
import Loader from "../../../atoms/Loader";
import Product from "../../../Model/Product";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { http_client } from "../../../utils/axios-custum";
import { formatCurrency, formatDate } from "../../../utils/function";

type TypeProductDetail = {};

const GET_PRODUIT_URL = "product";
const API_STORAGE_URL = "http://localhost:8000/storage";

const ProductDetail: React.FC<TypeProductDetail> = () => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product>({});

  const { id } = useParams();

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
      title="Product management"
      headerContent={
        <>
          <div className="ml-4 w-[68%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            {!loading && <>
              <span>| {product.name}</span>

              <div className="flex space-x-4 font-bold items-center">
                <Link to='/approvisionnement' className='text-sm text-white px-4 rounded-md bg-red-400 py-2'> <FaMinus size={16} className='inline-block  mr-1' />Add an output</Link>
                <Link to='/approvisionnement' className='text-sm text-white px-4 rounded-md bg-green-700 py-2'> <FaPlus size={16} className='inline-block mr-1' />Add an entry</Link>
                <Link to='/approvisionnement' className='text-sm text-white px-4 rounded-md bg-yellow-400 py-2'> <RiArrowLeftRightFill size={20} className='inline-block rotate-90  mr-1' />History of entries</Link>
              </div>
            </>}
          </div>
        </>
      }
    >
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="h-[400px] flex justify-center items-center text-8xl text-[#5c3652]">
            <Loader />
          </div>
        ) : (
          <div className="max-w-5xl bg-white p-5 rounded-md mx-auto flex space-x-5 ">
            <div className=" min-h-[400px] w-[300px]">
              <div className={`h-[300px] ${!product.image && 'bg-slate-200'} relative`}>
                {product.image && <img className=" absolute h-auto w-full object-cover" src={`${API_STORAGE_URL}/${product.image}` || ''} alt='imagerduit' />}
              </div>
              <div className="mt-4 space-y-6 border-t pt-4">
                <h2><span className="font-semibold">In stock ? </span>: <span className={`px-3 py-2 text-white ${product.is_stock ? 'bg-green-500':'bg-red-500'} rounded-full opacity-70`}>{product.is_stock ? 'Yes still in stock':'No stock sold out'}</span></h2>
                <h2><span className="font-semibold">Alert stock </span>: <span className={`px-3 py-2 text-red-500 rounded-full opacity-70`}>{product.qte_stock_alert} {product.type_approvisionnement}{(product.qte_stock_alert || 0) > 1 && 's'}</span></h2>
              </div>
            </div>
            <div className="w-[calc(100%-300px)] flex flex-col">
              <div>
                <label htmlFor="desc" className="mb-1 inline-block">Description</label>
                <div className="p-2 rounded-md bg-slate-100">{product.description}</div>
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
                  <label htmlFor="desc" className="mb-1 inline-block">Category : </label>
                  <div className="p-2 rounded-md text-[#ac3265]">{product.category?.name}</div>
                </div>
                <span className="h-5 w-[1px] bg-slate-400 inline-block"></span>
                <div className="flex items-center space-x-3 text-xl">
                  <label htmlFor="desc" className="mb-1 inline-block">Provider : </label>
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
