import { createSlice } from "@reduxjs/toolkit";

const initialState={
   favorites:JSON.parse(localStorage.getItem('favourites'))||[]
}
export const WishSlice=createSlice({
 name:'wishlist',
 initialState,
 reducers:{
 toggleFavourite: (state, action) => {
    const exists = state.favorites.find(item => item.id === action.payload.id || item.id === action.payload);

    if (exists) {
        state.favorites = state.favorites.filter(item => item.id !== (action.payload.id || action.payload));
    } else {
        state.favorites = [...state.favorites, action.payload];
    }
    
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
},
    removeItemFavourite:(state,action)=>{
    const update=state.favorites.filter(c=>c.id!==action.payload.id)
    state.favorites=update
    localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    clearFavouriteCart: (state) => {
    state.favorites = [];
    localStorage.removeItem('favorites');
},
 }
})
export const {toggleFavourite,removeItemFavourite,clearFavouriteCart}=WishSlice.actions