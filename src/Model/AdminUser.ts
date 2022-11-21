import Company from "./Company";
import User from "./User";

export default interface AdminUser {
  id ?: string,
  photo ?: string,
  firstname ?: string,
  lastname  ?: string,
  email     ?: string,
  tel       ?: string,
  email_verified_at ?: string,
  password  ?: string,
  password_confirmation ?: string,
  created_at ?: string,
  updated_at ?: string,
  companies ?: Company[],
  users ?: User[],
  active ?: boolean,
  list_compamie_ids ?: any
}