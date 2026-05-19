import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState:filterSliceType = {
    FilterList: [],
    ReportFilterList: [],
    tableQList: [],
    selected:"",
    fliterReportData: [],
    side_by_side: "0"
}

const FilterSlice = createSlice({
    name:'filters',
    initialState,
    reducers:{
        setFilterList:(state, payload:PayloadAction<FilterList[]>)=>{
            state.FilterList = payload.payload
            return state
        },
        setReportFilterList:(state, payload:PayloadAction<FilterItem[]>)=>{
            state.ReportFilterList = payload.payload
            return state
        },
        setTableQList: (state, payload:PayloadAction<string[]>)=>{
            state.tableQList = payload.payload
            return state
        },
        setSelected: (state, payload:PayloadAction<string>)=>{
            state.selected = payload.payload
            return state
        },
        setFliterReportData:(state, payload:PayloadAction<string[]>)=>{
            state.fliterReportData = payload.payload
            return state
        },
        setSide_by_side:(state, payload:PayloadAction<string>)=>{
            state.side_by_side = payload.payload
            return state
        },
        resetTableQList: (state) => {
      state.tableQList = [];
    },
    }
})

export const {setFilterList, setReportFilterList, setTableQList, resetTableQList, setSelected, setFliterReportData, setSide_by_side} = FilterSlice.actions
export default FilterSlice.reducer;