import { useCallback, useEffect, useRef, useState } from "react";

export function useOverflowMenu(enabled: boolean) {
  const [isOpen, setIsOpen] = useState(false);
  const boundaryRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback((restoreFocus = true) => {
    setIsOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    if (!enabled) setIsOpen(false);
  }, [enabled]);

  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!boundaryRef.current?.contains(event.target as Node)) {
        close(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, isOpen]);

  return {
    boundaryRef,
    close,
    isOpen,
    setIsOpen,
    triggerRef,
  };
}
