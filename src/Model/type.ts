import User from "./User";

export default interface TypeInitialeState {
  user  : User|null,
  token : string|null,
  roles : string[]|null,
  prermissions : string[]|null,
}