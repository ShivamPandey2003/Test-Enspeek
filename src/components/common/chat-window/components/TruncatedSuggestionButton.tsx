import React from "react";
import Button from "../../../ui/Button";

type TruncatedSuggestionButtonProps = {
  item: string;
  disabled: boolean;
  onClick: () => void;
};

const TruncatedSuggestionButton = ({
  item,
  disabled,
  onClick,
}: TruncatedSuggestionButtonProps) => {
  const textRef = React.useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = React.useState(false);

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

  return (
    <Button
      type="button"
      variant="chip"
      size="default"
      disabled={disabled}
      title={isTruncated ? item : undefined}
      className="h-auto min-h-8 min-w-0 max-w-full rounded-full border home-border bg-white px-2.5 py-1.5 text-left text-[13px] font-semibold leading-snug shadow-sm hover:bg-brand-primary-softest"
      onClick={onClick}
    >
      <span ref={textRef} className="block min-w-0 max-w-full truncate">
        {item}
      </span>
    </Button>
  );
};

export default TruncatedSuggestionButton;
