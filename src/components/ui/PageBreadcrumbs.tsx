import * as React from "react";
import { LuCheck, LuChevronDown } from "react-icons/lu";
import { Link } from "react-router";
import { cn } from "../../utils";
import { shouldUseCompactBreadcrumbs } from "../../utils/crosstabResponsive";
import NewDropdown from "../global/NewDropDown";

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

function BreadcrumbContent({
  prefix,
  items,
}: Pick<PageBreadcrumbsProps, "prefix" | "items">) {
  return (
    <>
      {prefix ? (
        <span className="crosstab-title inline-flex shrink-0 items-center font-semibold leading-none">
          {prefix}
        </span>
      ) : null}
      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          {item.to && !item.active ? (
            <Link
              to={item.to}
              state={item.state}
              className="crosstab-muted inline-flex shrink-0 items-center leading-none hover:text-login-primary"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                "inline-flex shrink-0 items-center leading-none",
                item.active
                  ? "questionnaire-label font-semibold"
                  : "crosstab-muted"
              )}
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 ? (
            <span className="crosstab-muted inline-flex shrink-0 items-center leading-none">
              /
            </span>
          ) : null}
        </React.Fragment>
      ))}
    </>
  );
}

export default function PageBreadcrumbs({
  prefix,
  items,
  className,
}: PageBreadcrumbsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const measurementRef = React.useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = React.useState(false);
  const measure = React.useCallback(() => {
    const container = containerRef.current;
    const measurement = measurementRef.current;
    if (!container || !measurement) return;
    setIsCompact(
      shouldUseCompactBreadcrumbs(
        measurement.scrollWidth,
        container.clientWidth
      )
    );
  }, []);

  React.useLayoutEffect(() => {
    measure();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }

    const observer = new ResizeObserver(measure);
    if (containerRef.current) observer.observe(containerRef.current);
    if (measurementRef.current) observer.observe(measurementRef.current);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div ref={containerRef} className={cn("relative min-w-0 w-full", className)}>
      <div
        ref={measurementRef}
        aria-hidden="true"
        className="pointer-events-none absolute invisible flex min-h-8 w-max items-center gap-2 whitespace-nowrap text-[16px] leading-none"
      >
        <BreadcrumbContent prefix={prefix} items={items} />
      </div>

      {isCompact ? (
        <NewDropdown
          position="bottom-left"
          contentAriaLabel="Breadcrumb navigation"
          renderTrigger={({ isOpen, toggle }) => (
            <button
              type="button"
              aria-label="Show breadcrumb navigation"
              aria-haspopup="dialog"
              aria-expanded={isOpen}
              title="Show breadcrumb navigation"
              className="questionnaire-label flex min-h-8 max-w-full min-w-0 items-center gap-1.5 rounded-lg px-1 font-semibold hover:bg-[var(--color-brand-primary-softest)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/30"
              onClick={toggle}
            >
              {prefix ? <span className="crosstab-title min-w-0 truncate">{prefix}</span> : null}
              <LuChevronDown className="h-4 w-4 shrink-0" />
            </button>
          )}
          renderContent={({ close }) => (
            <nav aria-label="Breadcrumb" className="min-w-56 p-1.5">
              {items.map((item, index) =>
                item.to && !item.active ? (
                  <Link
                    key={`${item.label}-${index}`}
                    to={item.to}
                    state={item.state}
                    className="home-dropdown-item flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium"
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    key={`${item.label}-${index}`}
                    aria-current={item.active ? "page" : undefined}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm font-semibold",
                      item.active
                        ? "bg-[var(--color-brand-primary-softest)] text-login-primary"
                        : "crosstab-muted"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.active ? <LuCheck className="h-4 w-4 shrink-0" /> : null}
                  </span>
                )
              )}
            </nav>
          )}
        />
      ) : (
        <div className="flex min-h-8 min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-[16px] leading-none">
          <BreadcrumbContent prefix={prefix} items={items} />
        </div>
      )}
    </div>
  );
}
