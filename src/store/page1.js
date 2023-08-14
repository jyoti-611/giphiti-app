import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  page1s: [],
};

export const page1Slice = createSlice({
  name: "page1",
  initialState,
  reducers: {
    setpage1Action: (state, action) => {
      state.page1s = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setpage1Action } = page1Slice.actions;

export default page1Slice.reducer;
