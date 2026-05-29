import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface StudyState {
  studyID: string | null;
  hasQuestionnaire: number;
  launch: number;
  name: string;
  output: number;
  link: number,
  closed: number,
  Studys: any[];
  FilterStudys: any[];
}

const data = localStorage.getItem("study");

const initialState: StudyState = data
  ? {
      ...JSON.parse(data),
      Studys: [],
      FilterStudys: [],
    }
  : {
      studyID: null,
      hasQuestionnaire: 0,
      launch: 0,
      name: "",
      output: 0,
      link:0,
      closed: 0,
      Studys: [],
      FilterStudys: [],
    };

const studySlice = createSlice({
  name: "study",
  initialState,
  reducers: {
    setStudyInfo(
      state,
      action: PayloadAction<{
        studyID: string | null;
        hasQuestionnaire: number;
        launch: number;
        name: string;
        output: number;
        link: number;
        closed: number
      }>
    ) {
      state.studyID = action.payload.studyID;
      state.hasQuestionnaire = Number(action.payload.hasQuestionnaire);
      state.launch = Number(action.payload.launch);
      state.name = action.payload.name;
      state.output = Number(action.payload.output);
      state.link = Number(action.payload.link)
      state.closed = Number(action.payload.closed)
      localStorage.setItem(
        "study",
        JSON.stringify({
          studyID: action.payload.studyID,
          hasQuestionnaire: Number(action.payload.hasQuestionnaire),
          launch: Number(action.payload.launch),
          name: action.payload.name,
          output: Number(action.payload.output),
          link: Number(action.payload.link),
          closed: Number(action.payload.closed)
        })
      );
      return state;
    },
    resetStudyInfo: (state) => {
      state.studyID = null;
      state.hasQuestionnaire = 0;
      state.launch = 0;
      state.name = "";
      state.closed = 0
      localStorage.removeItem("study")
      return state;
    },
    setHasQuestionnaire: (state, action: PayloadAction<number>) => {
      state.hasQuestionnaire = Number(action.payload);
      localStorage.setItem(
        "study",
        JSON.stringify({
          studyID: state.studyID,
          hasQuestionnaire: Number(action.payload),
          launch: Number(state.launch),
          name: state.name,
          output: Number(state.output),
          link: Number(state.link),
          closed: Number(state.closed),
        })
      );
      return state;
    },
    setStudys: (state, payload: PayloadAction<any[]>) => {
      state.Studys = payload.payload;
      return state;
    },
    setFilterStudys: (state, payload: PayloadAction<any[]>) => {
      state.FilterStudys = payload.payload;
      return state;
    },
  },
});

export const { setStudyInfo, resetStudyInfo, setHasQuestionnaire, setStudys, setFilterStudys } =
  studySlice.actions;
export default studySlice.reducer;
