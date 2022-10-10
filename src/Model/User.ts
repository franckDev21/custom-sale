import Company from "./Company";

export default interface User {
  id ?: string|number,
  photo ?: string,
  firstname ?: string,
  lastname  ?: string,
  email     ?: string,
  email_verified_at ?: string,
  password  ?: string,
  role      ?: string,
  as_company   ?: boolean,
  company_id   ?: number,
  created_at ?: string,
  updated_at ?: string,
  company ?: Company,
  active ?: boolean
}