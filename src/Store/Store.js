import { configureStore } from "@reduxjs/toolkit";
import { ApiSlice } from "../Feature/ApiSlice";


export const store=configureStore({
reducer:{
    [ApiSlice.reducerPath]:ApiSlice.reducer
},
middleware:(gdM)=>gdM().concat(ApiSlice.middleware)
})
