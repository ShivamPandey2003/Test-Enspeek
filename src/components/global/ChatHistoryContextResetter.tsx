import { usePrepareChatHistoryContext } from "../../api-network/global/chat-history";

const ChatHistoryContextResetter = () => {
  usePrepareChatHistoryContext();

  return null;
};

export default ChatHistoryContextResetter;
