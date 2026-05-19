import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type trigger = {
  add: boolean;
  deleteModel: boolean;
  archiveModel: boolean;
  archiveAction: "archive" | "unarchive";
  selectedId: string;
  selectedStudyName: string;
  copyModel: boolean;
  isAddingQuestion: boolean;
  qType: string;
  qTypeList: Record<string, string>[];
  isExitLinksModalOpen: boolean;
  isCloseSurvey: boolean;
};

const initialState: trigger = {
  add: false,
  deleteModel: false,
  archiveModel: false,
  archiveAction: "archive",
  selectedId: "",
  selectedStudyName: "",
  copyModel: false,
  isAddingQuestion: false,
  qType: "text-only",
  qTypeList: [],
  isExitLinksModalOpen: false,
  isCloseSurvey: false,
};

const TriggerSlice = createSlice({
  name: "trigger",
  initialState,
  reducers: {
    setTrigger: (state, action: PayloadAction<boolean>) => {
      state.add = action.payload;
      return state;
    },
    resetTrigger: (state) => {
      state.add = false;
      return state;
    },
    setDeleteModel: (state, action: PayloadAction<boolean>) => {
      state.deleteModel = action.payload;
      return state;
    },
    setArchiveModel: (state, action: PayloadAction<boolean>) => {
      state.archiveModel = action.payload;
      return state;
    },
    setArchiveAction: (state, action: PayloadAction<"archive" | "unarchive">) => {
      state.archiveAction = action.payload;
      return state;
    },
    setSelectedId: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
      return state;
    },
    setCopyModel: (state, action: PayloadAction<boolean>) => {
      state.copyModel = action.payload;
      return state;
    },
    setSelectedStudyName: (state, action: PayloadAction<string>) => {
      state.selectedStudyName = action.payload;
      return state;
    },
    setIsAddingQuestion: (state, action: PayloadAction<boolean>) => {
      state.isAddingQuestion = action.payload;
      return state;
    },
    setQType: (state, action: PayloadAction<string>) => {
      state.qType = action.payload;
      return state;
    },
    setQTypeList: (state, action: PayloadAction<Record<string, string>[]>) => {
      state.qTypeList = action.payload;
      return state;
    },
    setIsExitLinksModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isExitLinksModalOpen = action.payload;
    },
    setIsCloseSurvey: (state, action: PayloadAction<boolean>) => {
      state.isCloseSurvey = action.payload;
    },
  },
});

export const {
  setTrigger,
  resetTrigger,
  setDeleteModel,
  setArchiveModel,
  setArchiveAction,
  setSelectedId,
  setCopyModel,
  setSelectedStudyName,
  setIsAddingQuestion,
  setQType,
  setQTypeList,
  setIsExitLinksModalOpen,
  setIsCloseSurvey
} = TriggerSlice.actions;
export default TriggerSlice.reducer;
