import React from "react";
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

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {showOverlay && (
        <div className="fixed inset-0 bg-[var(--color-overlay)]" />
      )}
      <div
        className={cn(
          "modal-panel relative z-50 w-full overflow-hidden transition-all",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
