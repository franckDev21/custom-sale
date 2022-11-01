import Customer from "./Customer";
import Invoice from "./Invoice";
import OrderProduct from "./OrderProduct";
import User from "./User";

export default interface Order {
  id ?: string,
  reference ?: string,
  quantite ?: string,
  cout ?: string,
  etat ?: string,
  customer_id ?: string,
  user_id ?: string,
  desc ?: string,
  created_at ?: string,
  updated_at ?: string,
  customer ?: Customer,
  user ?: User,
  invoice ?: Invoice,
  order_products ?: OrderProduct[]
}