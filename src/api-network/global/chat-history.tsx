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
import { CHAT_HISTORY_READY_EVENT } from "../../utils/masterData";
import { useQuery } from "@tanstack/react-query";

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

// export const useInitializeChatHistory = (enabled = true) => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { pathname, state } = useLocation();
//   const apiToken = useSelector((storeState: RootState) => storeState.user.apiToken);
//   const { contextKey, pageName, studyID } = useMemo(
//     () => getChatHistoryContext(pathname, state?.studyID),
//     [pathname, state?.studyID]
//   );

//   const { mutateAsync: fetchHistory } = mutationStructure<
//     ChatHistoryResponse,
//     Error,
//     ChatHistoryPayload
//   >({
//     mutationKey: [url.chatHistory.mutationKey, "initial"],
//     mutationFn: async (payload) => {
//       const res = await apiRequest(
//         url.chatHistory.method,
//         url.chatHistory.endpoint,
//         buildChatHistoryPayload(payload)
//       );
//       return res?.response ?? {};
//     },
//   });

//   useEffect(() => {
//     if (!enabled || !apiToken || !pageName) return;

//     let isActive = true;
//     let historyReadyTimer: number | null = null;

//     const loadInitialHistory = async () => {
//       dispatch(startChatHistoryLoad(contextKey));

//       try {
//         const response = await fetchHistory({ page: 1, pageName, studyID });
//         if (!isActive) return;

//         dispatch(
//           setInitialChatHistory({
//             contextKey,
//             hasMore: Boolean(response.has_more),
//             messages: normalizeChatHistoryRows(response.data ?? []),
//             page: response.page ?? 1,
//           })
//         );
//         historyReadyTimer = window.setTimeout(() => {
//           if (!isActive) return;

//           window.dispatchEvent(
//             new CustomEvent(CHAT_HISTORY_READY_EVENT, {
//               detail: {
//                 contextKey,
//               },
//             })
//           );
//         }, 0);
//       } catch {
//         if (isActive) {
//           dispatch(finishChatHistoryLoad(contextKey));
//         }
//       }
//     };

//     void loadInitialHistory();

//     return () => {
//       isActive = false;
//       if (historyReadyTimer !== null) {
//         window.clearTimeout(historyReadyTimer);
//       }
//     };
//   }, [apiToken, contextKey, dispatch, enabled, fetchHistory, pageName, studyID]);
// };

export const useInitializeChatHistory = (enabled = true) => {
  const dispatch = useDispatch<AppDispatch>();
  const { pathname, state } = useLocation();
  const apiToken = useSelector((storeState: RootState) => storeState.user.apiToken);
  const { contextKey, pageName, studyID } = useMemo(
    () => getChatHistoryContext(pathname, state?.studyID),
    [pathname, state?.studyID]
  );

  const queryEnabled = Boolean(enabled && apiToken && pageName);

  const { data, isFetching, isSuccess, isError } = useQuery<ChatHistoryResponse, Error>({
    queryKey: [url.chatHistory.queryKey, "initial", contextKey, pageName, studyID],
    queryFn: async () => {
      const payload = { page: 1, pageName, studyID };
      const res = await apiRequest(
        url.chatHistory.method,
        url.chatHistory.endpoint,
        buildChatHistoryPayload(payload)
      );
      return res?.response ?? {};
    },
    enabled: queryEnabled,
    staleTime: 0,
    retry: false,
    refetchOnWindowFocus: false
  });

  useEffect(() => {
    if (queryEnabled && isFetching) {
      dispatch(startChatHistoryLoad(contextKey));
    }
  }, [queryEnabled, isFetching, contextKey, dispatch]);

  // Handle success
  useEffect(() => {
    if (!isSuccess || !data) return;

    dispatch(
      setInitialChatHistory({
        contextKey,
        hasMore: Boolean(data.has_more),
        messages: normalizeChatHistoryRows(data.data ?? []),
        page: data.page ?? 1,
      })
    );
    dispatch(finishChatHistoryLoad(contextKey));

    window.dispatchEvent(
      new CustomEvent(CHAT_HISTORY_READY_EVENT, { detail: { contextKey } })
    );
  }, [isSuccess, data, contextKey, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(finishChatHistoryLoad(contextKey));
    }
  }, [isError, contextKey, dispatch]);
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
