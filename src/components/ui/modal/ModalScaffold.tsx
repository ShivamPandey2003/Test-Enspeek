import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "../../../utils";
import { MODAL_CLOSE_FOCUS_CHAT_EVENT } from "../../../utils/modalFocus";
import Modal from "../Modal";
import ModalHeader from "./ModalHeader";
import ModalFooter from "./ModalFooter";

interface ModalScaffoldProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  title: ReactNode;
  icon?: ReactNode;
  description?: ReactNode;
  descriptionClassName?: string;
  closeDisabled?: boolean;
  bodyClassName?: string;
  children: ReactNode;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  footerNote?: ReactNode;
  showCloseButton?: boolean;
}

export default function ModalScaffold({
  isOpen,
  onClose,
  className,
  title,
  icon,
  description,
  descriptionClassName,
  closeDisabled = false,
  bodyClassName,
  children,
  footerLeft,
  footerRight,
  footerNote,
  showCloseButton = true,
}: ModalScaffoldProps) {
  const wasOpenRef = useRef(isOpen);

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      window.dispatchEvent(new CustomEvent(MODAL_CLOSE_FOCUS_CHAT_EVENT));
    }

    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (wasOpenRef.current) {
        window.dispatchEvent(new CustomEvent(MODAL_CLOSE_FOCUS_CHAT_EVENT));
      }
    };
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={cn("w-full", className)}>
      <div className="w-full">
        <ModalHeader
          title={title}
          icon={icon}
          description={description}
          descriptionClassName={descriptionClassName}
          onClose={onClose}
          closeDisabled={closeDisabled}
          showCloseButton={showCloseButton}
        />
        <div className={cn("modal-body", bodyClassName)}>{children}</div>
        {(footerLeft || footerRight || footerNote) ? (
          <ModalFooter
            leftAction={footerLeft}
            rightAction={footerRight}
            note={footerNote}
          />
        ) : null}
      </div>
    </Modal>
  );
}
