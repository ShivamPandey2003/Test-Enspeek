import { cva, type VariantProps } from "class-variance-authority";
import { type FC, type TextareaHTMLAttributes } from "react";
import { cn } from "../../utils";

const textareaVariants = cva(
  "flex w-full border disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          "rounded-lg border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-4 py-3 text-sm text-[var(--color-text-default)] placeholder:text-[var(--color-text-muted)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/20",
        questionnaire:
          "questionnaire-input questionnaire-heading questionnaire-border rounded-[18px] px-4 py-3.5 text-base focus-visible:ring-0",
        modal:
          "modal-textarea px-4 py-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}

const Textarea: FC<TextareaProps> = ({ className, variant, ...props }) => {
  return (
    <textarea
      className={cn(textareaVariants({ variant }), className)}
      {...props}
    />
  );
};

export default Textarea;

