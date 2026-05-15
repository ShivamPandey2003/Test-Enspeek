import { cva, type VariantProps } from "class-variance-authority";
import type { FC, ReactNode, SelectHTMLAttributes } from "react";
import { LuChevronDown } from "react-icons/lu";
import { cn } from "../../utils";

const selectVariants = cva(
  "w-full appearance-none border disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          "rounded-lg border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-4 py-3 text-sm text-[var(--color-text-default)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/20",
        questionnaire:
          "questionnaire-logic-select rounded-lg px-4 py-3 text-sm",
        crosstab:
          "questionnaire-input questionnaire-heading questionnaire-border rounded-lg px-4 py-3 text-sm focus-visible:ring-0",
        modal:
          "modal-select px-4 py-3 text-sm",
        bare:
          "border-0 bg-transparent px-0 py-0 text-inherit shadow-none focus-visible:ring-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement>,
    VariantProps<typeof selectVariants> {
  children: ReactNode;
  wrapperClassName?: string;
  hideIcon?: boolean;
}

const Select: FC<SelectProps> = ({
  children,
  variant,
  className,
  wrapperClassName,
  hideIcon = false,
  ...props
}) => {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <select
        className={cn(
          selectVariants({ variant }),
          !hideIcon && variant !== "bare" && "pr-10",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {!hideIcon && variant !== "bare" ? (
        <LuChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
      ) : null}
    </div>
  );
};

export default Select;
