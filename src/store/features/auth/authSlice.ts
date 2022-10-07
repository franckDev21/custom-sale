import { createSlice } from "@reduxjs/toolkit";
import User from "../../../Model/User";

interface TypeInitialeState {
  user  : User|null,
  token : string|null
}
const initialState: TypeInitialeState = {
  user : null,
  token : null
}

const authSlice = createSlice({
  name : 'auth',
  initialState,
  reducers : {
    setAuth : (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },

    logout : (state) => {
      state.user = null
      state.token = null
    }
  }
})

export const { setAuth, logout } = authSlice.actions

export default authSlice;