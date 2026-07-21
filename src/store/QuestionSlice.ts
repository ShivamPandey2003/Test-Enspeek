import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface QuestionGroup {
  groupID: string;
  groupText: string;
  groupLogic: string;
  qList: any[];
  logicPayload?: Record<string, any>;
  logic2Skip: Record<string, Record<string, string>>;
  getLogicRes: Record<string, any>;
  questionList: any[];
  submitItems: Question[];
  hydratingQuestionIds: string[];
  editingQuestion: Question | null;
}

const initialState: QuestionGroup = {
  groupID: "",
  groupText: "",
  groupLogic: "",
  qList: [],
  logicPayload: {},
  logic2Skip: {},
  getLogicRes: {},
  questionList: [],
  submitItems: [],
  hydratingQuestionIds: [],
  editingQuestion: null,
};

const resetQuestionState = (): QuestionGroup => ({
  groupID: "",
  groupText: "",
  groupLogic: "",
  qList: [],
  logicPayload: {},
  logic2Skip: {},
  getLogicRes: {},
  questionList: [],
  submitItems: [],
  hydratingQuestionIds: [],
  editingQuestion: null,
});

const QuestionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    setQuestionGroup: (_state, action: PayloadAction<QuestionGroup>) => {
      return action.payload;
    },
    resetQuestionGroup: () => resetQuestionState(),
    setLogicPayload: (state, action: PayloadAction<{ logic1: any }>) => {
      state.logicPayload = {
        ...state.logicPayload,
        logic1: action.payload.logic1,
      };
    },
    setLogic2Skip: (
      state,
      action: PayloadAction<{ qID: string; message: Record<string, string> }>
    ) => {
      const { qID, message } = action.payload;
      if (!state.logic2Skip) {
        state.logic2Skip = {};
      }
      state.logic2Skip[qID] = message;
    },
    setGetLogicRes: (
      state,
      action: PayloadAction<{ qID: string; logic: any }>
    ) => {
      state.getLogicRes[action.payload.qID] = action.payload.logic;
    },
    setQuestionList: (state, action: PayloadAction<any[]>) => {
      state.questionList = action.payload;
    },
    setAllSubmitItems: (state, action: PayloadAction<any[]>) => {
      state.submitItems = action.payload;
      return state;
    },
    setHydratingQuestionIds: (state, action: PayloadAction<string[]>) => {
      state.hydratingQuestionIds = action.payload;
    },
    clearHydratingQuestionId: (state, action: PayloadAction<string>) => {
      state.hydratingQuestionIds = state.hydratingQuestionIds.filter(
        (questionId) => questionId !== action.payload
      );
    },
    setSubmitItems: (state, action: PayloadAction<any>) => {
      const data = action.payload;
      const exists = state.submitItems.some((item) => item.qID === data.qID);

      if (exists) {
        state.submitItems = state.submitItems.map((item) =>
          item.qID === data.qID ? data : item
        );
      } else if (Object.keys(data).length > 0) {
        state.submitItems = [...state.submitItems, data];
      }

      state.hydratingQuestionIds = state.hydratingQuestionIds.filter(
        (questionId) => questionId !== data.qID
      );
    },
    setEditingQuestion: (state, action: PayloadAction<Question | null>) => {
      state.editingQuestion = action.payload;
    },
  },
});

export const {
  setQuestionGroup,
  resetQuestionGroup,
  setLogicPayload,
  setLogic2Skip,
  setGetLogicRes,
  setQuestionList,
  setSubmitItems,
  setAllSubmitItems,
  setHydratingQuestionIds,
  clearHydratingQuestionId,
  setEditingQuestion,
} = QuestionSlice.actions;
export default QuestionSlice.reducer;
