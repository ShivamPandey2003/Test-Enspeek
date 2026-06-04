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
          "questionnaire-heading rounded-xl border-0 bg-white px-2.5 py-1.5 text-[15px] text-[var(--color-login-input-text)] placeholder:text-[var(--color-text-muted)] shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--color-login-primary)_22%,transparent)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-login-primary)]/40",
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

