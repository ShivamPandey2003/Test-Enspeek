import React from "react";
import { handleKeyPress } from "../../utils";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { LuCopy, LuInfo } from "react-icons/lu";
import ModalScaffold from "../ui/modal/ModalScaffold";
import ModalField from "../ui/modal/ModalField";
import ModalInfoBlock from "../ui/modal/ModalInfoBlock";
import { modalDefinitions } from "../../config/modalDefinitions";

const CopyModel: React.FC<CopyQuestionModalProps> = ({
  isOpen,
  onClick,
  onClose,
  qID,
  label,
  isPending = false,
}) => {
  const [QID, setQID] = React.useState<string>("");
  const [QLabel, setQlabel] = React.useState<string>("");
  const questionIdInputRef = React.useRef<HTMLInputElement | null>(null);
  const displayLabel =
    label?.replace(/^[A-Za-z0-9_-]+\s*:\s*/, "").trim() || label;
  const definition = modalDefinitions.copyQuestion;

  React.useEffect(() => {
    if (isOpen) {
      setQID("");
      setQlabel("");
      requestAnimationFrame(() => {
        const input = questionIdInputRef.current;
        if (!input) return;
        input.focus();
        const caretPosition = input.value.length;
        input.setSelectionRange(caretPosition, caretPosition);
      });
    }
  }, [isOpen, qID, label]);

  const handleClick = () => {
    if (QID !== "" && QLabel !== "") {
      onClick(`CQ${QID}`, QLabel);
    }
  };

  return (
    <ModalScaffold
      isOpen={isOpen}
      onClose={onClose}
      className={definition.maxWidthClass}
      title={definition.title}
      icon={<LuCopy className="h-5 w-5" />}
      closeDisabled={isPending}
      footerLeft={
        <Button type="button" varinat="cancel" onClick={onClose} disabled={isPending}>
          {definition.cancelLabel}
        </Button>
      }
      footerRight={
        <Button
          type="button"
          varinat="theme"
          onClick={handleClick}
          disabled={isPending || QID.trim() === "" || QLabel.trim() === ""}
        >
          {isPending ? (
            <>
              <span className="modal-spinner" />
              {definition.submittingLabel}
            </>
          ) : (
            <>
              <LuCopy className="h-4 w-4" />
              {definition.submitLabel}
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-[15px] leading-6 theme-text-default">
          Create a copy of{" "}
          <span className="font-semibold text-[var(--color-brand-primary)]">{`${qID ? `${qID}: ` : ""}${displayLabel || "this question"}`}</span>{" "}
          with a new question Id and label.
        </p>
        <ModalField label="Question Id" required>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[var(--color-text-strong)]">
              CQ
            </span>
            <Input
              ref={questionIdInputRef}
              variant="modal"
              data-test-id="COPY_QUESTIONNAIRE_MODEL_1"
              placeholder="Enter question id"
              value={QID}
              onChange={(e) => setQID(e.target.value)}
              className="pl-10"
            />
          </div>
        </ModalField>
        <ModalField label="Question Label" required>
          <Input
            variant="modal"
            data-test-id="COPY_QUESTIONNAIRE_MODEL_2"
            placeholder="Enter copied question label"
            value={QLabel}
            onChange={(e) => setQlabel(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleClick)}
          />
        </ModalField>
        <ModalInfoBlock
          icon={<LuInfo className="h-4 w-4 text-[var(--color-brand-primary)]" />}
        >
          Click{" "}
          <span className="font-semibold text-[var(--color-brand-primary)]">
            Copy Question
          </span>{" "}
          and wait a moment while the duplicated question is created.
        </ModalInfoBlock>
      </div>
    </ModalScaffold>
  );
};

export default CopyModel;
