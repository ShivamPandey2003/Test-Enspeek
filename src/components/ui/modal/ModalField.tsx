import type { ReactNode } from "react";

interface ModalFieldProps {
  label: ReactNode;
  required?: boolean;
  children: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
}

export default function ModalField({
  label,
  required = false,
  children,
  hint,
  error,
}: ModalFieldProps) {
  return (
    <div className="space-y-2">
      <label className="modal-label">
        {label}
        {required ? (
          <span className="modal-label-required ml-1">*</span>
        ) : null}
      </label>
      {children}
      {hint ? <p className="text-sm theme-text-muted">{hint}</p> : null}
      {error ? (
        <p className="text-sm text-[var(--color-questionnaire-stop)]">{error}</p>
      ) : null}
    </div>
  );
}
