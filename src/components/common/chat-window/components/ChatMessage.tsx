import React from "react";
import { cn } from "../../../../utils";
import {
  CHAT_AGENT_AVATAR_LABEL,
  CHAT_AGENT_NAME,
} from "../../../../config/chatAgent";
import type { ChatMessage as ChatMessageType, SurveyTab } from "../types";
import ChatAvatar from "./ChatAvatar";
import MessageBubble from "./MessageBubble";
import SurveyRenderer from "./SurveyRenderer";
import ChatSuggestionBlock, { CHAT_SUGGESTION_DELAY_MS } from "./ChatSuggestionBlock";
import { hasCompleteSuggestionContent } from "../../../../utils/chatSuggestion";

type ChatMessageProps = {
  msg: ChatMessageType;
  index: number;
  fullName: string;
  userAvatarLabel: string;
  activeTab: SurveyTab | undefined;
  isResponseLocked: boolean;
  onRowRef: (element: HTMLDivElement | null) => void;
  onSelectTab: (index: number, tab: SurveyTab) => void;
  onExpand: (index: number, tab: SurveyTab) => void;
  onCopyLink: (link: string) => void;
  onSend: (value: string) => boolean;
  onSuggestionVisibleScroll: () => void;
  onSuggestionsVisible: () => void;
  lastIndex: number
};

/**
 * A single chat row: avatar + message bubble (text / questionnaire / response /
 * survey / research link) followed by an optional AI suggestion block.
 *
 * Layout, class names, and the `data-test-id` are preserved verbatim from the
 * original render loop.
 */
const ChatMessage = ({
  msg,
  index,
  fullName,
  userAvatarLabel,
  activeTab,
  isResponseLocked,
  onRowRef,
  onSelectTab,
  onExpand,
  onCopyLink,
  onSend,
  onSuggestionVisibleScroll,
  onSuggestionsVisible,
  lastIndex
}: ChatMessageProps) => {
  const isUserMessage = msg.sender === "user";
  const isSurvey = msg.type === "surveydata";
  const isWideBubble = Boolean(msg.sdata || msg.crosstab);

  return (
    <>
      <div
        ref={onRowRef}
        data-test-id={`${msg.sender}-${index}`}
        className={cn(
          "mb-4 flex w-full",
          isUserMessage ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "flex max-w-full items-start gap-2.5",
            isUserMessage && "flex-row-reverse"
          )}
        >
          <ChatAvatar
            type={isUserMessage ? "user" : "ai"}
            label={isUserMessage ? userAvatarLabel : CHAT_AGENT_AVATAR_LABEL}
            title={isUserMessage ? fullName : CHAT_AGENT_NAME}
          />
          <div
            className={cn(
              "flex min-w-0 max-w-full flex-col",
              isUserMessage && "items-end"
            )}
          >
            <div
              className={
                isWideBubble
                  ? "max-w-[min(100%,860px)]"
                  : cn(
                      "inline-block max-w-[min(100%,820px)] rounded-[16px] px-3 py-2 text-left text-sm shadow-sm",
                      isUserMessage
                        ? "bg-[#4f56e6] text-white shadow-md"
                        : "home-surface home-text border home-border shadow-[0_6px_16px_rgba(15,23,42,0.08)]"
                    )
              }
            >
              <MessageBubble
                msg={msg}
                onCopyLink={onCopyLink}
                surveySlot={
                  isSurvey ? (
                    <SurveyRenderer
                      msg={msg}
                      activeTab={activeTab}
                      onSelectTab={(tab) => onSelectTab(index, tab)}
                      onExpand={(tab) => onExpand(index, tab)}
                    />
                  ) : null
                }
              />
            </div>
          </div>
        </div>
      </div>
      {!isUserMessage && index == lastIndex && msg.suggestion ? (
        <ChatSuggestionBlock
          suggestion={msg.suggestion}
          delayMs={msg.source === "history" ? 0 : CHAT_SUGGESTION_DELAY_MS}
          disabled={isResponseLocked}
          hasInputLock={hasCompleteSuggestionContent(msg.suggestion)}
          onSend={onSend}
          onVisible={() => {
            if (msg.source !== "history") {
              onSuggestionVisibleScroll();
            }
          }}
          onSuggestionsVisible={onSuggestionsVisible}
        />
      ) : null}
    </>
  );
};

export default React.memo(ChatMessage);
