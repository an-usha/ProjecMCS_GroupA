import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BACKEND_URL } from "./../../config";
//import { BACKEND_URL } from "../../config";

const initialState = {
  data: null,
  loading: null,
  error: false,
};

export const postLoginData = createAsyncThunk(
  "auth/postLoginData",
  async (payload) => {
    try {
      const url = `${BACKEND_URL}/auth/adlogin`;
      const { data } = await axios.post(url, payload);
      return data;
    } catch (error) {
      return error;
    }
  }
);

export const postLogoutData= createAsyncThunk(
    "auth/postLogoutData",
   async (payload)=>{
    try{
    const url = `${BACKEND_URL}/auth/logout`;
    const {data} =await axios.post(url,payload);
    return data;
    }catch (error) {
      return error;
    }
   } 
);

const authSlice = createSlice({
  reducerPath: "authReducerPath",
  name: "auth",
  initialState: {
    isLoggedIn: false,
    data: null,
    loading: false,
    error: false,
    userInfo: {
      userName: "",
      solId: "",
      email: "",
      departmentName: "",
      token: "",
      photoId:"",
      image:"",
      domainName: "",
      solDesc: "",
      designation: "",
    },
  },
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
    },
    setUser: (state, action) => {
      state.isLoggedIn=true
      state.userInfo = action.payload;
    },

    logout: (state) => {
      console.log("called logout function");
      state.isLoggedIn = false;
      state.data = null;
      state.userInfo = null;
    },
  },
  extraReducers: {
    [postLoginData.pending]: (state) => {
      state.loading = true;
    },
    [postLoginData.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = action.payload;
    },
    [postLoginData.rejected]: (state, action) => {
      state.loading = false;
      state.error = true;
    },
    [postLogoutData.pending]: (state) => {
      state.loading = true;
    },
    [postLogoutData.fulfilled]: (state, action) => {
      state.loading = false;
      state.data = null
      state.isLoggedIn = false
      state.userInfo = null

      ;
    },
    [postLogoutData.rejected]: (state, action) => {
      state.loading = false;
      state.error = true;
      state.isLoggedIn = false
      state.userInfo = null


    },
  },
});

export const { login, logout, setUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
