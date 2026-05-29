import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CrosstabState {
  modalOpen: boolean;
  bannerName: string;
  bannerDescription: string;
  groups: string[];
  isOpenGroup: boolean;
  selectedQuestions: string[];
  isModalOpen: boolean;
  isBannerSettingsOpen: boolean;
  isHistoryModalOpen: boolean;
  isDownloadDropdownOpen: boolean;
  groupInput: string;
  isAddBannerModalOpen: boolean;
  isEditModal: boolean;
  logic: Record<string, { pointLogic: string }[]>;
  selectedTable: string;
  selectedQid: string;
  validateLogic: Record<number, any[]>;
  isFbModalOpen: boolean;
  isWhatsappModalOpen: boolean;
  subgroupOn: boolean;
}

const bannerName = localStorage.getItem("bannerName");

const initialState: CrosstabState = bannerName
  ? {
      modalOpen: false,
      bannerName: bannerName,
      bannerDescription: "",
      groups: [],
      isEditModal: false,
      isOpenGroup: false,
      selectedQuestions: [],
      isModalOpen: false,
      isBannerSettingsOpen: false,
      isHistoryModalOpen: false,
      isDownloadDropdownOpen: false,
      groupInput: "",
      isAddBannerModalOpen: false,
      selectedTable: "",
      selectedQid: "",
      logic: {},
      validateLogic: {},
      isFbModalOpen: false,
      isWhatsappModalOpen: false,
      subgroupOn: localStorage.getItem("subgroupOn") === "true",
    }
  : {
      modalOpen: false,
      bannerName: "",
      bannerDescription: "",
      groups: [],
      isEditModal: false,
      isOpenGroup: false,
      selectedQuestions: [],
      isModalOpen: false,
      isBannerSettingsOpen: false,
      isHistoryModalOpen: false,
      isDownloadDropdownOpen: false,
      groupInput: "",
      isAddBannerModalOpen: false,
      selectedTable: "",
      selectedQid: "",
      logic: {},
      validateLogic: {},
      isFbModalOpen: false,
      isWhatsappModalOpen: false,
      subgroupOn: localStorage.getItem("subgroupOn") === "true",
    };

const crosstabSlice = createSlice({
  name: "crosstab",
  initialState,
  reducers: {
    setModalOpen(state, action: PayloadAction<boolean>) {
      state.modalOpen = action.payload;
    },
    setBannerName(state, action: PayloadAction<string>) {
      state.bannerName = action.payload;
      localStorage.setItem("bannerName", action.payload);
      return state;
    },
    setBannerDescription(state, action: PayloadAction<string>) {
      state.bannerDescription = action.payload;
    },
    addGroup(state, action: PayloadAction<string>) {
      const newGroup = action.payload.trim();
      if (newGroup && !state.groups.includes(newGroup)) {
        state.groups.push(newGroup);
      }
    },
    setIsOpenGroup(state, action: PayloadAction<boolean>) {
      state.isOpenGroup = action.payload;
    },
    setSelectedQuestions(state, action: PayloadAction<string[]>) {
      state.selectedQuestions = action.payload;
    },
    setIsModalOpen(state, action: PayloadAction<boolean>) {
      state.isModalOpen = action.payload;
    },
    setIsBannerSettingsOpen(state, action: PayloadAction<boolean>) {
      state.isBannerSettingsOpen = action.payload;
    },
    setIsHistoryModalOpen(state, action: PayloadAction<boolean>) {
      state.isHistoryModalOpen = action.payload;
    },
    setIsAddBannerModalOpen(state, action: PayloadAction<boolean>) {
      state.isAddBannerModalOpen = action.payload;
    },
    setIsDownloadDropdownOpen(state, action: PayloadAction<boolean>) {
      state.isDownloadDropdownOpen = action.payload;
    },
    setIsEditModal(state, action: PayloadAction<boolean>) {
      state.isEditModal = action.payload;
    },
    setGroupInput(state, action: PayloadAction<string>) {
      state.groupInput = action.payload;
    },
    setSelectedTable(state, action: PayloadAction<string>) {
      state.selectedTable = action.payload;
    },
    setSelectedQid(state, action: PayloadAction<string>) {
      state.selectedQid = action.payload;
    },
    setLogic(
      state,
      action: PayloadAction<Record<string, { pointLogic: string }[]>>
    ) {
      state.logic = action.payload;
    },
    resetLogic(state) {
      state.logic = {};
    },
    setValidateLogic: (state, action: PayloadAction<Record<number, any[]>>) => {
      state.validateLogic = action.payload;
      return state;
    },
    setIsFbModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isFbModalOpen = action.payload;
      return state;
    },
    setIsWhatsappModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isWhatsappModalOpen = action.payload;
      return state;
    },
    setSubgroupOn(state, action: PayloadAction<boolean>) {
      state.subgroupOn = action.payload;
      localStorage.setItem("subgroupOn", String(action.payload)); 
    },
  },
});

export const {
  setModalOpen,
  setBannerName,
  setBannerDescription,
  addGroup,
  setIsOpenGroup,
  setSelectedQuestions,
  setIsModalOpen,
  setIsBannerSettingsOpen,
  setIsHistoryModalOpen,
  setIsDownloadDropdownOpen,
  setGroupInput,
  setIsAddBannerModalOpen,
  setIsEditModal,
  setSelectedTable,
  setSelectedQid,
  setLogic,
  resetLogic,
  setValidateLogic,
  setIsFbModalOpen,
  setIsWhatsappModalOpen,
  setSubgroupOn
} = crosstabSlice.actions;

export default crosstabSlice.reducer;
