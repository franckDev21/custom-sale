import axios from "axios";
import Storage from "../service/Storage";

export default axios.create({
  baseURL : 'http://localhost:8000/api/v1/'
});

export const http_client = (token: string) =>  axios.create({
  baseURL : 'http://localhost:8000/api/v1/',
  headers : {
    'Authorization': `Bearer ${token}`
  }
})