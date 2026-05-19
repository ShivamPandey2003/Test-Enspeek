import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  setArchiveAction,
  setArchiveModel,
  setSelectedId,
  setSelectedStudyName,
} from "../../../store/TriggerSlice";
import { useActive, useArchive } from "./Api";
import ConfirmKeywordModal from "../../global/modals/ConfirmKeywordModal";

const ArchiveModel = () => {
  const { archiveModel, archiveAction, selectedId, selectedStudyName } = useSelector(
    (state: RootState) => state.trigger
  );
  const dispatch = useDispatch<AppDispatch>();
  const isUnarchive = archiveAction === "unarchive";

  const handleClose = () => {
    dispatch(setArchiveModel(false));
    dispatch(setArchiveAction("archive"));
    dispatch(setSelectedId(""));
    dispatch(setSelectedStudyName(""));
  };
  const { Archived, isPending: isArchiving } = useArchive(handleClose);
  const { Active, isPending: isUnarchiving } = useActive(handleClose);
  const isPending = isUnarchive ? isUnarchiving : isArchiving;

  const handleStatusChange = () => {
    if (!selectedId) return;
    if (isUnarchive) {
      Active(selectedId);
      return;
    }
    Archived(selectedId);
  };

  return (
    <ConfirmKeywordModal
      isOpen={archiveModel}
      onClose={handleClose}
      onConfirm={handleStatusChange}
      titleKey={isUnarchive ? "unarchiveStudy" : "archiveStudy"}
      targetLabel={selectedStudyName || "this study"}
      keyword={isUnarchive ? "restore" : "archive"}
      actionVerb={isUnarchive ? "restore" : "archive"}
      warningToneClass="text-[var(--color-brand-primary)]"
      isPending={isPending}
      appendIrreversibleWarning={!isUnarchive}
      infoText={
        <>
          Type{" "}
          <span className="font-semibold text-[var(--color-brand-primary)]">
            {isUnarchive ? "restore" : "archive"}
          </span>{" "}
          to {isUnarchive ? "restore" : "archive"} this study.
        </>
      }
    />
  );
};

export default ArchiveModel;
