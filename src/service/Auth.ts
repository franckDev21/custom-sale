import Storage from "./Storage"

class Auth {
  isLogin():boolean{
    let auth = Storage.getStorage('auth')
    return auth ? (auth.token && auth.user) : false
  }

  logout():void{
    Storage.removeStorage('auth')
  }
}

export default new Auth()