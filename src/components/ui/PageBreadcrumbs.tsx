import * as React from "react";
import { Link } from "react-router";
import { cn } from "../../utils";

type BreadcrumbItem = {
  label: string;
  to?: string;
  state?: unknown;
  active?: boolean;
};

interface PageBreadcrumbsProps {
  prefix?: React.ReactNode;
  items: BreadcrumbItem[];
  className?: string;
}

const PageBreadcrumbs: React.FC<PageBreadcrumbsProps> = ({
  prefix,
  items,
  className,
}) => {
  return (
    <div className={cn("flex min-h-[42px] flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-none", className)}>
      {prefix && (
        <span className="crosstab-title inline-flex items-center font-semibold leading-none">
          {prefix}
        </span>
      )}
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {item.to && !item.active ? (
            <Link
              to={item.to}
              state={item.state}
              className={cn(
                "inline-flex items-center leading-none",
                "crosstab-muted hover:text-login-primary"
              )}
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                "inline-flex items-center leading-none",
                item.active
                  ? "questionnaire-label font-semibold"
                  : "crosstab-muted"
              )}
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="crosstab-muted inline-flex items-center leading-none">/</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PageBreadcrumbs;
