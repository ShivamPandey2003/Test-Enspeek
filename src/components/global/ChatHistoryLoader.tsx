import { useInitializeChatHistory } from "../../api-network/global/chat-history";

type ChatHistoryLoaderProps = {
  enabled?: boolean;
};

const ChatHistoryLoader = ({ enabled = true }: ChatHistoryLoaderProps) => {
  useInitializeChatHistory(enabled);

  return null;
};

export default ChatHistoryLoader;
