import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface initialStateT {
  message: string;
  messages: any[];
  followUp: string;
  isTyping: boolean;
  pending: boolean;
  isChatOpen: boolean
}

const localData = localStorage.getItem("chat_history");

const initialState: initialStateT = localData
  ? {
      message: "",
      messages: JSON.parse(localData),
      followUp: "",
      isTyping: false,
      pending: false,
      isChatOpen: true
    }
  : {
      message: "",
      messages: [],
      followUp: "",
      isTyping: false,
      pending: false,
      isChatOpen: true
    };

const ChatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setMessage: (state, payload: PayloadAction<string>) => {
      state.message = payload.payload;
      return state;
    },
    setMessages: (state, payload: PayloadAction<any[]>) => {
      state.messages = payload.payload;
      return state;
    },
    setFollowUp: (state, payload: PayloadAction<string>) => {
      state.followUp = payload.payload;
      return state;
    },
    setIsTyping: (state, payload: PayloadAction<boolean>) => {
      state.isTyping = payload.payload;
      return state;
    },
    setPending: (state, payload: PayloadAction<boolean>) => {
      state.pending = payload.payload;
      return state;
    },
    setChatOpen:(state, payload: PayloadAction<boolean>)=>{
      state.isChatOpen = payload.payload;
      return state;
    }
  },
});

export const { setFollowUp, setIsTyping, setMessages, setMessage, setPending, setChatOpen } =
  ChatSlice.actions;

export default ChatSlice.reducer;
