import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../store/ModalSlice";
import type { AppDispatch, RootState } from "../../store/store";
import modalRegistry from "../../config/modalRegistry";

export default function GlobalModalHost() {
  const dispatch = useDispatch<AppDispatch>();
  const { activeModalId, isOpen, payload } = useSelector(
    (state: RootState) => state.modal
  );

  if (!isOpen || !activeModalId) return null;

  const entry = modalRegistry[activeModalId];
  if (!entry?.component) return null;

  const Component = entry.component;
  return (
    <Component
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      payload={payload}
    />
  );
}
