import { cva, type VariantProps } from "class-variance-authority";
import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "../../utils";
import { getTooltipAttributes, type TooltipPosition } from "./Tooltip";

const buttonBaseClasses = "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent font-bold leading-none align-middle transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

const buttonToneVariants = cva(
  "",
  {
    variants: {
      varinat: {
        default: "bg-[var(--color-brand-primary)] text-[var(--color-core-text-inverse)] shadow-sm hover:bg-[var(--color-brand-primary-hover)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/20",
        theme: "bg-[var(--color-brand-primary)] text-[var(--color-core-text-inverse)] shadow-sm hover:bg-[var(--color-brand-primary-hover)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/20",
        success: "bg-[var(--color-study-activated)] text-[var(--color-core-text-inverse)] shadow-sm hover:brightness-95 focus-visible:ring-2 focus-visible:ring-[color:var(--color-study-activated)]/20",
        danger: "bg-[var(--color-questionnaire-stop)] text-[var(--color-core-text-inverse)] shadow-sm hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[color:var(--color-questionnaire-stop)]/20",
        cancel: "border-[var(--color-border-strong)] bg-[var(--color-surface-base)] text-[var(--color-text-strong)] shadow-sm hover:bg-[var(--color-surface-soft)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/14",
        destructive: "bg-[var(--color-questionnaire-stop)] text-[var(--color-core-text-inverse)] shadow-sm hover:opacity-95 focus-visible:ring-2 focus-visible:ring-[color:var(--color-questionnaire-stop)]/20",
        outline: "border-[var(--color-border-strong)] bg-[var(--color-surface-base)] text-[var(--color-text-strong)] shadow-sm hover:bg-[var(--color-surface-soft)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/14",
        secondary: "border home-border bg-[var(--color-surface-base)] home-heading shadow-sm hover:bg-[var(--color-home-panel-soft)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/14",
        chip: "border-[var(--color-border-strong)] bg-[var(--color-surface-base)] text-[var(--color-text-strong)] shadow-none hover:bg-[var(--color-surface-soft)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/14",
        ghost: "bg-transparent text-[var(--color-text-strong)] hover:bg-[var(--color-surface-soft)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/14",
        link: "text-[var(--color-brand-primary)] underline-offset-4 hover:text-[var(--color-brand-primary-hover)] hover:underline",
        social: "w-full flex items-center justify-center gap-2 rounded-full border border-[var(--color-border-default)] bg-[var(--color-surface-base)] p-2 text-[var(--color-text-default)] shadow-sm transition-all duration-300 hover:bg-[var(--color-surface-soft)]",
      },
    },
    defaultVariants: {
      varinat: "default",
    },
  }
);

const buttonSizeVariants = cva("", {
  variants: {
    size: {
      default: "px-5 py-2.5 text-sm",
      xs: "px-2.5 py-1 text-[10px]",
      sm: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-sm",
      icon: "aspect-square p-2.5 text-2xl",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonToneVariants>,
  VariantProps<typeof buttonSizeVariants> {
  children: ReactNode;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  tooltipDelay?: number;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  varinat,
  size,
  className,
  tooltip,
  tooltipPosition,
  tooltipDelay,
  ...props
}, ref) => {
  const buttonElement = (
    <button
      ref={ref}
      {...getTooltipAttributes(tooltip, tooltipPosition)}
      data-tooltip-delay={tooltip ? tooltipDelay : undefined}
      className={cn(
      buttonBaseClasses,
      buttonToneVariants({ varinat }),
      buttonSizeVariants({ size }),
      className
    )}
      {...props}
    >
      {children}
    </button>
  );

  if (!tooltip) {
    return buttonElement;
  }
  return buttonElement;
});

Button.displayName = "Button";

export default Button;
