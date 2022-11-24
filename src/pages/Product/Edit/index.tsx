import React, {
  ChangeEvent,
  FC,
  FormEvent,
  useEffect,
  useState,
  useRef,
} from "react";
import Category from "../../../Model/Category";
import ProductSupplier from "../../../Model/ProductSupplier";
import ProductType from "../../../Model/ProductType";
import Storage from "../../../service/Storage";
import DashboardLayout from "../../../templates/DashboardLayout";
import { baseURL, http_client } from "../../../utils/axios-custum";
import DefaultProductImage from "../../../assets/img/default-product.png";
import { toast } from "react-toastify";
import Loader from "../../../atoms/Loader";
import Product from "../../../Model/Product";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";

type TypeProductEdit = {};

const GET_CATEGORIES_URL = "categories";
const GET_PRODUCT_TYPE_URL = "products/types";
const GET_PRODUCT_SUPPLIER_URL = "products/suppliers";
const EDIT_PRODUCT_URL = "product";
const GET_PRODUIT_URL = "product";
const API_STORAGE_URL = `${baseURL}/storage`;

const ProductEdit: FC<TypeProductEdit> = () => {
  const [product, setProduct] = useState<Product>({});
  const [currentType, setCurrentType] = useState<string>("VENDU_PAR_PIECE");
  const [errForm, setErrForm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productSuppliers, setProductSuppliers] = useState<ProductSupplier[]>(
    []
  );
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [urlImg, setUrlImg] = useState("");

  const { id } = useParams();

  const companiesStore = useSelector((state: any) => state.companies);

  const formRef = useRef(null);

  const navigate = useNavigate();

  const handleChangImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) {
      setUrlImg(DefaultProductImage);
      return;
    }
    setProduct({ ...product, image: file });
    let url = URL.createObjectURL(file);
    setUrlImg(url);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formData = new FormData(formRef?.current || undefined);

    setSending(true);
    http_client(Storage.getStorage("auth").token)
      .post(`${EDIT_PRODUCT_URL}/${id}`, formData)
      .then((res) => {
        setSending(false);
        toast.success(res.data.message);
        setLoading(true);
        let id = window.setTimeout(() => {
          navigate(
            `/products/show/${product.id}/${product.name
              ?.split(" ")
              .join("-")
              .toLowerCase()}`
          );
          window.clearTimeout(id);
        }, 6000);
      })
      .catch((err) => {
        setSending(false);
        setErrForm(err.response.data.message);
        toast.error(err.response.data.message);
        console.log(err);
      });
  };

  const handleOnchange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (errForm) setErrForm("");

    switch (e.target.name) {
      case "name":
        setProduct({ ...product, name: e.target.value });
        break;
      case "description":
        setProduct({ ...product, description: e.target.value });
        break;
      case "prix_unitaire":
        setProduct({ ...product, prix_unitaire: e.target.value });
        break;
      case "product_type_id":
        setCurrentType(
          productTypes.find(
            (type) => (type.id || 1) === parseInt(e.target.value, 10)
          )?.name || ""
        );
        setProduct({
          ...product,
          product_type_id: e.target.value,
          poids: null,
          nbre_par_carton: null,
          qte_en_litre: null,
        });
        break;
      case "poids":
        setProduct({ ...product, poids: e.target.value });
        break;
      case "qte_en_litre":
        setProduct({ ...product, qte_en_litre: e.target.value });
        break;
      case "nbre_par_carton":
        setProduct({ ...product, nbre_par_carton: e.target.value });
        break;
      case "qte_stock_alert":
        setProduct({ ...product, qte_stock_alert: e.target.value });
        break;
      case "type_approvisionnement":
        setProduct({ ...product, type_approvisionnement: e.target.value });
        break;
      case "category_id":
        setProduct({ ...product, category_id: e.target.value });
        break;
      case "product_supplier_id":
        setProduct({ ...product, product_supplier_id: e.target.value });
        break;
    }
  };

  useEffect(() => {
    Promise.all([
      http_client(Storage.getStorage("auth").token).get(
        companiesStore.currentCompany
          ? `${GET_CATEGORIES_URL}?id=${companiesStore?.currentCompany?.id}`
          : GET_CATEGORIES_URL
      ),
      http_client(Storage.getStorage("auth").token).get(GET_PRODUCT_TYPE_URL),
      http_client(Storage.getStorage("auth").token).get(
        companiesStore.currentCompany
          ? `${GET_PRODUCT_SUPPLIER_URL}?id=${companiesStore?.currentCompany?.id}`
          : GET_PRODUCT_SUPPLIER_URL
      ),
      http_client(Storage.getStorage("auth").token).get(
        `${GET_PRODUIT_URL}/${id}`
      ),
    ])
      .then((res: any) => {
        setLoading(false);

        setCategories(res[0].data);
        setProductTypes(res[1].data);
        setProductSuppliers(res[2].data);
        setProduct(res[3].data);

        setUrlImg(DefaultProductImage);
        if ((res[3].data as Product).image) {
          setUrlImg(`${API_STORAGE_URL}/${res[3].data.image}`);
        }
        setCurrentType((res[3].data as Product).product_type?.name || "");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  return (
    <DashboardLayout
      title="Gestion des produits"
      headerContent={
        <>
          <div className="ml-4 w-[68%] font-bold text-2xl text-[#ac3265] flex items-center justify-between">
            {!loading && (
              <>
                <span>
                  | Edition du produit{" "}
                  <span className="text-gray-700">{product.name}</span>
                </span>
                <Link
                  to="/products/create"
                  className="text-white px-4 py-2 rounded-md bg-green-600 text-sm"
                >
                  Ajouter un nouveau produit
                </Link>
              </>
            )}
          </div>
        </>
      }
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8"
      >
        {!loading ? (
          <div
            className={`max-w-5xl bg-white p-5 rounded-md mx-auto relative overflow-hidden`}
          >
            <Link
              to={`/products/show/${product.id}/${product.name
                ?.split(" ")
                .join("-")
                .toLowerCase()}`}
              className=" absolute top-0 right-0 px-4 py-2 bg-green-400 text-white"
            >
              <FaEye size={17} />
            </Link>
            <div className="flex space-x-4 mb-4">
              <label
                htmlFor="image"
                className="w-[250px] h-[200px] cursor-pointer bg-slate-200 rounded-sm relative overflow-hidden"
              >
                <img
                  src={urlImg}
                  alt="product"
                  className="absolute h-full w-full object-cover"
                />
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
                <label
                  htmlFor="description"
                  className=" inline-block mb-1 text-sm "
                >
                  Description du produit{" "}
                  <span className="text-sm italic">(Optionnel)</span>
                </label>
                <textarea
                  onChange={handleOnchange}
                  name="description"
                  value={product.description || ""}
                  placeholder="Enter your product description here .... "
                  id="description"
                  cols={10}
                  rows={3}
                  className="placeholder:text-gray-300 text-sm w-full ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                >
                  {product.description}
                </textarea>

                <div className="flex items-center justify-between space-x-4 mt-3">
                  <div className="w-1/2">
                    <label
                      htmlFor="name"
                      className=" inline-block mb-1 text-sm"
                    >
                      Nom du produit
                    </label>
                    <input
                      onChange={handleOnchange}
                      value={product.name || ""}
                      name="name"
                      autoFocus
                      required
                      type="text"
                      placeholder="Entrer le nom de votre produit"
                      className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                    />
                  </div>

                  <div className="w-1/2">
                    <label
                      htmlFor="prix_unitaire"
                      className=" inline-block mb-1 text-sm"
                    >
                      Prix unitaire{" "}
                      <span className="text-sm italic">(In FCFA)</span>
                    </label>
                    <input
                      onChange={handleOnchange}
                      value={product.prix_unitaire || ""}
                      name="prix_unitaire"
                      required
                      type="number"
                      placeholder="Entrer le prix unitaire de votre produit"
                      className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className={`flex space-x-4 mb-4 ${
                (product.qte_en_stock || 0) > 0 &&
                "disabled p-2 border-4 bg-slate-50 select-none"
              }`}
            >
              <div className="w-1/2">
                <label
                  htmlFor="product_type_id"
                  className=" inline-block mb-1 text-sm"
                >
                  Type de produit
                </label>
                <select
                  required
                  onChange={handleOnchange}
                  name="product_type_id"
                  value={product.product_type_id || ""}
                  id="product_type_id"
                  className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                >
                  <option value="" className="text-gray-300">
                    -- Sélectionner le type de produit --
                  </option>
                  {productTypes.map((type) => (
                    <option value={type.id} key={type.id}>
                      {type.slug}
                    </option>
                  ))}
                </select>
              </div>

              {currentType &&
                (currentType === "VENDU_PAR_PIECE" ||
                  currentType === "VENDU_PAR_KG") && (
                  <div className="w-1/2">
                    <label
                      htmlFor="poids"
                      className=" inline-block mb-1 text-sm"
                    >
                      Poids <span className="text-sm italic">(Kg,g)</span>
                    </label>
                    <input
                      onChange={handleOnchange}
                      value={product.poids || ""}
                      name="poids"
                      required
                      type="number"
                      placeholder="Entrer le poids du produit"
                      step={0.5}
                      min={0.5}
                      className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                    />
                  </div>
                )}

              {currentType && currentType === "VENDU_PAR_LITRE" && (
                <div className="w-1/2">
                  <label
                    htmlFor="qte_en_litre"
                    className=" inline-block mb-1 text-sm"
                  >
                    Entrer quantité en litre{" "}
                    <span className="text-sm italic">(L,ml)</span>
                  </label>
                  <input
                    onChange={handleOnchange}
                    value={product.qte_en_litre || ""}
                    name="qte_en_litre"
                    required
                    type="number"
                    placeholder="quantité en litre"
                    step={0.5}
                    min={0.5}
                    className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                  />
                </div>
              )}

              {currentType && currentType === "VENDU_PAR_NOMBRE_PAR_CONTENEUR" && (
                <div className="w-1/2">
                  <div className="flex space-x-2">
                    <div className="w-1/2">
                      <label
                        htmlFor="nbre_par_carton"
                        className=" inline-block mb-1 text-sm"
                      >
                        Nombre d'élément par conteneur
                      </label>
                      <input
                        onChange={handleOnchange}
                        value={product.nbre_par_carton || ""}
                        name="nbre_par_carton"
                        required
                        type="number"
                        placeholder="Combien d'éléments ?"
                        step={1}
                        min={1}
                        className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                      />
                    </div>

                    <div className="w-1/2">
                      <label
                        htmlFor="poids"
                        className=" inline-block mb-1 text-sm"
                      >
                        Poids <span className="text-sm italic">(Kg,g)</span>
                      </label>
                      <input
                        onChange={handleOnchange}
                        value={product.poids || ""}
                        name="poids"
                        required
                        type="number"
                        placeholder="Entrer le poids du produit"
                        step={0.5}
                        min={0.5}
                        className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label
                  htmlFor="qte_stock_alert"
                  className=" inline-block mb-1 text-sm"
                >
                  Quantité stock d’alerte
                </label>
                <input
                  onChange={handleOnchange}
                  value={product.qte_stock_alert || ""}
                  name="qte_stock_alert"
                  required
                  type="number"
                  placeholder="Entrer la quantité d’alerte"
                  className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                />
              </div>

              <div className="w-1/2">
                <label htmlFor="name" className=" inline-block mb-1 text-sm">
                  Type d’approvisionnement{" "}
                  <span className="text-sm italic">
                    (Par pièce, carton, sac, bidon ...)
                  </span>
                </label>
                <input
                  onChange={handleOnchange}
                  value={product.type_approvisionnement || ""}
                  name="type_approvisionnement"
                  required
                  type="text"
                  placeholder="En quoi  vous approvisionnez- vous ? (Sac, Carton, Seau, Bidon …)"
                  className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                />
              </div>
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label
                  htmlFor="category_id"
                  className=" inline-block mb-1 text-sm"
                >
                  Catégorie
                </label>
                <select
                  required
                  onChange={handleOnchange}
                  value={product.category_id || ""}
                  name="category_id"
                  id="category_id"
                  className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                >
                  <option value="" className="text-gray-300">
                    -- Sélectionner la catégorie du produits --
                  </option>
                  {categories.map((categoriy) => (
                    <option value={categoriy.id} key={categoriy.id}>
                      {categoriy.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-1/2">
                <label
                  htmlFor="product_supplier_id"
                  className=" inline-block mb-1 text-sm"
                >
                  Fournisseur
                </label>
                <select
                  required
                  onChange={handleOnchange}
                  value={product.product_supplier_id || ""}
                  name="product_supplier_id"
                  id="product_supplier_id"
                  className="placeholder:text-gray-300 w-full text-sm ring-0 focus:ring-4 ring-gray-700 bg-slate-100 border-none outline-none placeholder:italic rounded-md focus:ring-gray-500"
                >
                  <option value="" className="text-gray-300">
                    -- Sélectionner le fournisseur du produit --
                  </option>
                  {productSuppliers.map((supplier) => (
                    <option value={supplier.id} key={supplier.id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                className={`px-4 ${
                  sending && "disabled"
                } py-2 bg-[#ac3265] text-white rounded-md flex justify-center items-center min-w-[200px] min-h-[35px]`}
              >
                {sending ? (
                  <Loader className="text-lg" />
                ) : (
                  "Mettre à jour le produit"
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="h-[400px] flex justify-center items-center text-8xl text-[#5c3652]">
            <Loader />
          </div>
        )}
      </form>
    </DashboardLayout>
  );
};

export default ProductEdit;
