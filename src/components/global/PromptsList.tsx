import { promptCatalog } from "../../utils/promptCatalog";

/**
 * Builds the Quick-Commands dropdown items from the prompt catalog.
 *
 * This is a pure factory (not a hook): it receives `setDraftMessage` from the
 * caller's existing `useAiChat()` instance instead of calling `useAiChat()`
 * again. Previously it was a hidden hook invoked as `PromptsList()` inside JSX,
 * which both violated the Rules of Hooks and spun up a second, redundant
 * chat-engine instance.
 */
const buildPromptItems = (setDraftMessage: (message: string) => void) =>
  promptCatalog.map((prompt) => ({
    ...prompt,
    onClick: () => {
      if (prompt.message) {
        setDraftMessage(prompt.message);
      }
    },
  }));

export default buildPromptItems;
