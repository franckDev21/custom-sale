import Product from "./Product";
import User from "./User";

export default interface Procurement {
  id ?: string,
  quantite ?: string,
  prix_achat ?: string|number,
  is_unite  ?: string,
  product_id  ?: string,
  user_id  ?: string,
  created_at ?: string,
  product ?: Product,
  user ?: User,
  updated_at ?: string,
}