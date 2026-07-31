import React, { useEffect, useState } from "react";
import { formatRichText } from "../../../../utils";
import {
  CHAT_AGENT_AVATAR_LABEL,
  CHAT_AGENT_NAME,
} from "../../../../config/chatAgent";
import { getValidSuggestion } from "../../../../utils/chatSuggestion";
import TypingIndicator from "../typing-indicator";
import ChatAvatar from "./ChatAvatar";
import TruncatedSuggestionButton from "./TruncatedSuggestionButton";

const CHAT_SUGGESTION_DELAY_MS = 3000;

type ChatSuggestionBlockProps = {
  delayMs?: number;
  suggestion: unknown;
  disabled: boolean;
  hasInputLock: boolean;
  onSend: (value: string) => boolean;
  onVisible: () => void;
  onSuggestionsVisible: () => void;
};

const ChatSuggestionBlock = ({
  delayMs = CHAT_SUGGESTION_DELAY_MS,
  suggestion,
  disabled,
  hasInputLock,
  onSend,
  onVisible,
  onSuggestionsVisible,
}: ChatSuggestionBlockProps) => {
  const [isVisible, setIsVisible] = useState(delayMs === 0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const onVisibleRef = React.useRef(onVisible);
  const onSuggestionsVisibleRef = React.useRef(onSuggestionsVisible);
  const hasReleasedInputLockRef = React.useRef(false);
  const validSuggestion = React.useMemo(
    () => getValidSuggestion(suggestion),
    [suggestion]
  );

  useEffect(() => {
    onVisibleRef.current = onVisible;
  }, [onVisible]);

  useEffect(() => {
    onSuggestionsVisibleRef.current = onSuggestionsVisible;
  }, [onSuggestionsVisible]);

  useEffect(() => {
    setIsVisible(delayMs === 0);
    setHasSubmitted(false);
    hasReleasedInputLockRef.current = false;

    if (!validSuggestion) return;

    const releaseInputLock = () => {
      if (!hasInputLock || hasReleasedInputLockRef.current) return;

      hasReleasedInputLockRef.current = true;
      onSuggestionsVisibleRef.current();
    };

    if (delayMs === 0) {
      setIsVisible(true);
      releaseInputLock();
      onVisibleRef.current();
      return;
    }

    window.requestAnimationFrame(() => {
      onVisibleRef.current();
    });

    const timer = window.setTimeout(() => {
      setIsVisible(true);
      releaseInputLock();
      onVisibleRef.current();
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [delayMs, hasInputLock, validSuggestion]);

  if (!validSuggestion) return null;

  const isDisabled = disabled || hasSubmitted;
  const handleSuggestionClick = (value: string) => {
    if (isDisabled) return;

    const didSend = onSend(value);
    if (didSend) {
      setHasSubmitted(true);
    }
  };

  return (
    <div
      className="mb-4 mt-6 flex w-full justify-start @container"
    >
      <div className="flex max-w-full items-start gap-2.5">
        <ChatAvatar
          type="ai"
          label={CHAT_AGENT_AVATAR_LABEL}
          title={CHAT_AGENT_NAME}
        />
        <div className="min-w-0 max-w-[min(100%,820px)]">
          {!isVisible && delayMs > 0 ? (
            <TypingIndicator className="mb-0" />
          ) : null}
          {isVisible && validSuggestion.message ? (
            <div className="home-surface home-text inline-block rounded-[16px] border home-border px-3 py-2 text-left text-sm shadow-[0_6px_16px_rgba(15,23,42,0.08)]">
              <div
                className="break-words text-[14px] leading-6"
                dangerouslySetInnerHTML={{
                  __html: formatRichText(validSuggestion.message),
                }}
              />
            </div>
          ) : null}
          {isVisible && validSuggestion.list.length > 0 ? (
            <div className="mt-2 flex max-w-full flex-wrap gap-1.5">
              {validSuggestion.list.map((item, itemIndex) => (
                <TruncatedSuggestionButton
                  key={`${item}-${itemIndex}`}
                  disabled={isDisabled}
                  item={item}
                  onClick={() => handleSuggestionClick(item)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export { CHAT_SUGGESTION_DELAY_MS };
export default ChatSuggestionBlock;
