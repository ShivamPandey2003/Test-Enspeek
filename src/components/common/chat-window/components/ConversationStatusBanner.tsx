import LoadingConversation from "./LoadingConversation";

type ConversationStatusBannerProps = {
  isInitialHistoryLoading: boolean;
  isConversationEmpty: boolean;
  isOlderHistoryLoading: boolean;
  showHistoryStartMarker: boolean;
};

/**
 * The status line rendered above the message list: the initial full-height
 * loader, the compact "loading older history" spinner, or the "Conversation
 * started here" marker.
 *
 * The conditions are checked in the same precedence order as the original
 * nested ternary in ChatWindow (initial loading → older loading → start marker),
 * so the rendered output is identical.
 */
const ConversationStatusBanner = ({
  isInitialHistoryLoading,
  isConversationEmpty,
  isOlderHistoryLoading,
  showHistoryStartMarker,
}: ConversationStatusBannerProps) => {
  if (isInitialHistoryLoading && isConversationEmpty) {
    return <LoadingConversation />;
  }

  if (isOlderHistoryLoading) {
    return (
      <div className="mb-3 flex justify-center">
        <LoadingConversation compact />
      </div>
    );
  }

  if (showHistoryStartMarker) {
    return (
      <div className="mb-3 text-center text-xs font-semibold text-text-supporting">
        Conversation started here.
      </div>
    );
  }

  return null;
};

export default ConversationStatusBanner;
