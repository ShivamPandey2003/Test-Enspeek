import React from "react";
import { LuMessageCircle, LuX } from "react-icons/lu";
import { cn } from "../../utils";
import Button from "../ui/Button";
import ChatWindow from "../common/chat-window/chat";
import ChatTextArea from "./chattextares";
import { FOCUS_CHAT_INPUT_EVENT } from "../../utils/modalFocus";
import { useLocation } from "react-router";
import {
  isFloatingChatDisabledPath,
  useHasOpenModal,
} from "../../utils/useFloatingChatVisibility";

const MOBILE_CHAT_POSITION_KEY = "enspeek-mobile-chat-button-position";
const MOBILE_CHAT_QUERY = "(max-width: 767px)";
const BUTTON_SIZE = 58;
const EDGE_GAP = 16;
const MOBILE_NAV_CLEARANCE = 64;
const DRAG_THRESHOLD = 6;

type ButtonPosition = {
  x: number;
  y: number;
};

const getDefaultPosition = (bottomClearance: number): ButtonPosition => ({
  x: Math.max(EDGE_GAP, window.innerWidth - BUTTON_SIZE - EDGE_GAP),
  y: Math.max(
    EDGE_GAP,
    window.innerHeight - BUTTON_SIZE - EDGE_GAP - bottomClearance
  ),
});

const clampPosition = (
  position: ButtonPosition,
  bottomClearance: number
): ButtonPosition => ({
  x: Math.min(
    Math.max(position.x, EDGE_GAP),
    Math.max(EDGE_GAP, window.innerWidth - BUTTON_SIZE - EDGE_GAP)
  ),
  y: Math.min(
    Math.max(position.y, EDGE_GAP),
    Math.max(
      EDGE_GAP,
      window.innerHeight - BUTTON_SIZE - EDGE_GAP - bottomClearance
    )
  ),
});

const readStoredPosition = (bottomClearance: number): ButtonPosition => {
  try {
    if (typeof window === "undefined") return { x: EDGE_GAP, y: EDGE_GAP };

    const storedValue = sessionStorage.getItem(MOBILE_CHAT_POSITION_KEY);
    if (!storedValue) return getDefaultPosition(bottomClearance);

    const parsedValue = JSON.parse(storedValue) as Partial<ButtonPosition>;
    if (
      typeof parsedValue.x !== "number" ||
      typeof parsedValue.y !== "number"
    ) {
      return getDefaultPosition(bottomClearance);
    }

    return clampPosition(
      {
        x: parsedValue.x,
        y: parsedValue.y,
      },
      bottomClearance
    );
  } catch {
    return getDefaultPosition(bottomClearance);
  }
};

const storePosition = (position: ButtonPosition, bottomClearance: number) => {
  try {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(
      MOBILE_CHAT_POSITION_KEY,
      JSON.stringify(clampPosition(position, bottomClearance))
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
  const { pathname } = useLocation();
  const hasOpenModal = useHasOpenModal();
  const hideFloatingLauncher =
    hasOpenModal || isFloatingChatDisabledPath(pathname);
  const bottomClearance = pathname === "/" ? 0 : MOBILE_NAV_CLEARANCE;
  const [isOpen, setIsOpen] = React.useState(false);
  const [isMobileViewport, setIsMobileViewport] = React.useState(getIsMobileViewport);
  const [shouldRenderSheet, setShouldRenderSheet] = React.useState(false);
  const [position, setPosition] = React.useState<ButtonPosition | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const suppressNextClickRef = React.useRef(false);
  const dragAnimationFrameRef = React.useRef<number | null>(null);
  const pendingDragPositionRef = React.useRef<ButtonPosition | null>(null);
  const dragStateRef = React.useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    pointerStartX: number;
    pointerStartY: number;
    didDrag: boolean;
  } | null>(null);

  const setPositionOnFrame = React.useCallback((nextPosition: ButtonPosition) => {
    pendingDragPositionRef.current = nextPosition;

    if (dragAnimationFrameRef.current !== null) {
      return;
    }

    dragAnimationFrameRef.current = window.requestAnimationFrame(() => {
      dragAnimationFrameRef.current = null;

      if (pendingDragPositionRef.current) {
        setPosition(pendingDragPositionRef.current);
      }
    });
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;

    const timeout = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent(FOCUS_CHAT_INPUT_EVENT));
    }, 320);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  React.useEffect(() => {
    return () => {
      if (dragAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(dragAnimationFrameRef.current);
      }
    };
  }, []);

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

    setPosition(readStoredPosition(bottomClearance));

    const handleResize = () => {
      setPosition((currentPosition) => {
        const nextPosition = clampPosition(
          currentPosition ?? getDefaultPosition(bottomClearance),
          bottomClearance
        );
        storePosition(nextPosition, bottomClearance);
        return nextPosition;
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [bottomClearance, isMobileViewport]);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!position) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
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

    const nextPosition = clampPosition(
      {
        x: dragState.startX + deltaX,
        y: dragState.startY + deltaY,
      },
      bottomClearance
    );

    setPositionOnFrame(nextPosition);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLButtonElement>) => {
    const dragState = dragStateRef.current;
    if (!dragState || dragState.pointerId !== event.pointerId) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStateRef.current = null;
    setIsDragging(false);

    setPosition((currentPosition) => {
      const nextPosition = clampPosition(
        pendingDragPositionRef.current ??
          currentPosition ??
          getDefaultPosition(bottomClearance),
        bottomClearance
      );
      pendingDragPositionRef.current = null;
      storePosition(nextPosition, bottomClearance);
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
            <div className="flex h-[calc(100dvh-4.5rem)] max-h-[760px] min-h-[min(360px,calc(100dvh-4.5rem))] flex-col overflow-hidden">
              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                <ChatWindow surface="card" scrollMode="external" />
              </div>
              <ChatTextArea placement="mobileSheet" />
            </div>
          </div>
        </div>
      ) : null}

      {!isOpen && !hideFloatingLauncher ? (
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
            pendingDragPositionRef.current = null;
            setIsDragging(false);
          }}
          className={cn(
            "fixed left-0 top-0 z-[110] h-[58px] w-[58px] touch-none border-0 bg-login-primary text-white shadow-[0_8px_18px_rgba(79,86,230,0.28)] will-change-transform hover:bg-login-primary-hover active:scale-95 [&_svg]:!h-[30px] [&_svg]:!w-[30px]",
            isDragging ? "transition-none" : "transition-transform duration-150 ease-out"
          )}
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          }}
        >
          <LuMessageCircle />
        </Button>
      ) : null}
    </div>
  );
}
