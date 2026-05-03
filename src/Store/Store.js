import { configureStore } from "@reduxjs/toolkit";
import { ApiSlice } from "../Feature/ApiSlice";
import { WishSlice } from "../Feature/Whishlist";


export const store=configureStore({
reducer:{
    [ApiSlice.reducerPath]:ApiSlice.reducer,
    wish:WishSlice.reducer
},
middleware:(gdM)=>gdM().concat(ApiSlice.middleware)
})
