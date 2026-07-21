import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const encrypt = (data: any): string => btoa(JSON.stringify(data));

// Decode the persisted user, tolerating a corrupt/tampered `localStorage`
// value. A bad payload previously threw during store initialization and
// white-screened the whole app; now we fall back to the default (logged-out)
// state instead.
const decrypt = (data: string): User | null => {
  try {
    return JSON.parse(atob(data)) as User;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const saved = localStorage.getItem("user");
const savedUser = saved ? decrypt(saved) : null;

const initialState: User = savedUser ?? {
  apiToken: "",
  email: "",
  userId: "",
  firstName: "",
  lastName: "",
  loginType: "",
  userType: "",
  planType: undefined,
  grp: "",
  suggest_login_password: 0,
  updated_on: "",
  createdAt: "",
  updatedAt: "",
  enabled: 0,
  isActive: false,
  isApproved: false,
  planInfoSynced: false,
  createdStudies: 0,
  allowedStudies: 0,
  usedPrompt: 0,
  allowedPrompt: 0,
  createdQuestions: 0,
  allowedQuestions: 0,
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
        email: "",
        userId: "",
        firstName: "",
        lastName: "",
        loginType: "",
        userType: "",
        planType: undefined,
        grp: "",
        suggest_login_password: 0,
        updated_on: "",
        createdAt: "",
        updatedAt: "",
        enabled: 0,
        isActive: false,
        isApproved: false,
        planInfoSynced: false,
        createdStudies: 0,
        allowedStudies: 0,
        usedPrompt: 0,
        allowedPrompt: 0,
        createdQuestions: 0,
        allowedQuestions: 0,
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
