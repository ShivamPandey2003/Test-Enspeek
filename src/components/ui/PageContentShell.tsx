import React from "react";
import { cn } from "../../utils";

interface PageContentShellProps {
  children: React.ReactNode;
  className?: string;
}

const PageContentShell: React.FC<PageContentShellProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-8 pt-3 md:px-4 md:pb-10 md:pt-4",
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageContentShell;
