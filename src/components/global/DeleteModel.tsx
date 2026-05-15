import React from "react";
import ConfirmKeywordModal from "./modals/ConfirmKeywordModal";

const DeleteModel: React.FC<DeleteQuestionModalProps> = ({
  onClick,
  isOpen,
  onClose,
  qID,
  label,
  isPending = false,
}) => {
  const displayLabel =
    label?.replace(/^[A-Za-z0-9_-]+\s*:\s*/, "").trim() || label;

  return (
    <ConfirmKeywordModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onClick}
      titleKey="deleteQuestion"
      targetLabel={`${qID ? `${qID}: ` : ""}${displayLabel || "this question"}`}
      isPending={isPending}
      testId="DELETE_QUESTIONNAIRE_MODEL"
    />
  );
};

export default DeleteModel;
