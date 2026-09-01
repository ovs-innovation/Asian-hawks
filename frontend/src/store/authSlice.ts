import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "recruiter" | "hr_manager" | "company" | "candidate" | "moderator";
  avatar?: string;
  headline?: string;
  location?: string;
  profileCompletion?: number;
  company?: { _id: string; name: string; slug: string } | string | null;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
};

const initialState: AuthState = { user: null, token: null, hydrated: false };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.hydrated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("northline_token", action.payload.token);
        localStorage.setItem("northline_user", JSON.stringify(action.payload.user));
      }
    },
    hydrate(state) {
      if (typeof window === "undefined") return;
      try {
        const token = localStorage.getItem("northline_token");
        const raw = localStorage.getItem("northline_user");
        state.token = token;
        state.user = raw ? JSON.parse(raw) : null;
      } catch {
        state.token = null;
        state.user = null;
      } finally {
        state.hydrated = true;
      }
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.hydrated = true;
      if (typeof window !== "undefined") {
        localStorage.removeItem("northline_token");
        localStorage.removeItem("northline_user");
      }
    },
  },
});

export const { setCredentials, hydrate, logout } = authSlice.actions;
export default authSlice.reducer;
