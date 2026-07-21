import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface initialStateT {
  message: string;
  messages: any[];
  followUp: string;
  isTyping: boolean;
  pending: boolean;
  pendingSuggestionCount: number;
  hasLoadedHistory: boolean;
  hasMoreHistory: boolean;
  historyContextKey: string;
  historyPage: number;
  isHistoryLoading: boolean;
  isOlderHistoryLoading: boolean;
  isChatOpen: boolean
}

const initialState: initialStateT = {
  message: "",
  messages: [],
  followUp: "",
  isTyping: false,
  pending: false,
  pendingSuggestionCount: 0,
  hasLoadedHistory: false,
  hasMoreHistory: false,
  historyContextKey: "",
  historyPage: 0,
  isHistoryLoading: false,
  isOlderHistoryLoading: false,
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
    resetChatHistory: (state, payload: PayloadAction<string>) => {
      state.messages = [];
      state.pendingSuggestionCount = 0;
      state.hasLoadedHistory = false;
      state.hasMoreHistory = false;
      state.historyContextKey = payload.payload;
      state.historyPage = 0;
      state.isHistoryLoading = true;
      state.isOlderHistoryLoading = false;
      return state;
    },
    startChatHistoryLoad: (state, payload: PayloadAction<string>) => {
      if (state.historyContextKey !== payload.payload) return state;

      state.isHistoryLoading = true;
      return state;
    },
    startOlderChatHistoryLoad: (state, payload: PayloadAction<string>) => {
      if (state.historyContextKey !== payload.payload) return state;

      state.isOlderHistoryLoading = true;
      return state;
    },
    setInitialChatHistory: (
      state,
      payload: PayloadAction<{
        contextKey: string;
        hasMore: boolean;
        messages: any[];
        page: number;
      }>
    ) => {
      if (state.historyContextKey !== payload.payload.contextKey) return state;

      state.messages = payload.payload.messages;
      state.hasLoadedHistory = true;
      state.hasMoreHistory = payload.payload.hasMore;
      state.historyPage = payload.payload.page;
      state.isHistoryLoading = false;
      return state;
    },
    prependChatHistory: (
      state,
      payload: PayloadAction<{
        contextKey: string;
        hasMore: boolean;
        messages: any[];
        page: number;
      }>
    ) => {
      if (state.historyContextKey !== payload.payload.contextKey) return state;

      state.messages = [...payload.payload.messages, ...state.messages];
      state.hasMoreHistory = payload.payload.hasMore;
      state.historyPage = payload.payload.page;
      state.isOlderHistoryLoading = false;
      return state;
    },
    finishChatHistoryLoad: (state, payload: PayloadAction<string>) => {
      if (state.historyContextKey !== payload.payload) return state;

      state.hasLoadedHistory = true;
      state.isHistoryLoading = false;
      state.isOlderHistoryLoading = false;
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

export const { clearPendingSuggestions, decrementPendingSuggestion, finishChatHistoryLoad, incrementPendingSuggestion, prependChatHistory, resetChatHistory, setFollowUp, setInitialChatHistory, setIsTyping, setMessages, setMessage, setPending, setChatOpen, startChatHistoryLoad, startOlderChatHistoryLoad } =
  ChatSlice.actions;

export default ChatSlice.reducer;
