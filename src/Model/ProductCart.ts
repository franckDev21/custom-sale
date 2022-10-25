import Category from "./Category";
import ProductSupplier from "./ProductSupplier";
import ProductType from "./ProductType";

export default interface ProductCart {
  id ?: string,
  name ?: string,
  qte_en_stock ?: string|number,
  qte_stock_alert ?: string|number ,
  max ?: string|number,
  qte ?: string|number|null,
  prix_de_vente ?: string|number|null,
  type_de_vente ?: string|number|null,
  is_stock ?: boolean,
  prix_unitaire ?: string|number,
  image     ?: any,
  poids ?: string|number|null,
  description ?: string,
  type_approvisionnement ?: string,
  unite_restante ?: string|number,
  qte_en_litre ?: string|number|null,
  nbre_par_carton ?: string|number|null,
  category_id ?: string|number,
  product_supplier_id ?: string|number,
  product_type_id ?: string|number,
  created_at ?: string,
  updated_at ?: string,
  product_type ?: ProductType,
  product_supplier ?: ProductSupplier,
  category ?: Category,
}
