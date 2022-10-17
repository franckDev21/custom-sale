export default interface Customer {
  id ?: string,
  firstname ?: string,
  lastname ?: string,
  company_id ?: number,
  email     ?: string,
  address ?: string,
  country  ?: string,
  city ?: string,
  tel      ?: string|null,
  created_at ?: string,
  updated_at ?: string,
}