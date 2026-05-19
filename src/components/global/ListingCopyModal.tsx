import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { useCopy } from "../common/list/Api";
import { setCopyModel } from "../../store/TriggerSlice";
import NameCopyModal from "./modals/NameCopyModal";

const ListingCopyModel: React.FC = () => {
  const { selectedStudyName, copyModel, selectedId } = useSelector(
    (state: RootState) => state.trigger
  );
  const dispatch = useDispatch<AppDispatch>();
  const [value, setValue] = useState<string>("");
  const { Copy, isPending } = useCopy();

  const defaultCopyName = selectedStudyName
    ? `${selectedStudyName} (copy)`
    : "";
  const draftValue = value;

  React.useEffect(() => {
    if (copyModel) {
      setValue(defaultCopyName);
    }
  }, [copyModel, defaultCopyName]);

  const handleClose = () => {
    dispatch(setCopyModel(false));
    setValue("");
  };

  return (
    <NameCopyModal
      isOpen={copyModel}
      onClose={handleClose}
      onConfirm={(nextValue) => Copy({ studyId: selectedId, studyName: nextValue })}
      titleKey="copyStudy"
      sourceLabel={selectedStudyName || "this study"}
      fieldLabel="New Study Name"
      placeholder="Enter copied study name"
      defaultValue={draftValue}
      copyText="Copy Study"
      isPending={isPending}
    />
  );
};

export default ListingCopyModel;
