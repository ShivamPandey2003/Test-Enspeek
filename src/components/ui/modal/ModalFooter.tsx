import type { ReactNode } from "react";
import { cn } from "../../../utils";

interface ModalFooterProps {
  leftAction?: ReactNode;
  rightAction?: ReactNode;
  note?: ReactNode;
  actionsClassName?: string;
}

export default function ModalFooter({
  leftAction,
  rightAction,
  note,
  actionsClassName,
}: ModalFooterProps) {
  return (
    <div className="modal-footer">
      {note ? <div className="modal-footer-note">{note}</div> : <div />}
      <div
        className={cn(
          "modal-footer-actions w-full justify-end sm:w-auto",
          leftAction && rightAction && "sm:justify-start",
          actionsClassName
        )}
      >
        {leftAction}
        {rightAction}
      </div>
    </div>
  );
}
