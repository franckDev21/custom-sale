import { createSlice } from "@reduxjs/toolkit";
import { CompanyProps } from "../../../Model/type";

const initialState: CompanyProps = {
  currentCompany : null,
  companies : []
}

const CompanySlice = createSlice({
  name : 'auth',
  initialState,
  reducers : {
    setCompanies : (state, action) => {
      state.companies = action.payload
    },

    setCurrentCompany : (state, action) => {
      state.currentCompany = action.payload
    },

    switchToAdmin : (state) => {
      state.companies = []
      state.currentCompany = null
    }
  }
})

export const { setCompanies, setCurrentCompany, switchToAdmin } = CompanySlice.actions

export default CompanySlice;