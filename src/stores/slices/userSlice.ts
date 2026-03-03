import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { User } from "@/types/User";
import { getUser } from "@/features/auth/services/userActions";

type UserState = {
  user: User | null;
  error: string | null;
};

const initialState: UserState = {
  user: null,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk<
  User | null,
  void,
  { rejectValue: string }
>("user/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const profile = await getUser();
    if (!profile) return null;
    return { id: profile.id, username: profile.username };
  } catch {
    return rejectWithValue("Failed to load user profile");
  }
});

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload ?? "Unknown error";
      });
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
