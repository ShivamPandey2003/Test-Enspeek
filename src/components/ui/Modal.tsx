import React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showOverlay?: boolean;
}> = ({
  isOpen,
  children,
  className = "",
  showOverlay = true,
}) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center overflow-y-auto overflow-x-hidden p-3 sm:p-4"
      aria-modal="true"
      role="dialog"
    >
      {showOverlay && (
        <div className="fixed inset-0 bg-[var(--color-overlay)]" />
      )}
      <div
        className={cn(
          "modal-panel relative z-50 my-auto w-full max-w-[calc(100vw-1.5rem)] overflow-hidden transition-all sm:max-w-[calc(100vw-2rem)]",
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
