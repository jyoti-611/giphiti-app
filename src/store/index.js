import { configureStore } from "@reduxjs/toolkit";
import page1 from "./page1";
import page2 from "./page2";
const store = configureStore({
  reducer: {
    page1,
    page2,
  },
});
export default store;
