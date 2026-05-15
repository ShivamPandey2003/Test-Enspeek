import React from "react";
import { cn } from "../../utils";
import { LuGitBranchPlus } from "react-icons/lu";
import ModalScaffold from "../ui/modal/ModalScaffold";

const LogicModel: React.FC<LogicModalProps> = ({
  isOpen,
  onClose,
  Title,
  description,
  children,
  closeDisabled = false,
  className = "",
  footerContent,
}) => {
  if (!isOpen) return null;

  return (
    <ModalScaffold
      isOpen={isOpen}
      onClose={onClose}
      className={cn("max-w-5xl", className)}
      title={Title}
      icon={<LuGitBranchPlus className="h-5 w-5" />}
      description={description}
      descriptionClassName="text-black"
      closeDisabled={closeDisabled}
      footerRight={footerContent}
    >
      <div tabIndex={-1} className="w-full">
        {children}
      </div>
    </ModalScaffold>
  );
};

export default LogicModel;
