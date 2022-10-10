export default interface Company {
  id ?: string|number,
  photo ?: string,
  name ?: string,
  description  ?: string,
  email     ?: string,
  address ?: string,
  country  ?: string,
  city ?: string,
  tel      ?: string,
  number_of_employees   ?: boolean,
  created_at ?: string,
  updated_at ?: string,
}