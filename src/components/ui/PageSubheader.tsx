import React from "react";
import { cn } from "../../utils";

interface PageSubheaderProps {
  left: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  leftClassName?: string;
  rightClassName?: string;
}

const PageSubheader: React.FC<PageSubheaderProps> = ({
  left,
  right,
  className,
  leftClassName,
  rightClassName,
}) => {
  return (
    <header
      className={cn(
        "questionnaire-card questionnaire-border flex border-b px-4 py-2 md:px-5",
        className
      )}
    >
      <div className="flex w-full flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
        <div
          className={cn(
            "min-w-0 md:flex md:min-h-[34px] md:items-center",
            leftClassName
          )}
        >
          {left}
        </div>
        {right ? (
          <div
            className={cn(
              "flex min-h-[34px] flex-wrap items-center justify-end gap-2",
              rightClassName
            )}
          >
            {right}
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default PageSubheader;
