import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { cn } from "../../utils";

export type OverflowActionMenuItem = {
  id: string;
  label: string;
  Icon: ElementType;
  onSelect: () => void;
  disabled?: boolean;
  checked?: boolean;
  tone?: "danger";
};

type OverflowActionsMenuProps = {
  anchorRef: RefObject<HTMLButtonElement | null>;
  ariaLabel: string;
  items: readonly OverflowActionMenuItem[];
  onClose: () => void;
};

const VIEWPORT_MARGIN = 8;
const TRIGGER_GAP = 8;
const MIN_MENU_HEIGHT = 120;

export default function OverflowActionsMenu({
  anchorRef,
  ariaLabel,
  items,
  onClose,
}: OverflowActionsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<CSSProperties>();

  const updatePosition = useCallback(() => {
    const anchor = anchorRef.current;
    const menu = menuRef.current;
    if (!anchor || !menu) return;

    const anchorRect = anchor.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const maximumWidth = Math.max(0, window.innerWidth - VIEWPORT_MARGIN * 2);
    const menuWidth = Math.min(menuRect.width, maximumWidth);
    const maximumLeft = Math.max(
      VIEWPORT_MARGIN,
      window.innerWidth - menuWidth - VIEWPORT_MARGIN
    );
    const left = Math.min(
      Math.max(VIEWPORT_MARGIN, anchorRect.right - menuWidth),
      maximumLeft
    );
    const spaceBelow =
      window.innerHeight - anchorRect.bottom - TRIGGER_GAP - VIEWPORT_MARGIN;
    const spaceAbove = anchorRect.top - TRIGGER_GAP - VIEWPORT_MARGIN;
    const placeBelow =
      spaceBelow >= Math.min(menu.scrollHeight, MIN_MENU_HEIGHT) ||
      spaceBelow >= spaceAbove;
    const availableHeight = Math.max(0, placeBelow ? spaceBelow : spaceAbove);
    const renderedHeight = Math.min(menu.scrollHeight, availableHeight);
    const top = placeBelow
      ? anchorRect.bottom + TRIGGER_GAP
      : Math.max(VIEWPORT_MARGIN, anchorRect.top - TRIGGER_GAP - renderedHeight);

    setPosition({
      left,
      top,
      maxWidth: maximumWidth,
      maxHeight: availableHeight,
      visibility: "visible",
    });
  }, [anchorRef]);

  useLayoutEffect(() => {
    updatePosition();

    let frameId: number | undefined;
    const schedulePositionUpdate = () => {
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updatePosition);
    };

    window.addEventListener("resize", schedulePositionUpdate);
    window.addEventListener("scroll", schedulePositionUpdate, true);
    const observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(schedulePositionUpdate);
    if (anchorRef.current) observer?.observe(anchorRef.current);
    if (menuRef.current) observer?.observe(menuRef.current);

    return () => {
      window.removeEventListener("resize", schedulePositionUpdate);
      window.removeEventListener("scroll", schedulePositionUpdate, true);
      observer?.disconnect();
      if (frameId !== undefined) window.cancelAnimationFrame(frameId);
    };
  }, [anchorRef, updatePosition]);

  useEffect(() => {
    menuRef.current
      ?.querySelector<HTMLButtonElement>("button:not(:disabled)")
      ?.focus();
  }, []);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={menuRef}
      role="menu"
      aria-label={ariaLabel}
      style={{ visibility: "hidden", ...position }}
      className="home-dropdown fixed z-50 w-max overflow-auto overscroll-contain rounded-2xl border p-3 shadow-xl"
      onMouseDown={(event) => event.stopPropagation()}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
    >
      <ul className="space-y-1 text-sm text-gray-700">
        {items.map(({ id, label, Icon, onSelect, disabled, checked, tone }) => (
          <li key={id}>
            <button
              type="button"
              role={checked === undefined ? "menuitem" : "menuitemcheckbox"}
              aria-checked={checked}
              disabled={disabled}
              data-test-id={label}
              className={cn(
                "home-dropdown-item flex w-full items-center gap-3 rounded-xl p-1 pr-3 text-left font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/30",
                "disabled:cursor-not-allowed disabled:opacity-40",
                tone === "danger" && "text-rose-600 hover:bg-rose-50"
              )}
              onClick={() => {
                onSelect();
                onClose();
              }}
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-primary-softest)] text-login-primary">
                <Icon className="h-4 w-4 shrink-0" />
              </span>
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>,
    document.body
  );
}
