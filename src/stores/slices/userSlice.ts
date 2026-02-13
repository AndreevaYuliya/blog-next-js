import { createSlice } from "@reduxjs/toolkit";

import { User } from "@/types/User";

const initialState: { user: User | null } = {
  user: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = { ...action.payload };
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
