import { useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import mutationStructure from "../mutation-template";
import url from "../url";
import { apiRequest } from "../../services/apiService";
import type { AppDispatch, RootState } from "../../store/store";
import {
  finishChatHistoryLoad,
  prependChatHistory,
  resetChatHistory,
  setInitialChatHistory,
  startChatHistoryLoad,
  startOlderChatHistoryLoad,
} from "../../store/ChatSlice";
import { getChatHistoryContext } from "../../utils/chatHistoryContext";
import { normalizeChatHistoryRows } from "../../utils/chatMessageMapper";

type ChatHistoryPayload = {
  page: number;
  pageName: string;
  studyID?: string;
};

type ChatHistoryResponse = {
  data?: unknown[];
  has_more?: boolean;
  page?: number;
};

const buildChatHistoryPayload = ({
  page,
  pageName,
  studyID,
}: ChatHistoryPayload): ChatHistoryPayload => ({
  page,
  pageName,
  ...(studyID ? { studyID } : {}),
});

export const useInitializeChatHistory = (enabled = true) => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname, state } = useLocation();
  const apiToken = useSelector((storeState: RootState) => storeState.user.apiToken);
  const { contextKey, pageName, studyID } = useMemo(
    () => getChatHistoryContext(pathname, state?.studyID),
    [pathname, state?.studyID]
  );

  const { mutateAsync: fetchHistory } = mutationStructure<
    ChatHistoryResponse,
    Error,
    ChatHistoryPayload
  >({
    mutationKey: [url.chatHistory.mutationKey, "initial"],
    mutationFn: async (payload) => {
      const res = await apiRequest(
        url.chatHistory.method,
        url.chatHistory.endpoint,
        buildChatHistoryPayload(payload)
      );
      return res?.response ?? {};
    },
  });

  useEffect(() => {
    if (!enabled || !apiToken || !pageName) return;

    let isActive = true;

    const loadInitialHistory = async () => {
      dispatch(startChatHistoryLoad(contextKey));

      try {
        const response = await fetchHistory({ page: 1, pageName, studyID });
        if (!isActive) return;

        dispatch(
          setInitialChatHistory({
            contextKey,
            hasMore: Boolean(response.has_more),
            messages: normalizeChatHistoryRows(response.data ?? []),
            page: response.page ?? 1,
          })
        );
      } catch {
        if (isActive) {
          dispatch(finishChatHistoryLoad(contextKey));
        }
      }
    };

    void loadInitialHistory();

    return () => {
      isActive = false;
    };
  }, [apiToken, contextKey, dispatch, enabled, fetchHistory, pageName, studyID]);
};

export const usePrepareChatHistoryContext = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname, state } = useLocation();
  const { contextKey, pageName } = useMemo(
    () => getChatHistoryContext(pathname, state?.studyID),
    [pathname, state?.studyID]
  );

  useLayoutEffect(() => {
    if (!pageName) return;

    dispatch(resetChatHistory(contextKey));
  }, [contextKey, dispatch, pageName]);
};

export const useLoadOlderChatHistory = () => {
  const { pathname, state } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const {
    hasMoreHistory,
    historyContextKey,
    historyPage,
    isHistoryLoading,
    isOlderHistoryLoading,
  } = useSelector((storeState: RootState) => storeState.chat);
  const { contextKey, pageName, studyID } = useMemo(
    () => getChatHistoryContext(pathname, state?.studyID),
    [pathname, state?.studyID]
  );

  const { mutateAsync: fetchHistory } = mutationStructure<
    ChatHistoryResponse,
    Error,
    ChatHistoryPayload
  >({
    mutationKey: [url.chatHistory.mutationKey, "older"],
    mutationFn: async (payload) => {
      const res = await apiRequest(
        url.chatHistory.method,
        url.chatHistory.endpoint,
        buildChatHistoryPayload(payload)
      );
      return res?.response ?? {};
    },
  });

  const loadOlderHistory = useCallback(async () => {
    if (
      !pageName ||
      !hasMoreHistory ||
      isHistoryLoading ||
      isOlderHistoryLoading ||
      historyContextKey !== contextKey
    ) {
      return false;
    }

    const nextPage = historyPage + 1;
    dispatch(startOlderChatHistoryLoad(contextKey));

    try {
      const response = await fetchHistory({
        page: nextPage,
        pageName,
        studyID,
      });

      dispatch(
        prependChatHistory({
          contextKey,
          hasMore: Boolean(response.has_more),
          messages: normalizeChatHistoryRows(response.data ?? []),
          page: response.page ?? nextPage,
        })
      );
      return true;
    } catch {
      dispatch(finishChatHistoryLoad(contextKey));
      return false;
    }
  }, [
    contextKey,
    dispatch,
    fetchHistory,
    hasMoreHistory,
    historyContextKey,
    historyPage,
    isHistoryLoading,
    isOlderHistoryLoading,
    pageName,
    studyID,
  ]);

  return { loadOlderHistory };
};
