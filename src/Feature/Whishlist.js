import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favorites: JSON.parse(localStorage.getItem('wishlist_items')) || []
};

export const WishSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleFavourite: (state, action) => {
      const id = action.payload.id || action.payload;
      const index = state.favorites.findIndex(item => item.id === id);

      if (index !== -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(action.payload);
      }
      
      localStorage.setItem('wishlist_items', JSON.stringify(state.favorites));
    },

    removeItemFavourite: (state, action) => {
      const id = action.payload.id ?? action.payload;
      state.favorites = state.favorites.filter(item => item.id !== id);
      localStorage.setItem('wishlist_items', JSON.stringify(state.favorites));
    },

    clearFavouriteCart: (state) => {
      state.favorites = [];
      localStorage.removeItem('wishlist_items');
    },
  }
});

export const { toggleFavourite, removeItemFavourite, clearFavouriteCart } = WishSlice.actions;