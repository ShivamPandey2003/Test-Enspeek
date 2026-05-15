import type { ReactNode } from "react";
import { cn } from "../../../utils";

interface ModalInfoBlockProps {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function ModalInfoBlock({
  icon,
  children,
  className,
}: ModalInfoBlockProps) {
  return (
    <div className={cn("modal-info-block", className)}>
      {icon ? <span className="modal-info-icon">{icon}</span> : null}
      <div className="text-sm leading-6 theme-text-default">{children}</div>
    </div>
  );
}
