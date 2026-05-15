import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  setDeleteModel,
  setSelectedId,
  setSelectedStudyName,
} from "../../../store/TriggerSlice";
import { useDelete } from "./Api";
import ConfirmKeywordModal from "../../global/modals/ConfirmKeywordModal";

const DeleteModel = () => {
  const { deleteModel, selectedId, selectedStudyName } = useSelector(
    (state: RootState) => state.trigger
  );
  const dispatch = useDispatch<AppDispatch>();
  const { Delete, isPending } = useDelete();

  const handleClose = () => {
    dispatch(setSelectedId(""));
    dispatch(setSelectedStudyName(""));
    dispatch(setDeleteModel(false));
  };

  return (
    <ConfirmKeywordModal
      isOpen={deleteModel}
      onClose={handleClose}
      onConfirm={() => {
        if (selectedId) {
          Delete(selectedId);
        }
      }}
      titleKey="deleteStudy"
      targetLabel={selectedStudyName || "this study"}
      isPending={isPending}
      testId="DELETE_MODEL"
    />
  );
};

export default DeleteModel;
