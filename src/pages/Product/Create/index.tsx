import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import Category from "../../../Model/Category";
import ProductSupplier from "../../../Model/ProductSupplier";
import ProductType from "../../../Model/ProductType";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { http_client } from "../../../utils/axios-custum";
import DefaultProductImage from '../../../assets/img/default-product.png'
import { toast } from "react-toastify";
import Loader from "../../../atoms/Loader";

type TypeProductCreate = {};

const GET_CATEGORIES_URL = "categories";
const GET_PRODUCT_TYPE_URL = "products/types";
const GET_PRODUCT_SUPPLIER_URL = "products/suppliers";

const ProductCreate: FC<TypeProductCreate> = () => {
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productSuppliers, setProductSuppliers] = useState<ProductSupplier[]>(
    []
  );
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [urlImg, setUrlImg] = useState('');

  const handleChangImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setUrlImg(DefaultProductImage);
      return;
    }
    let url = URL.createObjectURL(file);
    setUrlImg(url);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  useEffect(() => {
    Promise.all([
      http_client(Storage.getStorage("auth").token).get(GET_CATEGORIES_URL),
      http_client(Storage.getStorage("auth").token).get(GET_PRODUCT_TYPE_URL),
      http_client(Storage.getStorage("auth").token).get(
        GET_PRODUCT_SUPPLIER_URL
      ),
    ]).then((res: any) => {
      setLoading(false)

      setCategories(res[0].data)
      setProductTypes(res[1].data)
      setProductSuppliers(res[2].data)

      setUrlImg(DefaultProductImage)
    })
    .catch(err => {
      console.log(err);
      setLoading(false)
    });
  }, []);

  return (
    <DashboardLayout
      title="Product management"
      headerContent={
        <>
          <div className="ml-4 w-[68%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            | Add new product
          </div>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className={`max-w-5xl bg-white p-5 rounded-md mx-auto ${loading && "disabled"}`} >
          <div className="flex space-x-4 mb-4">
            <label htmlFor="image" className="w-[250px] h-[200px] cursor-pointer bg-slate-200 rounded-sm relative overflow-hidden">
              <img src={urlImg} alt='product' className="absolute h-full w-full object-cover" />
            </label>

            <input
              accept="image/*"
              name="image"
              onChange={handleChangImageFile}
              type="file"
              id="image"
              hidden
              className="hidden"
            />

            <div className="w-[calc(100%-250px)]">
              <label htmlFor="description" className=' inline-block mb-1 text-sm '>Product description <span className="text-sm italic">(Optional)</span></label>
              <textarea name="description" placeholder="Enter your product description here .... " id="description" cols={10} rows={3} className='placeholder:text-gray-300 text-sm w-full ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500'></textarea>

              <div className="flex items-center justify-between space-x-4 mt-3">
                <div className="w-1/2">
                  <label htmlFor="name" className=" inline-block mb-1 text-sm">Product name</label>
                  <input autoFocus required type="text" placeholder="Enter product name" className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500" />
                </div>

                <div className="w-1/2">
                  <label htmlFor="name" className=" inline-block mb-1 text-sm">Unit price <span className="text-sm italic">(In FCFA)</span></label>
                  <input required type="text" placeholder="Enter the product's unit price" className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="product_type_id" className=" inline-block mb-1 text-sm">Type of product</label>
              <select name="product_type_id" id="product_type_id" className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500">
                <option value="" className="text-gray-300">-- Product type --</option>
                {productTypes.map(type => (
                  <option key={type.id}>{type.slug}</option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label htmlFor="name" className=" inline-block mb-1 text-sm">Enter the product weight <span className="text-sm italic">(Kg,g)</span></label>
              <input required type="number" placeholder="product weight" step={0.5} min={0.5} className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500" />
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="product_type_id" className=" inline-block mb-1 text-sm">Alert stock quantity</label>
              <input required type="number" placeholder="Enter alert stock quantity" className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500" />
            </div>

            <div className="w-1/2">
              <label htmlFor="name" className=" inline-block mb-1 text-sm">Type of supply <span className="text-sm italic">(By piece, carton, bag, bucket, can ...)</span></label>
              <input required type="text" placeholder="You supply yourself with ...(Carton,Can,Bag)" className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500" />
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="product_type_id" className=" inline-block mb-1 text-sm">Category</label>
              <select name="product_type_id" id="product_type_id" className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500">
                <option value="" className="text-gray-300">-- Select the product category --</option>
                {categories.map(categoriy => (
                  <option key={categoriy.id}>{categoriy.name}</option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label htmlFor="name" className=" inline-block mb-1 text-sm">Enter the product weight <span className="text-sm italic">(Kg,g)</span></label>
              <select name="product_type_id" id="product_type_id" className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500">
                <option value="" className="text-gray-300">-- Choose your supplier --</option>
                {productSuppliers.map(supplier => (
                  <option key={supplier.id}>{supplier.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button type="submit" className={`px-4 ${sending && 'disabled'} py-2 bg-[#ac3265] text-white rounded-md flex justify-center items-center min-w-[200px] min-h-[35px]`}>{sending ? <Loader className="text-lg" />: 'Register the product'}</button>
          </div>
        </div>

        
      </form>
    </DashboardLayout>
  );
};

export default ProductCreate;
