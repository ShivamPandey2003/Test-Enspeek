import { cva, type VariantProps } from "class-variance-authority";
import type { FC, InputHTMLAttributes } from "react";
import { cn } from "../../utils";

const radioVariants = cva(
  "questionnaire-clickable shrink-0 border focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "h-4 w-4 rounded-full border-[var(--color-border-default)] accent-[var(--color-brand-primary)]",
        subtle:
          "h-4 w-4 rounded-full border-[var(--color-border-strong)] accent-[var(--color-brand-primary)]",
        success:
          "h-4 w-4 rounded-full border-[var(--color-border-default)] accent-[var(--color-core-success)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface RadioProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type">,
    VariantProps<typeof radioVariants> {}

const Radio: FC<RadioProps> = ({ className, variant, ...props }) => {
  return (
    <input
      type="radio"
      className={cn(radioVariants({ variant }), className)}
      {...props}
    />
  );
};

export default Radio;
