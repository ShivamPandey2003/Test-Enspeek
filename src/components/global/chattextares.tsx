import * as React from "react";
import { IoMdSend } from "react-icons/io";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { cn, handleKeyPress } from "../../utils";
import { LuMessageCircle } from "react-icons/lu";
import { useLocation } from "react-router";
import NewDropdown from "./NewDropDown";
import PromptsList from "./PromptsList";
import { CiCircleList } from "react-icons/ci";
import useAiChat from "../../api-network/global/ai-chat";
import Button from "../ui/Button";
import { MODAL_CLOSE_FOCUS_CHAT_EVENT } from "../../utils/modalFocus";

interface ChatTextAreaProps {
  placement?: "floating" | "panel";
}

const ChatTextArea: React.FC<ChatTextAreaProps> = ({
  placement = "floating",
}) => {
  const internalTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { isTyping, isChatOpen, pending } = useSelector(
    (state: RootState) => state.chat
  );
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isPanelPlacement = placement === "panel";
  const { message, openChat, sendMessage, setDraftMessage } = useAiChat();

  const focusChatInput = React.useCallback(() => {
    const textarea = internalTextareaRef.current;
    if (!textarea) return;

    textarea.focus();
    const caretPosition = textarea.value.length;
    textarea.setSelectionRange(caretPosition, caretPosition);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftMessage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleOpen = () => {
    openChat();
  };

  React.useLayoutEffect(() => {
    const textarea = internalTextareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);

  React.useEffect(() => {
    if (isChatOpen && internalTextareaRef.current) {
      focusChatInput();
    }
  }, [focusChatInput, isChatOpen]);

  React.useEffect(() => {
    if (!isTyping && !pending && internalTextareaRef.current) {
      focusChatInput();
    }
  }, [focusChatInput, isTyping, pending]);

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
        focusChatInput();
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
      focusChatInput();
    });
  }, [focusChatInput, isChatOpen, openChat, pathname]);

  React.useEffect(() => {
    const handleModalCloseFocus = () => {
      if (!isChatOpen) {
        openChat();
      }

      requestAnimationFrame(() => {
        focusChatInput();
      });
    };

    window.addEventListener(MODAL_CLOSE_FOCUS_CHAT_EVENT, handleModalCloseFocus);
    return () => {
      window.removeEventListener(MODAL_CLOSE_FOCUS_CHAT_EVENT, handleModalCloseFocus);
    };
  }, [focusChatInput, isChatOpen, openChat]);

  return (
    <>
      {!isChatOpen && !isPanelPlacement && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button
            onClick={handleOpen}
            varinat="theme"
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
          "home-surface z-50 flex cursor-text flex-col border home-border-strong transition-all duration-300 ease-in-out",
          isChatOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95 pointer-events-none",
          isPanelPlacement
            ? "questionnaire-chatbar-panel relative m-4 mt-3 w-auto overflow-hidden rounded-[24px] bg-white"
            : "absolute bottom-4 left-1/2 w-[min(94%,1120px)] -translate-x-1/2 rounded-[26px] shadow-[0_10px_28px_rgba(31,41,55,0.10),0_2px_8px_rgba(31,41,55,0.05)] md:bottom-6",
          !isHome && !isPanelPlacement && "w-[min(92%,820px)]"
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3 overflow-visible p-3",
            isPanelPlacement && "px-4 py-4 md:px-5"
          )}
          style={{ maxHeight: "400px" }}
        >
          <NewDropdown
            position="top-left"
            searchable
            searchPlaceholder="Search commands..."
            trigger={
              <Button
                type="button"
                varinat="ghost"
                size="icon"
                tooltip="Quick Commands"
                className="home-dropdown-icon-wrap h-10 w-10 shrink-0 rounded-full shadow-sm hover:opacity-90"
              >
                <CiCircleList className="w-5 h-5" />
              </Button>
            }
            items={PromptsList()}
          />
          <textarea
            ref={internalTextareaRef}
            data-test-id="CONVER"
            disabled={isTyping}
            // autoFocus={false}
            rows={1}
            value={message}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyPress(e, handleSubmit)}
            placeholder="Ask me anything..."
            className={cn(
              "home-chat-placeholder home-text min-h-8 w-full resize-none border-0 bg-transparent py-2 pr-2 text-[16px] focus:ring-0 focus-visible:outline-none",
              "min-h-8",
              isPanelPlacement && "text-[15px] md:text-[16px]"
            )}
          />
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              varinat="theme"
              size="icon"
              tooltip="Send"
              disabled={isTyping}
              data-test-id="SEND"
              onClick={handleSubmit}
              className={cn(
                "h-11 w-11 border-0 bg-gradient-to-r from-login-primary to-login-bg-end text-sm font-medium transition-all hover:brightness-95 disabled:opacity-75 shadow-[0_10px_24px_rgba(85,90,230,0.28)]",
                isPanelPlacement && "h-12 w-12 shadow-[0_12px_28px_rgba(85,90,230,0.24)]"
              )}
            >
              {isTyping || pending ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
              ) : (
                <IoMdSend className="h-5 w-5 text-white" />
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
