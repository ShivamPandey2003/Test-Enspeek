import { useMemo } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { getChatHistoryContext } from "./chatHistoryContext";

export const useChatHistoryContextStatus = () => {
  const { pathname, state } = useLocation();
  const historyContextKey = useSelector(
    (storeState: RootState) => storeState.chat.historyContextKey
  );
  const context = useMemo(
    () => getChatHistoryContext(pathname, state?.studyID),
    [pathname, state?.studyID]
  );

  return {
    ...context,
    isCurrentHistoryContext: historyContextKey === context.contextKey,
  };
};
