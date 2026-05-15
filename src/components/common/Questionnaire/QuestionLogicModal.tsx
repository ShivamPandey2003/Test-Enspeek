import { useState } from "react";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { LuSave } from "react-icons/lu";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import QuestionLogic from "./QuestionLogic";
import Button from "../../ui/Button";
import LogicModel from "../../global/LogicModal";
import { useSaveQuestionLogicMutation } from "../../../api-network/questionnaire/mutation";

export default function QuesLogicModal({
  isOpen,
  onClose,
  qID,
}: QuestionLogicModalProps) {
  const location = useLocation();
  const studyID = location.state?.studyID;
  const [resetFlag, setResetFlag] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const logicPayload = useSelector(
    (state: RootState) => state.question.logicPayload
  );
  const { mutate: saveQuestionLogic, isPending } = useSaveQuestionLogicMutation(
    studyID,
    qID
  );

  const handleSave = () => {
    if (!qID) {
      toast.error("Question ID not found");
      return;
    }

    if (resetFlag) {
      saveQuestionLogic(
        { payload: { logic1: {} } as QuesLogicPayload, isResetting: true },
        {
          onSuccess: () => {
            setIsResetting(false);
          },
        }
      );
      return;
    }

    saveQuestionLogic(
      { payload: (logicPayload ?? {}) as QuesLogicPayload },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const handleReset = () => {
    setIsResetting(true);
    setResetFlag((prev) => !prev);

    setTimeout(() => {
      handleSave();
    }, 100);
  };

  return (
    <LogicModel
      isOpen={isOpen}
      onClose={onClose}
      Title="Add/Edit Question Logic"
      description="Configure logic rules for this question. Save when the conditions, skip path, or termination behavior are ready."
      closeDisabled={isPending}
      className="max-w-[90vw]"
      footerContent={
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button
            varinat="cancel"
            onClick={handleReset}
            disabled={isPending}
          >
            {isPending && isResetting ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-[var(--color-text-strong)]/25 border-t-[var(--color-text-strong)] animate-spin" />
                <span>
                  Resetting
                  <span className="copying-dots ml-0.5 inline-flex w-[1.5em] justify-start">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>
              </>
            ) : (
              "Reset Logic"
            )}
          </Button>
          <Button
            varinat="success"
            onClick={handleSave}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                <span>
                  Saving
                  <span className="copying-dots ml-0.5 inline-flex w-[1.5em] justify-start">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>
              </>
            ) : (
              <>
                <LuSave className="h-4 w-4" />
                Save Logic
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        <QuestionLogic questionID={qID} resetFlag={resetFlag} isOpen={isOpen} />
      </div>
    </LogicModel>
  );
}
