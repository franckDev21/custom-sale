import Category from "./Category";
import ProductSupplier from "./ProductSupplier";
import ProductType from "./ProductType";

export default interface Product {
  id ?: string,
  name ?: string,
  qte_en_stock ?: string|number,
  prix_unitaire ?: string|number,
  image     ?: string,
  poids ?: number,
  type_approvisionnement ?: string,
  unite_restante ?: string|number,
  qte_en_litre ?: string|number,
  nbre_par_carton ?: string|number,
  category_id ?: string|number,
  product_supplier_id ?: string|number,
  product_type_id ?: string|number,
  created_at ?: string,
  updated_at ?: string,
  product_type ?: ProductType,
  product_supplier ?: ProductSupplier,
  category ?: Category,
}
