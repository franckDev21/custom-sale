import Company from "./Company";

export default interface User {
  id?: string;
  photo?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  tel?: string;
  email_verified_at?: string;
  password?: string;
  password_confirmation?: string;
  role?: string;
  as_company?: boolean;
  company_id?: number;
  created_at?: string;
  updated_at?: string;
  company?: Company;
  active?: boolean;
  type?: string | null;
  roles?: any;
}
