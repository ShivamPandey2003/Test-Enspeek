import React from "react";
import { cn } from "../../utils";
import { cva, type VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full border disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:text-sm file:font-medium focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          "rounded-lg border-[var(--color-brand-primary)] bg-[var(--color-surface-base)] text-sm text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/20",
        questionnaire:
          "questionnaire-input questionnaire-heading questionnaire-border rounded-[18px] px-4 py-3.5 text-base focus-visible:ring-0",
        crosstab:
          "questionnaire-input questionnaire-heading questionnaire-border rounded-[16px] px-4 py-3 text-sm focus-visible:ring-0",
        modal:
          "modal-input px-4 py-3 text-sm",
        modalDanger:
          "modal-input modal-input-danger px-4 py-3 text-sm",
        login:
          "h-12 rounded-xl border-0 bg-[var(--color-login-input)] px-4 text-base text-[var(--color-login-input-text)] placeholder:text-[var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-login-primary)]/40",
        bare:
          "border-0 bg-transparent px-0 py-0 text-inherit shadow-none focus-visible:ring-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  className?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", variant, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ variant }), className)}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
