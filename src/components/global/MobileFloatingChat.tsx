import React from "react";
import { LuMessageCircle, LuX } from "react-icons/lu";
import { cn } from "../../utils";
import Button from "../ui/Button";
import ChatWindow from "../common/chat-window/chat";
import ChatTextArea from "./chattextares";
import { FOCUS_CHAT_INPUT_EVENT } from "../../utils/modalFocus";

const MOBILE_CHAT_POSITION_KEY = "enspeek-mobile-chat-button-position";
const MOBILE_CHAT_QUERY = "(max-width: 767px)";
const BUTTON_SIZE = 48;
const EDGE_GAP = 16;
const DRAG_THRESHOLD = 6;

type ButtonPosition = {
  x: number;
  y: number;
};

const getDefaultPosition = (): ButtonPosition => ({
  x: Math.max(EDGE_GAP, window.innerWidth - BUTTON_SIZE - EDGE_GAP),
  y: Math.max(EDGE_GAP, window.innerHeight - BUTTON_SIZE - EDGE_GAP),
});

const clampPosition = (position: ButtonPosition): ButtonPosition => ({
  x: Math.min(
    Math.max(position.x, EDGE_GAP),
    Math.max(EDGE_GAP, window.innerWidth - BUTTON_SIZE - EDGE_GAP)
  ),
  y: Math.min(
    Math.max(position.y, EDGE_GAP),
    Math.max(EDGE_GAP, window.innerHeight - BUTTON_SIZE - EDGE_GAP)
  ),
});

const readStoredPosition = (): ButtonPosition => {
  try {
    if (typeof window === "undefined") return { x: EDGE_GAP, y: EDGE_GAP };

    const storedValue = sessionStorage.getItem(MOBILE_CHAT_POSITION_KEY);
    if (!storedValue) return getDefaultPosition();

    const parsedValue = JSON.parse(storedValue) as Partial<ButtonPosition>;
    if (
      typeof parsedValue.x !== "number" ||
      typeof parsedValue.y !== "number"
    ) {
      return getDefaultPosition();
    }

    return clampPosition({
      x: parsedValue.x,
      y: parsedValue.y,
    });
  } catch {
    return getDefaultPosition();
  }
};

const storePosition = (position: ButtonPosition) => {
  try {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(
      MOBILE_CHAT_POSITION_KEY,
      JSON.stringify(clampPosition(position))
    );
  } catch {
    // Position memory is a convenience; dragging should still work without storage.
  }
};

const getIsMobileViewport = () => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia(MOBILE_CHAT_QUERY).matches;
};

export default function MobileFloatingChat() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobileViewport, setIsMobileViewport] = React.useState(getIsMobileViewport);
  const [shouldRenderSheet, setShouldRenderSheet] = React.useState(false);
  const [position, setPosition] = React.useState<ButtonPosition | null>(null);
  const suppressNextClickRef = React.useRef(false);
  const dragStateRef = React.useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    pointerStartX: number;
    pointerStartY: number;
    didDrag: boolean;
  } | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const timeout = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(FOCUS_CHAT_INPUT_EVENT));
    }, 320);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      setShouldRenderSheet(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setShouldRenderSheet(false);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  React.useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_CHAT_QUERY);
    const handleViewportChange = (event: MediaQueryListEvent) => {
      setIsMobileViewport(event.matches);
      if (!event.matches) {
        setIsOpen(false);
        setShouldRenderSheet(false);
      }
    };
    const legacyMediaQuery = mediaQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };

    setIsMobileViewport(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleViewportChange);
    } else {
      legacyMediaQuery.addListener?.(handleViewportChange);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleViewportChange);
      } else {
        legacyMediaQuery.removeListener?.(handleViewportChange);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!isMobileViewport) {
      setPosition(null);
      return;
    }

    setPosition(readStoredPosition());

    const handleResize = () => {
      setPosition((currentPosition) => {
        const nextPosition = clampPosition(currentPosition ?? getDefaultPosition());
        storePosition(nextPosition);
        return nextPosition;
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [isMobileViewport]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!position) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      pointerId: event.pointerId,
      startX: position.x,
      startY: position.y,
      pointerStartX: event.clientX,
      pointerStartY: event.clientY,
      didDrag: false,
    };
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - dragState.pointerStartX;
    const deltaY = event.clientY - dragState.pointerStartY;

    if (
      Math.abs(deltaX) > DRAG_THRESHOLD ||
      Math.abs(deltaY) > DRAG_THRESHOLD
    ) {
      dragState.didDrag = true;
    }

    const nextPosition = clampPosition({
      x: dragState.startX + deltaX,
      y: dragState.startY + deltaY,
    });

    setPosition(nextPosition);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = null;

    setPosition((currentPosition) => {
      const nextPosition = clampPosition(currentPosition ?? getDefaultPosition());
      storePosition(nextPosition);
      return nextPosition;
    });

    if (dragState.didDrag) {
      suppressNextClickRef.current = true;
      window.setTimeout(() => {
        suppressNextClickRef.current = false;
      }, 0);
      event.preventDefault();
    }
  };

  if (!isMobileViewport || !position) return null;

  return (
    <div className="md:hidden">
      <div
        className={cn(
          "fixed inset-0 z-[80] bg-[var(--color-overlay)] transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        aria-hidden="true"
      />
      {shouldRenderSheet ? (
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-[90] transform-gpu transition-all duration-300 ease-out",
            isOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-6 opacity-0"
          )}
        >
          <Button
            type="button"
            variant="theme"
            size="icon"
            aria-label="Close mobile chat"
            tooltip="Close chat"
            onClick={() => setIsOpen(false)}
            className="home-surface absolute -top-12 right-4 z-[95] h-10 w-10 border home-border text-login-primary shadow-sm hover:bg-[var(--color-brand-primary-softest)] [&_svg]:!h-5 [&_svg]:!w-5"
          >
            <LuX />
          </Button>
          <div className="relative mx-3 mb-3 overflow-hidden rounded-t-[24px] rounded-b-[18px] border home-border bg-white shadow-[0_22px_70px_rgba(29,36,86,0.24)]">
            <div className="flex h-[min(76dvh,680px)] max-h-[calc(100dvh-5.5rem)] min-h-[min(360px,calc(100dvh-5.5rem))] flex-col overflow-hidden">
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                <ChatWindow surface="card" scrollMode="external" />
              </div>
              <ChatTextArea placement="mobileSheet" />
            </div>
          </div>
        </div>
      ) : null}

      {!isOpen ? (
        <Button
          type="button"
          variant="theme"
          size="icon"
          aria-label="Open mobile chat"
          tooltip="Open chat"
          onClick={() => {
            if (suppressNextClickRef.current) {
              suppressNextClickRef.current = false;
              return;
            }

            setIsOpen(true);
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={() => {
            dragStateRef.current = null;
          }}
          className="fixed z-[110] h-12 w-12 touch-none border-0 bg-login-primary text-white shadow-[0_12px_26px_rgba(79,86,230,0.32)] transition-transform duration-200 hover:bg-login-primary-hover active:scale-95 [&_svg]:!h-6 [&_svg]:!w-6"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          <LuMessageCircle />
        </Button>
      ) : null}
    </div>
  );
}
