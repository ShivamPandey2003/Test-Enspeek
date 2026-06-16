import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface initialStateT {
  message: string;
  messages: any[];
  followUp: string;
  isTyping: boolean;
  pending: boolean;
  pendingSuggestionCount: number;
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
      pendingSuggestionCount: 0,
      isChatOpen: true
    }
  : {
      message: "",
      messages: [],
      followUp: "",
      isTyping: false,
      pending: false,
      pendingSuggestionCount: 0,
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
    incrementPendingSuggestion: (state) => {
      state.pendingSuggestionCount += 1;
      return state;
    },
    decrementPendingSuggestion: (state) => {
      state.pendingSuggestionCount = Math.max(0, state.pendingSuggestionCount - 1);
      return state;
    },
    clearPendingSuggestions: (state) => {
      state.pendingSuggestionCount = 0;
      return state;
    },
    setChatOpen:(state, payload: PayloadAction<boolean>)=>{
      state.isChatOpen = payload.payload;
      return state;
    }
  },
});

export const { clearPendingSuggestions, decrementPendingSuggestion, incrementPendingSuggestion, setFollowUp, setIsTyping, setMessages, setMessage, setPending, setChatOpen } =
  ChatSlice.actions;

export default ChatSlice.reducer;
