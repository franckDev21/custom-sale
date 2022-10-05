export default interface User {
  firstName : string,
  lastname  : string,
  email     : string,
  password  : string,
  role      ?: string,
  as_company   ?: boolean,
  company_id   ?: number,
}