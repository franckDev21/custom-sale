import Order from "./Order";
import User from "./User";

export default interface Cash {
  id ?: string,
  user_id ?: string,
  order_id ?: string,
  montant ?: string,
  type ?: string,
  motif ?: string,
  user ?: User,
  order ?: Order,
  created_at ?: string,
  updated_at ?: string
}