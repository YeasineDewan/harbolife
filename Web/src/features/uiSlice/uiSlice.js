import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  darkMode: false,
  searchTerm: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { toggleTheme, setSearchTerm } = uiSlice.actions;
export default uiSlice.reducer;
