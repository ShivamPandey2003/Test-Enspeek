import React from "react";
import { createPortal } from "react-dom";
import Button from "../../../ui/Button";

type TruncatedSuggestionButtonProps = {
  item: string;
  disabled: boolean;
  onClick: () => void;
};

const TOOLTIP_VIEWPORT_MARGIN = 8;
const TOOLTIP_OFFSET = 8;

type TooltipLayout = {
  left: number;
  top: number;
  placement: "top" | "bottom";
};

const TruncatedSuggestionButton = ({
  item,
  disabled,
  onClick,
}: TruncatedSuggestionButtonProps) => {
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = React.useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = React.useState(false);
  const [tooltipLayout, setTooltipLayout] =
    React.useState<TooltipLayout | null>(null);

  React.useLayoutEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const updateTruncation = () => {
      setIsTruncated(textElement.scrollWidth > textElement.clientWidth);
    };

    updateTruncation();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateTruncation);
      return () => window.removeEventListener("resize", updateTruncation);
    }

    let animationFrameId: number | undefined;
    const observer = new ResizeObserver(() => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      animationFrameId = window.requestAnimationFrame(updateTruncation);
    });
    observer.observe(textElement);

    return () => {
      observer.disconnect();
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [item]);

  // Measure the trigger + tooltip and pick a placement that stays inside the
  // viewport: prefer above (the suggestion bar sits at the bottom of the
  // screen), flip below when there is no room, and clamp horizontally.
  const updateTooltipLayout = React.useCallback(() => {
    const wrapper = wrapperRef.current;
    const tooltip = tooltipRef.current;
    if (!wrapper || !tooltip) return;

    const triggerRect = wrapper.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    const fitsAbove =
      triggerRect.top - TOOLTIP_OFFSET - tooltipRect.height >=
      TOOLTIP_VIEWPORT_MARGIN;
    const placement: TooltipLayout["placement"] = fitsAbove ? "top" : "bottom";

    const top = fitsAbove
      ? triggerRect.top - TOOLTIP_OFFSET - tooltipRect.height
      : triggerRect.bottom + TOOLTIP_OFFSET;

    const centeredLeft =
      triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
    const maxLeft =
      window.innerWidth - tooltipRect.width - TOOLTIP_VIEWPORT_MARGIN;
    const left = Math.min(Math.max(centeredLeft, TOOLTIP_VIEWPORT_MARGIN), maxLeft);

    setTooltipLayout({ left, top, placement });
  }, []);

  React.useLayoutEffect(() => {
    if (!isTooltipOpen) return;

    // Coalesce scroll/resize bursts (capture-phase scroll can fire once per
    // scrollable ancestor in a single frame) into one layout pass per frame.
    let scheduledAnimationFrame: number | null = null;
    const handleScrollOrResize = () => {
      if (scheduledAnimationFrame !== null) return;
      scheduledAnimationFrame = window.requestAnimationFrame(() => {
        scheduledAnimationFrame = null;
        updateTooltipLayout();
      });
    };

    updateTooltipLayout();

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);
    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      if (scheduledAnimationFrame !== null) {
        window.cancelAnimationFrame(scheduledAnimationFrame);
      }
    };
  }, [isTooltipOpen, updateTooltipLayout]);

  const showTooltip = () => {
    if (isTruncated) setIsTooltipOpen(true);
  };
  const hideTooltip = () => {
    setIsTooltipOpen(false);
    setTooltipLayout(null);
  };

  return (
    // Hover handlers live on a wrapper so the tooltip still works while the
    // button is disabled (disabled buttons swallow mouse events).
    <span
      ref={wrapperRef}
      className="inline-flex min-w-0 shrink-0"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      <Button
        type="button"
        variant="chip"
        size="default"
        disabled={disabled}
        className="h-auto min-w-0 max-w-48 shrink-0 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-1.5 text-left text-sm font-medium leading-snug text-slate-700 shadow-sm transition-colors hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-700 active:scale-[0.97]"
        onClick={onClick}
      >
        <span ref={textRef} className="block min-w-0 max-w-full truncate">
          {item}
        </span>
      </Button>
      {isTooltipOpen &&
        isTruncated &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            className="pointer-events-none fixed z-[9999] max-w-xs rounded-lg bg-[var(--color-text-strong)] px-3 py-2 text-[12px] font-medium leading-snug text-white shadow-lg transition-opacity duration-150"
            style={{
              left: tooltipLayout?.left ?? 0,
              top: tooltipLayout?.top ?? 0,
              // Hide until the first layout pass has measured the tooltip so
              // it never flashes at the wrong position.
              opacity: tooltipLayout ? 1 : 0,
            }}
            data-placement={tooltipLayout?.placement}
          >
            {item}
          </div>,
          document.body,
        )}
    </span>
  );
};

export default TruncatedSuggestionButton;
