import User from "../Model/User"
import Storage from "./Storage"

class UserService {

  getUser():User{
    return Storage.getStorage('auth').user
  }

}

export default new UserService()