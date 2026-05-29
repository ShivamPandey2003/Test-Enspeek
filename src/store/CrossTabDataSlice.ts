import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const localData = localStorage.getItem("BannerPoniterList");

const initialState: CrossTabDataSliceState = localData
  ? {
      Banners: JSON.parse(localData),
      BannersAll: JSON.parse(localData),
      optsData: {},
      varsData: {},
      LogicData: {},
      tableData: [],
      BannerPointer: [],
    }
  : {
      Banners: [],
      BannersAll: [],
      optsData: {},
      varsData: {},
      LogicData: {},
      tableData: [],
      BannerPointer: [],
    };

const CrossTabDataSlice = createSlice({
  name: "CrossTabData",
  initialState,
  reducers: {
    setBanners: (state, action: PayloadAction<Banner[]>) => {
      state.Banners = action.payload;
    },
    setBannersAll: (state, action: PayloadAction<Banner[]>) => {
      state.BannersAll = action.payload;
    },
    setBannerPointer: (state, action: PayloadAction<BannerPoint[]>) => {
      state.BannerPointer = action.payload;
    },
    setOptsData: (
      state,
      action: PayloadAction<{ key: string; data: Record<any, any> }>
    ) => {
      state.optsData = {
        ...state.optsData,
        [action.payload.key]: action.payload.data,
      };
      return state;
    },
    setVarsData: (state, action: PayloadAction<Record<string, any>>) => {
      state.varsData = action.payload;
      return state;
    },
    setLogicData: (state, action: PayloadAction<Record<any, any>>) => {
      state.LogicData = { ...state.LogicData, ...action.payload };
      return state;
    },
    resetLogicData: (state) => {
      state.LogicData = {};
      return state;
    },
    setTableData: (state, payload: PayloadAction<BannerTable[]>) => {
      state.tableData = payload.payload;
      return state;
    },
    resetTableData: (state) => {
      state.tableData = [];
      return state;
    },
  },
});

export const {
  setBanners,
  setBannerPointer,
  setOptsData,
  setVarsData,
  setLogicData,
  resetLogicData,
  setTableData,
  resetTableData,
  setBannersAll,
} = CrossTabDataSlice.actions;
export default CrossTabDataSlice.reducer;
