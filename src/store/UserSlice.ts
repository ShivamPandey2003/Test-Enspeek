import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const encrypt = (data: any): string => btoa(JSON.stringify(data));
const decrypt = (data: string): User => JSON.parse(atob(data));

const saved = localStorage.getItem("user");

const initialState: User = saved ? decrypt(saved) : {
  apiToken: "",
  firstName: "",
  lastName: "",
  userType: "",
  grp: "",
  suggest_login_password: 0,
  updated_on: "",
  enabled: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    Login: (state, action: PayloadAction<User>) => {
      state = action.payload;
      localStorage.setItem("user", encrypt(state));
      return state;
    },
    Logout: () => {
      localStorage.removeItem("user");
      return {
        apiToken: "",
        firstName: "",
        lastName: "",
        userType: "",
        grp: "",
        suggest_login_password: 0,
        updated_on: "",
        enabled: 0,
      };
    },
    SyncUserInfo: (state, action: PayloadAction<Partial<User>>) => {
      const nextState = {
        ...state,
        ...action.payload,
      };
      localStorage.setItem("user", encrypt(nextState));
      return nextState;
    },
  },
});

export const { Login, Logout, SyncUserInfo } = userSlice.actions;
export default userSlice.reducer;
