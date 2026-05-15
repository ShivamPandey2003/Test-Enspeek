import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { handleKeyPress } from "../../../utils";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import ModalScaffold from "../../ui/modal/ModalScaffold";
import ModalField from "../../ui/modal/ModalField";
import ModalInfoBlock from "../../ui/modal/ModalInfoBlock";
import { LuInfo, LuTrash2 } from "react-icons/lu";
import { modalDefinitions, renderModalIcon } from "../../../config/modalDefinitions";

export default function ConfirmKeywordModal({
  isOpen,
  onClose,
  onConfirm,
  titleKey,
  targetLabel,
  keyword = "delete",
  actionVerb = "delete",
  warningToneClass = "text-[var(--color-questionnaire-stop)]",
  isPending = false,
  testId,
  infoText,
  appendIrreversibleWarning = true,
  fieldLabel = "Confirmation",
}: ConfirmKeywordModalProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const definition = modalDefinitions[titleKey];
  const normalizedKeyword = keyword.trim().toLowerCase();
  const isConfirmed = value.trim().toLowerCase() === normalizedKeyword;
  const submitVariant =
    definition.tone === "danger"
      ? "danger"
      : definition.tone === "success"
        ? "success"
        : "theme";

  useEffect(() => {
    if (isOpen) {
      setValue("");
      requestAnimationFrame(() => {
        const input = inputRef.current;
        if (!input) return;
        input.focus();
        const caretPosition = input.value.length;
        input.setSelectionRange(caretPosition, caretPosition);
      });
    }
  }, [isOpen, targetLabel]);

  const handleConfirm = () => {
    if (!isConfirmed) {
      toast.warning(`Please type "${keyword}" to confirm.`);
      return;
    }

    onConfirm();
  };

  return (
    <ModalScaffold
      isOpen={isOpen}
      onClose={onClose}
      className={definition.maxWidthClass}
      title={definition.title}
      icon={renderModalIcon(definition.icon ?? LuTrash2)}
      closeDisabled={isPending}
      footerLeft={
        <Button type="button" varinat="cancel" onClick={onClose} disabled={isPending}>
          {definition.cancelLabel}
        </Button>
      }
      footerRight={
        <Button
          type="button"
          varinat={submitVariant as any}
          onClick={handleConfirm}
          disabled={isPending || !isConfirmed}
        >
          {isPending ? (
            <>
              <span className="modal-spinner" />
              {definition.submittingLabel}
            </>
          ) : (
            <>
              <LuTrash2 className="h-4 w-4" />
              {definition.submitLabel}
            </>
          )}
        </Button>
      }
    >
      <div className="space-y-4">
        <p className="text-[15px] leading-6 theme-text-default">
          Are you sure you want to {actionVerb}{" "}
          <span className={`font-semibold ${warningToneClass}`}>
            {targetLabel}
          </span>
          ?{appendIrreversibleWarning ? " This action cannot be undone." : ""}
        </p>
        <ModalInfoBlock
          icon={<LuInfo className={`h-4 w-4 ${warningToneClass}`} />}
        >
          {infoText ? (
            infoText
          ) : (
            <>
              Type <span className={`font-semibold ${warningToneClass}`}>{keyword}</span>{" "}
              to confirm this action.
            </>
          )}
        </ModalInfoBlock>
        <ModalField label={fieldLabel} required>
          <Input
            ref={inputRef}
            variant="modal"
            data-test-id={testId}
            placeholder={`Type '${keyword}' here...`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, handleConfirm)}
          />
        </ModalField>
      </div>
    </ModalScaffold>
  );
}
