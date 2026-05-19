import { useEffect, useRef, useState } from "react";
import { handleKeyPress } from "../../../utils";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import ModalScaffold from "../../ui/modal/ModalScaffold";
import ModalField from "../../ui/modal/ModalField";
import ModalInfoBlock from "../../ui/modal/ModalInfoBlock";
import { LuCopy, LuInfo } from "react-icons/lu";
import { modalDefinitions } from "../../../config/modalDefinitions";

export default function NameCopyModal({
  isOpen,
  onClose,
  onConfirm,
  titleKey,
  sourceLabel,
  fieldLabel,
  placeholder,
  defaultValue,
  copyText,
  isPending = false,
}: NameCopyModalProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const definition = modalDefinitions[titleKey];

  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      requestAnimationFrame(() => {
        const input = inputRef.current;
        if (!input) return;
        input.focus();
        const caretPosition = input.value.length;
        input.setSelectionRange(caretPosition, caretPosition);
      });
    }
  }, [isOpen, defaultValue]);

  const handleConfirm = () => {
    if (!value.trim()) return;
    onConfirm(value);
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
          onClick={handleConfirm}
          disabled={isPending || value.trim() === ""}
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
          <span className="font-semibold text-[var(--color-brand-primary)]">
            {sourceLabel}
          </span>{" "}
          with a new name.
        </p>
        <ModalField label={fieldLabel} required>
          <Input
            ref={inputRef}
            variant="modal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => handleKeyPress(e, handleConfirm)}
          />
        </ModalField>
        <ModalInfoBlock
          icon={<LuInfo className="h-4 w-4 text-[var(--color-brand-primary)]" />}
        >
          Click{" "}
          <span className="font-semibold text-[var(--color-brand-primary)]">
            {copyText}
          </span>{" "}
          and wait a moment while the duplicated item is created.
        </ModalInfoBlock>
      </div>
    </ModalScaffold>
  );
}
