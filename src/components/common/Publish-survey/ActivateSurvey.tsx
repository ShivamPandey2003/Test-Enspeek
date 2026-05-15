import { useEffect, useRef, useState, type FC } from "react";
import DynamicModel from "../../global/DynamicModel";
import { toast } from "sonner";
import { handleKeyPress } from "../../../utils";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { LuBadgeCheck, LuInfo, LuPower } from "react-icons/lu";
import ModalInfoBlock from "../../ui/modal/ModalInfoBlock";
import { modalDefinitions } from "../../../config/modalDefinitions";

const ActivateSurvey: FC<ActivateSurveyModalProps> = ({
  isOpen,
  activate,
  onClose,
  studyInfo,
  isPending,
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isConfirmed = inputValue.trim().toLowerCase() === "activate";
  const definition = modalDefinitions.activateSurvey;

  useEffect(() => {
    if (isOpen && !isPending) {
      setInputValue("");
      const focusInput = () => {
        const input = inputRef.current;
        if (!input) return;
        input.focus();
        const caretPosition = input.value.length;
        input.setSelectionRange(caretPosition, caretPosition);
      };

      requestAnimationFrame(focusInput);
      const timeoutId = window.setTimeout(focusInput, 120);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [isOpen, isPending]);

  const handleActivateSurvey = async () => {
    if (inputValue.trim().toLowerCase() !== "activate") {
        return toast.warning(`Please type "activate" to confirm`)
    }
    try {
      await activate();
      setInputValue("");
      onClose();
    } catch {
      return;
    }
  };

  return (
    <DynamicModel
      Title={definition.title}
      headerIcon={
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
          <LuBadgeCheck className="h-5 w-5" />
        </span>
      }
      ButtonText={isPending ? definition.submittingLabel! : definition.submitLabel!}
      buttonVariant="success"
      buttonIcon={
        isPending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
        ) : (
          <LuPower className="h-4 w-4" />
        )
      }
      isOpen={isOpen}
      onClick={handleActivateSurvey}
      onClose={() => !isPending && onClose()}
      className="max-w-lg"
      disable={isPending || !isConfirmed}
      closeDisabled={isPending}
      bodyClassName="bg-white"
      secondaryAction={
        <Button
          type="button"
          varinat="cancel"
          onClick={() => !isPending && onClose()}
          disabled={isPending}
        >
          {definition.cancelLabel}
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-base text-[var(--color-text-strong)]">
          Please confirm if you want to activate{" "}
          <span className="font-semibold text-login-primary">
            {studyInfo.studyname}
          </span>
          ?
        </p>
        <ModalInfoBlock
          // className="modal-card rounded-[20px] bg-[var(--color-surface-base)] px-4 py-4 force_align_center"
          className="modal-info-block"
          icon={
            <span className="modal-info-icon text-[var(--color-brand-primary)]">
              {/* modal-header-icon h-10 w-10 */}
              <LuInfo className="h-4 w-4" />
            </span>
          }
        >
          <span className="text-[var(--color-text-default)]">Type </span>
          <span className="font-semibold text-login-primary">activate</span>
          <span className="text-[var(--color-text-default)]">
            {" "}to confirm this action.
          </span>
        </ModalInfoBlock>
      </div>
      <Input
        ref={inputRef}
        variant="modal"
        type="text"
        autoFocus={isOpen && !isPending}
        data-test-id="ACTIVATE_INPUT"
        placeholder="Type 'activate' here..."
        className="questionnaire-heading mt-4 rounded-[18px]"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => handleKeyPress(e, handleActivateSurvey)}
        disabled={isPending}
      />
    </DynamicModel>
  );
};

export default ActivateSurvey;
