import type { ReactNode } from "react";
import { cn } from "../../../utils";

interface ModalFieldProps {
  label: ReactNode;
  required?: boolean;
  children: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  labelClassName?: string;
  className?: string;
}

export default function ModalField({
  label,
  required = false,
  children,
  hint,
  error,
  labelClassName,
  className,
}: ModalFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className={cn("modal-label", labelClassName)}>
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
