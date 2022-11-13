import { createSlice } from "@reduxjs/toolkit";
import TypeInitialeState from "../../../Model/type";

const initialState: TypeInitialeState = {
  user : null,
  token : null,
  roles : null,
  prermissions : null
}

const authSlice = createSlice({
  name : 'auth',
  initialState,
  reducers : {
    setAuth : (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.roles = action.payload.roles
      state.prermissions = action.payload.prermissions
    },

    logout : (state) => {
      state.user = null
      state.token = null
    }
  }
})

export const { setAuth, logout } = authSlice.actions

export default authSlice;