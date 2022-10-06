
class Storage {

  setStorage(name: string, value: string,isTringify = true):void{
    if(isTringify){
      localStorage.setItem(`${name}`, `${JSON.stringify(value)}`);
    }else{
      localStorage.setItem(`${name}`, `${value}`);
    }
  }

  getStorage(name: string,isParse = true){
    let value = localStorage.getItem(`${name}`);
    if(value){
      return isParse ? JSON.parse(value) : value
    }
    return null
  }

  removeStorage(name: string){
    let value = localStorage.getItem(`${name}`);
    if(value){
      localStorage.removeItem(`${name}`);
    }
  }

}

export default new Storage()