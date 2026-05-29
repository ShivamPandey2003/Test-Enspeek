import { useDispatch, useSelector } from "react-redux";
import { closeModal, openModal, setModalPayload } from "../store/ModalSlice";
import type { AppDispatch, RootState } from "../store/store";

export const useModalController = () => {
  const dispatch = useDispatch<AppDispatch>();
  const modalState = useSelector((state: RootState) => state.modal);

  return {
    ...modalState,
    openById: (id: string, payload?: Record<string, unknown> | null) =>
      dispatch(openModal({ id, payload })),
    closeCurrentModal: () => dispatch(closeModal()),
    updateModalPayload: (payload: Record<string, unknown> | null) =>
      dispatch(setModalPayload(payload)),
  };
};

export default useModalController;
