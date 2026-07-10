import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import type { AppDispatch, RootState } from "../../../store/store";
import { cn, getFullName } from "../../../utils";
import { decrementPendingSuggestion } from "../../../store/ChatSlice";
import useAiChat from "../../../api-network/global/ai-chat";
import { useLoadOlderChatHistory } from "../../../api-network/global/chat-history";
import { useChatHistoryContextStatus } from "../../../utils/useChatHistoryContextStatus";
import TypingIndicator from "./typing-indicator";
import type { ChatMessage as ChatMessageType, SurveyTab } from "./types";
import { useChatScroll } from "./hooks/useChatScroll";
import { useChatModals } from "./hooks/useChatModals";
import { useClipboard } from "./hooks/useClipboard";
import ChatMessage from "./components/ChatMessage";
import ChatModals from "./components/ChatModals";
import ConversationStatusBanner from "./components/ConversationStatusBanner";
import EmptyConversation from "./components/EmptyConversation";

const ChatWindow: React.FC<{
  surface?: "auto" | "page" | "card";
  scrollMode?: "internal" | "external";
}> = ({ surface = "auto", scrollMode = "internal" }) => {
  const {
    hasLoadedHistory,
    hasMoreHistory,
    isHistoryLoading,
    isOlderHistoryLoading,
    messages,
    isTyping,
    pending,
  } = useSelector((state: RootState) => state.chat);
  const { isCurrentHistoryContext } = useChatHistoryContextStatus();
  const { sendMessage } = useAiChat();
  const { loadOlderHistory } = useLoadOlderChatHistory();
  const { firstName, lastName } = useSelector((state: RootState) => state.user);
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const fullName = getFullName(firstName, lastName) || firstName || "User";
  const userAvatarLabel = firstName?.trim() || "User";
  const isHomePageSurface =
    pathname === "/" && (surface === "auto" || surface === "page");
  const isResponseLocked = isTyping || pending;
  const visibleMessages = useMemo<ChatMessageType[]>(
    () => (isCurrentHistoryContext ? messages : []),
    [isCurrentHistoryContext, messages]
  );
  const isInitialHistoryLoading =
    !isCurrentHistoryContext || !hasLoadedHistory || isHistoryLoading;
  const isConversationEmpty = visibleMessages.length === 0;
  const showHistoryStartMarker =
    hasLoadedHistory && !hasMoreHistory && visibleMessages.length > 0;

  const { rootRef, messagesEndRef, scrollContainerRef, messageRowRefs, scheduleBottomScroll } =
    useChatScroll({
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
    });

  const {
    activeTab,
    selectTab,
    selectedChart,
    isChartModalOpen,
    openChartModal,
    closeChartModal,
    selectedTable,
    isTableModalOpen,
    openTableModal,
    closeTableModal,
    selectedCrosstab,
    isCrosstabModalOpen,
    closeCrosstabModal,
  } = useChatModals(visibleMessages);

  const { copyTextToClipboard } = useClipboard();

  // Stable per-index row-ref setters so message rows don't get a fresh ref
  // callback on every render (keeps ChatMessage's React.memo effective).
  const rowRefSetters = useRef(new Map<number, (el: HTMLDivElement | null) => void>());
  const getRowRefSetter = useCallback(
    (index: number) => {
      const setters = rowRefSetters.current;
      let setter = setters.get(index);
      if (!setter) {
        setter = (element: HTMLDivElement | null) => {
          messageRowRefs.current[index] = element;
        };
        setters.set(index, setter);
      }
      return setter;
    },
    [messageRowRefs]
  );

  // Stable `onSend` that always calls the latest `sendMessage` without
  // recreating on every render.
  const sendMessageRef = useRef(sendMessage);
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  });
  const handleSend = useCallback(
    (value: string) => sendMessageRef.current(value),
    []
  );

  const handleExpand = useCallback(
    (index: number, tab: SurveyTab) => {
      if (tab === "chart") {
        openChartModal(index);
      } else {
        openTableModal(index);
      }
    },
    [openChartModal, openTableModal]
  );

  const handleCopyLink = useCallback(
    (link: string) => {
      void copyTextToClipboard(link, "Research link copied to clipboard!");
    },
    [copyTextToClipboard]
  );

  const handleSuggestionVisibleScroll = useCallback(() => {
    scheduleBottomScroll("smooth");
  }, [scheduleBottomScroll]);

  const handleSuggestionsVisible = useCallback(() => {
    dispatch(decrementPendingSuggestion());
  }, [dispatch]);

  return (
    <div
      ref={rootRef}
      className="z-50 flex h-full min-h-0 w-full max-w-full flex-col"
    >
      <div
        ref={scrollContainerRef}
        className={cn(
          "min-h-0 flex-1",
          scrollMode === "internal" && "overflow-y-auto",
          "home-surface"
        )}
        style={scrollMode === "internal" ? { scrollbarGutter: "stable" } : undefined}
      >
        <div
          className={cn(
            isHomePageSurface
              ? "mx-auto w-[min(94%,1120px)] pb-28 pt-4 md:pt-6"
              : "px-4 pb-3 pt-4 md:px-6 md:pt-6"
          )}
        >
          <ConversationStatusBanner
            isInitialHistoryLoading={isInitialHistoryLoading}
            isConversationEmpty={isConversationEmpty}
            isOlderHistoryLoading={isOlderHistoryLoading}
            showHistoryStartMarker={showHistoryStartMarker}
          />

          {!isInitialHistoryLoading &&
            visibleMessages.map((msg, index) => (
              <ChatMessage
                key={index}
                msg={msg}
                index={index}
                fullName={fullName}
                userAvatarLabel={userAvatarLabel}
                activeTab={activeTab[index]}
                isResponseLocked={isResponseLocked}
                onRowRef={getRowRefSetter(index)}
                onSelectTab={selectTab}
                onExpand={handleExpand}
                onCopyLink={handleCopyLink}
                onSend={handleSend}
                onSuggestionVisibleScroll={handleSuggestionVisibleScroll}
                onSuggestionsVisible={handleSuggestionsVisible}
              />
            ))}

          {!isInitialHistoryLoading && (isTyping || pending) && <TypingIndicator />}
          {isConversationEmpty && !isTyping && !isInitialHistoryLoading && (
            <EmptyConversation />
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatModals
        messages={visibleMessages}
        selectedChart={selectedChart}
        isChartModalOpen={isChartModalOpen}
        onCloseChart={closeChartModal}
        selectedTable={selectedTable}
        isTableModalOpen={isTableModalOpen}
        onCloseTable={closeTableModal}
        selectedCrosstab={selectedCrosstab}
        isCrosstabModalOpen={isCrosstabModalOpen}
        onCloseCrosstab={closeCrosstabModal}
      />
    </div>
  );
};

export default ChatWindow;
