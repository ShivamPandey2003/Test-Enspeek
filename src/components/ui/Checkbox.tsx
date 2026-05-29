import { cva, type VariantProps } from "class-variance-authority";
import type { FC, InputHTMLAttributes } from "react";
import { cn } from "../../utils";

const checkboxVariants = cva(
  "questionnaire-clickable shrink-0 rounded border focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "h-4 w-4 border-[var(--color-border-default)] accent-[var(--color-brand-primary)]",
        subtle:
          "h-4 w-4 border-[var(--color-border-strong)] accent-[var(--color-brand-primary)]",
        success:
          "h-4 w-4 border-[var(--color-border-default)] accent-[var(--color-core-success)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof checkboxVariants> {}

const Checkbox: FC<CheckboxProps> = ({ className, variant, ...props }) => {
  return (
    <input
      type="checkbox"
      className={cn(checkboxVariants({ variant }), className)}
      {...props}
    />
  );
};

export default Checkbox;
