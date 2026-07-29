import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { clearPendingSuggestions } from "../../store/ChatSlice";
import { cn, handleKeyPress } from "../../utils";
import { LuListChecks, LuMessageCircle, LuSend } from "react-icons/lu";
import { useLocation } from "react-router";
import NewDropdown from "./NewDropDown";
import buildPromptItems from "./PromptsList";
import useAiChat from "../../api-network/global/ai-chat";
import Button from "../ui/Button";
import {
  FOCUS_CHAT_INPUT_EVENT,
  MODAL_CLOSE_FOCUS_CHAT_EVENT,
} from "../../utils/modalFocus";
import { useChatHistoryContextStatus } from "../../utils/useChatHistoryContextStatus";
import {
  isFloatingChatDisabledPath,
  useHasOpenModal,
} from "../../utils/useFloatingChatVisibility";
import TruncatedSuggestionButton from "../common/chat-window/components/TruncatedSuggestionButton";

interface ChatTextAreaProps {
  placement?: "floating" | "panel" | "mobileSheet";
}

const ChatTextArea: React.FC<ChatTextAreaProps> = ({
  placement = "floating",
}) => {
  const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const selectionRef = React.useRef<{ start: number; end: number } | null>(
    null,
  );
  const {
    hasLoadedHistory,
    isHistoryLoading,
    isTyping,
    isChatOpen,
    pending,
    pendingSuggestionCount,
    message,
  } = useSelector((state: RootState) => state.chat);
  const { pathname } = useLocation();
  const hasOpenModal = useHasOpenModal();
  const isHome = pathname === "/";
  const isPanelPlacement = placement === "panel";
  const isMobileSheetPlacement = placement === "mobileSheet";
  const hideFloatingLauncher =
    hasOpenModal || isFloatingChatDisabledPath(pathname);
  const { messages, openChat, sendMessage, setDraftMessage } = useAiChat();
  const dispatch = useDispatch();
  const latestSuggestions = messages[messages.length - 1]?.suggestion?.list as
    | string[]
    | undefined;
  const suggestionList: string[] = React.useMemo(
    () => latestSuggestions ?? [],
    [latestSuggestions],
  );
  const hasSuggestions = suggestionList.length > 0;
  // Keep the last non-empty list around while the bar fades out so it doesn't
  // pop away with empty content mid-transition, and flip `isSuggestionsShown`
  // a frame after mount so the fade/slide-in actually animates.
  const [visibleSuggestions, setVisibleSuggestions] = React.useState<string[]>(
    [],
  );
  const [isSuggestionsShown, setIsSuggestionsShown] = React.useState(false);
  React.useEffect(() => {
    if (hasSuggestions) {
      setVisibleSuggestions(suggestionList);
      const frameId = window.requestAnimationFrame(() =>
        setIsSuggestionsShown(true),
      );
      return () => window.cancelAnimationFrame(frameId);
    }
    setIsSuggestionsShown(false);
    const timeoutId = window.setTimeout(() => setVisibleSuggestions([]), 300);
    return () => window.clearTimeout(timeoutId);
  }, [hasSuggestions, suggestionList]);
  const isMobileSheetEmpty = isMobileSheetPlacement && message.length === 0;
  const { isCurrentHistoryContext } = useChatHistoryContextStatus();
  const isChatInputDisabled =
    !isCurrentHistoryContext ||
    !hasLoadedHistory ||
    isHistoryLoading ||
    isTyping ||
    pending ||
    pendingSuggestionCount > 0;

  const focusChatInput = React.useCallback((moveCaretToEnd = false) => {
    const textarea = internalTextareaRef.current;
    if (!textarea) return;

    textarea.focus();

    if (moveCaretToEnd) {
      const caretPosition = textarea.value.length;
      textarea.setSelectionRange(caretPosition, caretPosition);
    }
  }, []);
  const promptItems = React.useMemo(() => buildPromptItems(setDraftMessage), [setDraftMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.selectionStart !== null && e.target.selectionEnd !== null) {
      selectionRef.current = {
        start: e.target.selectionStart,
        end: e.target.selectionEnd,
      };
    }

    setDraftMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleOpen = () => {
    openChat();
  };

  const sendMessageRef = React.useRef(sendMessage);
  React.useEffect(() => {
    sendMessageRef.current = sendMessage;
  });
  const handleSend = React.useCallback((value: string) => {
    sendMessageRef.current(value);
  }, []);

  // Suggestions now render immediately in this bar (the old ChatSuggestionBlock
  // that released this lock via onSuggestionsVisible is no longer rendered), so
  // clear the pending-suggestion lock here once they're on screen. Without this
  // the count never returns to 0 and isChatInputDisabled latches to true.
  React.useEffect(() => {
    if (hasSuggestions && pendingSuggestionCount > 0) {
      dispatch(clearPendingSuggestions());
    }
  }, [dispatch, hasSuggestions, pendingSuggestionCount]);

  React.useLayoutEffect(() => {
    const textarea = internalTextareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const maxTextareaHeight = isMobileSheetPlacement ? 80 : 200;
      const minTextareaHeight = isMobileSheetPlacement ? 40 : 32;
      const contentHeight = textarea.scrollHeight;
      const newHeight = Math.max(
        minTextareaHeight,
        Math.min(contentHeight, maxTextareaHeight),
      );
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY =
        contentHeight > maxTextareaHeight ? "auto" : "hidden";

      if (selectionRef.current && document.activeElement === textarea) {
        textarea.setSelectionRange(
          selectionRef.current.start,
          selectionRef.current.end,
        );
        selectionRef.current = null;
      }
    }
  }, [isMobileSheetPlacement, message]);

  React.useEffect(() => {
    if (isChatOpen && internalTextareaRef.current) {
      focusChatInput();
    }
  }, [focusChatInput, isChatOpen]);

  React.useEffect(() => {
    if (!isChatInputDisabled && internalTextareaRef.current) {
      focusChatInput();
    }
  }, [focusChatInput, isChatInputDisabled]);

  React.useEffect(() => {
    const handleShortcutFocus = (event: KeyboardEvent) => {
      const isFocusShortcut =
        (event.ctrlKey || event.metaKey) && event.key === "/";

      if (!isFocusShortcut) return;

      event.preventDefault();

      if (!isChatOpen) {
        openChat();
      }

      requestAnimationFrame(() => {
        focusChatInput(true);
      });
    };

    window.addEventListener("keydown", handleShortcutFocus);
    return () => {
      window.removeEventListener("keydown", handleShortcutFocus);
    };
  }, [focusChatInput, isChatOpen, openChat]);

  React.useEffect(() => {
    if (!isChatOpen) {
      openChat();
    }

    requestAnimationFrame(() => {
      focusChatInput(true);
    });
    // Run this only when the page changes. Re-running after each draft update
    // moves the caret to the end and breaks middle-of-text editing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  React.useEffect(() => {
    const handleModalCloseFocus = () => {
      if (!isChatOpen) {
        openChat();
      }

      requestAnimationFrame(() => {
        focusChatInput(true);
      });
    };

    window.addEventListener(FOCUS_CHAT_INPUT_EVENT, handleModalCloseFocus);
    window.addEventListener(
      MODAL_CLOSE_FOCUS_CHAT_EVENT,
      handleModalCloseFocus,
    );
    return () => {
      window.removeEventListener(FOCUS_CHAT_INPUT_EVENT, handleModalCloseFocus);
      window.removeEventListener(
        MODAL_CLOSE_FOCUS_CHAT_EVENT,
        handleModalCloseFocus,
      );
    };
  }, [focusChatInput, isChatOpen, openChat]);

  return (
    <>
      {!isChatOpen &&
        !isPanelPlacement &&
        !isMobileSheetPlacement &&
        !hideFloatingLauncher && (
          <div className="fixed bottom-8 right-8 z-50 hidden md:block">
            <Button
              onClick={handleOpen}
              variant="theme"
              size="icon"
              tooltip="Open Chat"
              className="h-14 w-14 text-white shadow-lg transition-all duration-300 hover:scale-110"
            >
              <LuMessageCircle className="w-6 h-6" />
            </Button>
          </div>
        )}
        <div
          className={cn(
            "z-50 flex cursor-text flex-col rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_4px_24px_rgba(79,70,229,0.08)] transition-all duration-300 ease-in-out",
            isChatOpen
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-95 pointer-events-none",
            isPanelPlacement
              ? "relative m-4 mt-3 w-auto overflow-hidden"
              : isMobileSheetPlacement
                ? "relative m-3 mt-2 w-auto overflow-hidden"
                : "absolute bottom-4 left-1/2 hidden w-[min(94%,1120px)] -translate-x-1/2 md:bottom-6 md:flex",
            !isHome && !isPanelPlacement && "w-[min(92%,820px)]",
          )}
        >
          {visibleSuggestions.length > 0 && (
            <div
              className={cn(
                "rounded-2xl px-4 py-3 transition-all duration-300 ease-in-out",
                // Floating: pin above the input card, tracking its width.
                // Panel / mobile sheet: the parent is overflow-hidden and not
                // bottom-anchored, so render in-flow above the input row.
                isPanelPlacement || isMobileSheetPlacement
                  ? "mb-0"
                  : "absolute inset-x-0 bottom-full mb-0",
                isSuggestionsShown
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none",
              )}
            >
              <div className="-m-1 flex items-center gap-2 overflow-x-auto p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <h3 className="mr-1 shrink-0 text-xs font-semibold text-indigo-600">
                  Quick actions
                </h3>
                {visibleSuggestions.map((item: string) => {
                  return (
                    <TruncatedSuggestionButton
                      key={item}
                      item={item}
                      disabled={isChatInputDisabled}
                      onClick={() => handleSend(item)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          <div
            className={cn(
              "flex items-center gap-2 rounded-2xl",
              isMobileSheetPlacement && "gap-2",
            )}
            style={{ maxHeight: isMobileSheetPlacement ? "92px" : "400px" }}
          >
            <NewDropdown
              position="top-left"
              searchable
              searchPlaceholder="Search commands..."
              trigger={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  tooltip="Quick Commands"
                  className="h-8 w-8 shrink-0 rounded-full bg-indigo-50 text-indigo-400 hover:bg-indigo-100"
                  disabled
                >
                  <LuListChecks className="w-4 h-4" />
                </Button>
              }
              items={promptItems}
            />
            <textarea
              ref={internalTextareaRef}
              data-test-id="CONVER"
              disabled={isChatInputDisabled}
              // autoFocus={false}
              rows={1}
              value={message}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyPress(e, handleSubmit)}
              placeholder="Ask me anything..."
              className={cn(
                "min-h-8 max-h-40 w-full resize-none border-0 bg-transparent py-2 pr-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 focus-visible:outline-none",
                "min-h-8",
                isPanelPlacement && "text-sm",
                isMobileSheetPlacement &&
                  "max-h-20 overflow-y-hidden py-2.5 leading-5",
                isMobileSheetEmpty &&
                  "h-10 whitespace-nowrap overflow-x-hidden text-ellipsis",
              )}
            />
            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="theme"
                size="icon"
                tooltip="Send"
                disabled={isChatInputDisabled}
                data-test-id="SEND"
                onClick={handleSubmit}
                className="h-9 w-9 rounded-full border-0 bg-indigo-500 text-sm font-medium text-white shadow-md transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-200 disabled:opacity-100 disabled:shadow-none"
              >
                {isChatInputDisabled ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                ) : (
                  <LuSend className="h-4 w-4 text-white" />
                )}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </div>
    </>
  );
};

export default ChatTextArea;
