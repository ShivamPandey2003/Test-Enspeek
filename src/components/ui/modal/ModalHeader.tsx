import type { ReactNode } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { cn } from "../../../utils";

interface ModalHeaderProps {
  title: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  descriptionClassName?: string;
  onClose?: () => void;
  showCloseButton?: boolean;
  closeDisabled?: boolean;
}

export default function ModalHeader({
  title,
  icon,
  description,
  descriptionClassName,
  onClose,
  showCloseButton = true,
  closeDisabled = false,
}: ModalHeaderProps) {
  return (
    <div className="modal-header">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="modal-header-row">
            {icon ? <span className="modal-header-icon">{icon}</span> : null}
            <h3 className="modal-title">{title}</h3>
          </div>
          {description ? (
            <p className={cn("modal-description", descriptionClassName)}>
              {description}
            </p>
          ) : null}
        </div>
        {showCloseButton ? (
          <button
            type="button"
            onClick={onClose}
            disabled={closeDisabled}
            className="modal-close-button disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close modal"
          >
            <IoCloseSharp className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
