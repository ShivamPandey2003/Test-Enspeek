import React from "react";
import { cn } from "../../utils";

interface PageSubheaderProps {
  left: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  leftClassName?: string;
  rightClassName?: string;
  rightStyle?: React.CSSProperties;
}

const PageSubheader: React.FC<PageSubheaderProps> = ({
  left,
  right,
  className,
  contentClassName,
  leftClassName,
  rightClassName,
  rightStyle,
}) => {
  return (
    <header
      className={cn(
        "questionnaire-card questionnaire-border flex border-b px-4 py-2 md:px-5",
        className
      )}
    >
      <div
        className={cn(
          "flex w-full flex-col gap-1.5 md:flex-row md:items-center md:justify-between",
          contentClassName
        )}
      >
        <div
          className={cn(
            "min-w-0 md:flex md:min-h-8 md:items-center",
            leftClassName
          )}
        >
          {left}
        </div>
        {right ? (
          <div
            style={rightStyle}
            className={cn(
              "flex min-h-8 flex-wrap items-center justify-end gap-2",
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
