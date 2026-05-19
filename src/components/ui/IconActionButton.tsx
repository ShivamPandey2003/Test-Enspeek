import * as React from "react";
import { cn } from "../../utils";
import { getTooltipAttributes, type TooltipPosition } from "./Tooltip";

type IconActionTone =
  | "neutral"
  | "primary"
  | "info"
  | "success"
  | "warning"
  | "danger";

const toneClassMap: Record<IconActionTone, string> = {
  neutral:
    "questionnaire-clickable crosstab-muted rounded-full p-2 transition-colors hover:bg-[var(--color-brand-primary-softest)] hover:text-login-primary",
  primary:
    "questionnaire-clickable rounded-full p-2 text-login-primary transition-colors hover:bg-[var(--color-brand-primary-softest)]",
  info:
    "questionnaire-clickable rounded-full p-2 text-[var(--color-brand-info)] transition-colors hover:bg-[var(--color-brand-info-soft)]",
  success:
    "questionnaire-clickable rounded-full p-2 text-[var(--color-questionnaire-multi)] transition-colors hover:bg-[var(--color-questionnaire-open-bg)]",
  warning:
    "questionnaire-clickable rounded-full p-2 text-[var(--color-study-progress)] transition-colors hover:bg-[var(--color-home-panel-soft)]",
  danger:
    "questionnaire-clickable rounded-full p-2 text-[var(--color-questionnaire-stop)] transition-colors hover:bg-[var(--color-questionnaire-stop-bg)]",
};

type IconActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: IconActionTone;
  tooltip?: string;
  tooltipPosition?: TooltipPosition;
  tooltipDelay?: number;
};

const IconActionButton = React.forwardRef<
  HTMLButtonElement,
  IconActionButtonProps
>(
  (
    {
      className,
      tone = "neutral",
      type = "button",
      tooltip,
      tooltipPosition,
      tooltipDelay,
      ...props
    },
    ref
  ) => {
    const buttonElement = (
      <button
        ref={ref}
        type={type}
        {...getTooltipAttributes(tooltip, tooltipPosition)}
        data-tooltip-delay={tooltip ? tooltipDelay : undefined}
        className={cn(toneClassMap[tone], className)}
        {...props}
      />
    );

    if (!tooltip) {
      return buttonElement;
    }

    return buttonElement;
  }
);

IconActionButton.displayName = "IconActionButton";

export default IconActionButton;
