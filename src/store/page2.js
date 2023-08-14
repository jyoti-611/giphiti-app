import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page2s: [],
};

export const page2Slice = createSlice({
  name: "page2",
  initialState,
  reducers: {
    setpage2Action: (state, action) => {
      state.page2s = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setpage2Action } = page2Slice.actions;

export default page2Slice.reducer;
