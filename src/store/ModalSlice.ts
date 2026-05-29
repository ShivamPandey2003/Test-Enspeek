import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ModalPayload = Record<string, unknown> | null;

interface ModalState {
  activeModalId: string | null;
  isOpen: boolean;
  payload: ModalPayload;
}

const initialState: ModalState = {
  activeModalId: null,
  isOpen: false,
  payload: null,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (
      state,
      action: PayloadAction<{ id: string; payload?: ModalPayload }>
    ) => {
      state.activeModalId = action.payload.id;
      state.isOpen = true;
      state.payload = action.payload.payload ?? null;
      return state;
    },
    closeModal: (state) => {
      state.activeModalId = null;
      state.isOpen = false;
      state.payload = null;
      return state;
    },
    setModalPayload: (state, action: PayloadAction<ModalPayload>) => {
      state.payload = action.payload;
      return state;
    },
  },
});

export const { openModal, closeModal, setModalPayload } = modalSlice.actions;
export default modalSlice.reducer;
