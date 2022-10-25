import Order from "./Order";
import Product from "./Product";

export default interface OrderProduct {
  id ?: string,
  order_id ?: string,
  product_id ?: string,
  qte ?: string,
  type_de_vente ?: string,
  prix_de_vente ?: string,
  created_at ?: string,
  updated_at ?: string,
  order ?: Order,
  product ?: Product
}