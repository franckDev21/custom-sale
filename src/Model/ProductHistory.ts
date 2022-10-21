import Product from "./Product";
import User from "./User";

export default interface ProductHistory {
  id ?: string,
  quantite ?: string,
  type ?: string,
  motif  ?: string,
  old_state_stock  ?: string,
  is_unite  ?: string,
  product_id  ?: string,
  user_id  ?: string,
  created_at ?: string,
  product ?: Product,
  user ?: User,
  updated_at ?: string,
}