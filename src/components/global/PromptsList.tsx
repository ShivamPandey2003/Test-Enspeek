import { promptCatalog } from "../../utils/promptCatalog";
import useAiChat from "../../api-network/global/ai-chat";

const PromptsList = () => {
  const { setDraftMessage } = useAiChat();

  return promptCatalog.map((prompt) => ({
    ...prompt,
    onClick: () => {
      if (prompt.message) {
        setDraftMessage(prompt.message);
      }
    },
  }));
};

export default PromptsList;
