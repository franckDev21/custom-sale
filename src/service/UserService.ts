import TypeInitialeState from "../Model/type"
import User from "../Model/User"
import Storage from "./Storage"

class UserService {

  getUser():User{
    return Storage.getStorage('auth').user
  }

  getAuth(): TypeInitialeState{
    return Storage.getStorage('auth')
  }

}

export default new UserService()