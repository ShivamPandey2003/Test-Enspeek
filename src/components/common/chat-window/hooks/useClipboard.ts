import { useCallback } from "react";
import { toast } from "sonner";

/**
 * Copy text to the clipboard with the same toast feedback and error handling
 * as the original inline `copyTextToClipboard`.
 */
export const useClipboard = () => {
  const copyTextToClipboard = useCallback(
    async (text: string, successMessage: string) => {
      if (!navigator.clipboard?.writeText) {
        toast.error("Clipboard API is not supported in this browser.");
        return;
      }

      try {
        await navigator.clipboard.writeText(text);
        toast.success(successMessage);
      } catch {
        toast.error("Unable to copy message.");
      }
    },
    []
  );

  return { copyTextToClipboard };
};

export default useClipboard;
