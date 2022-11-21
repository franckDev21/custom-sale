import Company from "./Company";
import User from "./User";

export default interface TypeInitialeState {
  user  : User|null,
  token : string|null,
  roles : string[]|null,
  prermissions : string[]|null,
}

export type CompanyProps = {
  currentCompany : Company|null,
  companies : Company[]
}