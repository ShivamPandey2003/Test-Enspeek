import { useEffect, useLayoutEffect, useRef } from "react";
import type { ChatMessage } from "../types";

const RESPONSE_SCROLL_GAP = 12;

type UseChatScrollParams = {
  scrollMode: "internal" | "external";
  pathname: string;
  isHomePageSurface: boolean;
  hasLoadedHistory: boolean;
  isHistoryLoading: boolean;
  isTyping: boolean;
  pending: boolean;
  hasMoreHistory: boolean;
  isOlderHistoryLoading: boolean;
  messages: ChatMessage[];
  visibleMessages: ChatMessage[];
  loadOlderHistory: () => Promise<boolean>;
};

/**
 * Encapsulates the entire chat scrolling system: scroll-anchoring for new
 * messages, "load older history" preservation, and bottom-pinning.
 *
 * The behaviour — including every timing constant and effect dependency array —
 * is a verbatim extraction of the logic that previously lived in ChatWindow.
 */
export const useChatScroll = ({
  scrollMode,
  pathname,
  isHomePageSurface,
  hasLoadedHistory,
  isHistoryLoading,
  isTyping,
  pending,
  hasMoreHistory,
  isOlderHistoryLoading,
  messages,
  visibleMessages,
  loadOlderHistory,
}: UseChatScrollParams) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messageRowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrollTimersRef = useRef<number[]>([]);
  const latestRowObserverRef = useRef<ResizeObserver | null>(null);
  const olderHistoryScrollSnapshotRef = useRef<{
    element: HTMLElement;
    scrollHeight: number;
  } | null>(null);
  const previousChatStateRef = useRef({
    hasLoadedHistory,
    isHistoryLoading,
    messageCount: messages.length,
    isTyping,
    latestMessage: messages[messages.length - 1] as ChatMessage | undefined,
    pending,
  });

  const findScrollableAncestor = (element: HTMLElement | null) => {
    let current = element?.parentElement ?? null;

    while (current) {
      const style = window.getComputedStyle(current);
      const canScroll =
        /(auto|scroll)/.test(style.overflowY) &&
        current.scrollHeight > current.clientHeight;

      if (canScroll) {
        return current;
      }
      current = current.parentElement;
    }

    return null;
  };
  const getScrollElement = () => {
    if (scrollMode === "internal") {
      return scrollContainerRef.current;
    }

    return findScrollableAncestor(rootRef.current);
  };
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const scrollElement = getScrollElement();

    if (!scrollElement) return;
    scrollElement.scrollTo({
      top: scrollElement.scrollHeight,
      behavior,
    });
  };
  const clearScheduledScrolls = () => {
    scrollTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    scrollTimersRef.current = [];
  };
  const disconnectLatestRowObserver = () => {
    latestRowObserverRef.current?.disconnect();
    latestRowObserverRef.current = null;
  };
  const scheduleScroll = (callback: () => void, delay = 0) => {
    const timer = window.setTimeout(() => {
      scrollTimersRef.current = scrollTimersRef.current.filter(
        (activeTimer) => activeTimer !== timer
      );
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(callback);
      });
    }, delay);
    scrollTimersRef.current.push(timer);
  };
  const scrollMessageRowIntoView = (index: number) => {
    const container = getScrollElement();
    const row = messageRowRefs.current[index];

    if (!container || !row) return;
    const containerRect = container.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const nextScrollTop =
      container.scrollTop + (rowRect.top - containerRect.top) - RESPONSE_SCROLL_GAP;

    container.scrollTop = Math.max(nextScrollTop, 0);
  };
  const scheduleRowAlignment = (index: number) => {
    clearScheduledScrolls();
    disconnectLatestRowObserver();
    [0, 80, 160, 280, 440].forEach((delay) => {
      scheduleScroll(() => scrollMessageRowIntoView(index), delay);
    });

    const row = messageRowRefs.current[index];
    if (!row || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      scrollMessageRowIntoView(index);
    });
    observer.observe(row);
    latestRowObserverRef.current = observer;

    scheduleScroll(() => {
      disconnectLatestRowObserver();
    }, 900);
  };
  const scheduleBottomScroll = (behavior: ScrollBehavior = "smooth") => {
    clearScheduledScrolls();
    disconnectLatestRowObserver();
    [0, 80, 180, 360, 700].forEach((delay) => {
      scheduleScroll(() => scrollToBottom(behavior), delay);
    });
  };

  useEffect(() => {
    return () => {
      clearScheduledScrolls();
      disconnectLatestRowObserver();
    };
  }, []);

  useEffect(() => {
    const scrollElement = getScrollElement();
    if (!scrollElement) return;

    const handleScroll = () => {
      if (
        scrollElement.scrollTop > 4 ||
        !hasMoreHistory ||
        isOlderHistoryLoading
      ) {
        return;
      }

      olderHistoryScrollSnapshotRef.current = {
        element: scrollElement,
        scrollHeight: scrollElement.scrollHeight,
      };
      clearScheduledScrolls();
      disconnectLatestRowObserver();

      void loadOlderHistory().then((didLoad) => {
        if (!didLoad) {
          olderHistoryScrollSnapshotRef.current = null;
        }
      });
    };

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
    };
  }, [hasMoreHistory, isOlderHistoryLoading, loadOlderHistory]);

  useLayoutEffect(() => {
    scheduleBottomScroll();
  }, [pathname]);

  useLayoutEffect(() => {
    if (isOlderHistoryLoading) return;

    const snapshot = olderHistoryScrollSnapshotRef.current;
    if (!snapshot) return;

    snapshot.element.scrollTop =
      snapshot.element.scrollHeight - snapshot.scrollHeight;
    olderHistoryScrollSnapshotRef.current = null;
  }, [isOlderHistoryLoading, messages.length]);

  useLayoutEffect(() => {
    const previousState = previousChatStateRef.current;
    const latestMessage = visibleMessages[visibleMessages.length - 1];
    const messageAdded = visibleMessages.length > previousState.messageCount;
    const initialHistoryLoaded =
      previousState.isHistoryLoading && !isHistoryLoading && visibleMessages.length > 0;
    const olderHistoryPrepended =
      messageAdded && previousState.latestMessage === latestMessage;
    const thinkingStarted =
      (isTyping || pending) && !(previousState.isTyping || previousState.pending);

    if (initialHistoryLoaded) {
      scheduleBottomScroll("auto");
    } else if (olderHistoryPrepended) {
      // Keep the user's scroll position stable when older history is prepended.
    } else if (messageAdded && latestMessage?.sender === "user") {
      scheduleBottomScroll();
    } else if (thinkingStarted) {
      scheduleBottomScroll();
    } else if (messageAdded && latestMessage) {
      scheduleRowAlignment(visibleMessages.length - 1);
    }

    previousChatStateRef.current = {
      hasLoadedHistory,
      isHistoryLoading,
      messageCount: visibleMessages.length,
      isTyping,
      latestMessage,
      pending,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLoadedHistory, isHistoryLoading, isHomePageSurface, isTyping, pending, visibleMessages]);

  return {
    rootRef,
    messagesEndRef,
    scrollContainerRef,
    messageRowRefs,
    scheduleBottomScroll,
  };
};

export default useChatScroll;
