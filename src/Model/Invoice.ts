import Company from "./Company";
import Customer from "./Customer";
import Order from "./Order";

export default interface Invoice {
  id ?: string,

  customer ?: Customer,
  order ?: Order,

  customer_id ?: string,
  company_id ?: string,
  order_id ?: string,
  reference ?: string,
  
  as_tva ?: number|boolean,
  as_ir ?: number|boolean,

  company ?: Company,

  day ?: string,

  year ?: string,

  created_at ?: string,
  updated_at ?: string,
}