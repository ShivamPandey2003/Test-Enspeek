import React from "react";
import Button from "../ui/Button";
import { cn } from "../../utils";
import ModalScaffold from "../ui/modal/ModalScaffold";

const DynamicModel: React.FC<DynamicModalProps> = ({
  isOpen,
  onClose,
  Title,
  headerIcon,
  description,
  descriptionClassName,
  ButtonText,
  buttonIcon,
  children,
  onClick,
  disable,
  closeDisabled,
  className = "",
  bodyClassName = "theme-surface",
  footerContent,
  secondaryAction,
  secondaryActionPosition = "before",
  buttonVariant,
}) => {
  if (!isOpen) return null;

  const resolvedButtonVariant = buttonVariant
    ? buttonVariant
    : ButtonText.toLowerCase().includes("delete")
      ? "danger"
      : /(save|update|submit)/i.test(ButtonText)
        ? "success"
        : "theme";

  return (
    <ModalScaffold
      isOpen={isOpen}
      onClose={onClose}
      className={cn("w-full", className)}
      title={Title}
      icon={headerIcon}
      description={description}
      descriptionClassName={descriptionClassName}
      closeDisabled={closeDisabled ?? disable}
      bodyClassName={bodyClassName}
      footerNote={
        footerContent ? (
          <div className="report-muted text-left text-sm">{footerContent}</div>
        ) : null
      }
      footerLeft={secondaryActionPosition === "before" ? secondaryAction : null}
      footerRight={
        <>
          {secondaryActionPosition === "after" ? secondaryAction : null}
          {ButtonText && onClick ? (
            <Button
              size="default"
              varinat={resolvedButtonVariant}
              onClick={onClick}
              data-test-id="MODEL_BUTTON"
              className="min-w-[180px]"
              disabled={disable}
            >
              {buttonIcon}
              {ButtonText}
            </Button>
          ) : null}
        </>
      }
    >
      <div tabIndex={-1}>{children}</div>
    </ModalScaffold>
  );
};

export default DynamicModel;
