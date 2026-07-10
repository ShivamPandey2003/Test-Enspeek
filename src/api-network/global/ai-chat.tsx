import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { queryClient } from "../../App";
import mutationStructure from "../mutation-template";
import url from "../url";
import { apiRequest } from "../../services/apiService";
import { store, type AppDispatch, type RootState } from "../../store/store";
import {
  clearPendingSuggestions,
  incrementPendingSuggestion,
  setChatOpen,
  setFollowUp,
  setIsTyping,
  setMessage,
  setMessages,
  setPending,
} from "../../store/ChatSlice";
import { getPageName } from "../../utils/getPageName";
import { hasCompleteSuggestionContent } from "../../utils/chatSuggestion";
import { useReportProcessDownload } from "../report/mutation";
import homepageKeys from "../homepage/keys";
import questionnaireKeys from "../questionnaire/keys";
import publishSurveyKeys from "../publish-survey/keys";
import { setSubmitItems } from "../../store/QuestionSlice";
import { setStudyInfo } from "../../store/CrosstabStudySlice";
import { REFRESH_STUDY_LIST_EVENT } from "../../utils/studyListRefresh";
import {
  createAiChatMessageFromResponse,
  createUserChatMessage,
} from "../../utils/chatMessageMapper";
import { useChatHistoryContextStatus } from "../../utils/useChatHistoryContextStatus";
import {
  CHAT_HISTORY_READY_EVENT,
  clearMasterDataProcess,
  getMasterData,
  hasStoredProcessData,
  updateMasterDataProcess,
} from "../../utils/masterData";

const MAX_RECALL_CHAIN_CALLS = 10;
const PROCESS_LOOP_DELAY_MS = 5000;

let activeProcessLoopContextKey: string | null = null;

const delay = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const hasVisibleChatContent = (data: any) => {
  if (!data || typeof data !== "object") return false;

  if (data.showGraph) return true;
  if (typeof data.message === "string" && data.message.trim() !== "") return true;
  if (data.questions !== undefined) return true;
  if (data.instruction !== undefined) return true;
  if (data.liveLink !== undefined) return true;
  if (data.suggestion !== undefined) return true;
  if (data.suggestions !== undefined) return true;

  return false;
};

export const useChat = () => {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { processDownload } = useReportProcessDownload();
  const pageName = getPageName(pathname);
  const studyID = state?.studyID;
  const apiToken = useSelector(
    (storeState: RootState) => storeState.user.apiToken
  );
  const { contextKey, isCurrentHistoryContext } =
    useChatHistoryContextStatus();

  const {
    followUp,
    hasLoadedHistory,
    isChatOpen,
    isHistoryLoading,
    isTyping,
    message,
    messages,
    pending,
  } = useSelector((storeState: RootState) => storeState.chat);

  const latestStateRef = useRef({
    apiToken,
    contextKey,
    isCurrentHistoryContext,
  });
  const isMountedRef = useRef(true);
  const processLoopOwnerRef = useRef(false);

  const getLatestMessages = () => store.getState().chat.messages;
  const hasActiveStoredProcess = () => hasStoredProcessData(getMasterData());
  const isContextStillCurrent = (targetContextKey: string) =>
    store.getState().chat.historyContextKey === targetContextKey;

  useEffect(() => {
    latestStateRef.current = {
      apiToken,
      contextKey,
      isCurrentHistoryContext,
    };
  }, [apiToken, contextKey, isCurrentHistoryContext]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (
        processLoopOwnerRef.current &&
        activeProcessLoopContextKey === contextKey
      ) {
        activeProcessLoopContextKey = null;
      }
    };
  }, [contextKey]);

  const appendChatMessage = useCallback(
    (chatMessage: any) => {
      dispatch(setMessages([...getLatestMessages(), chatMessage]));
    },
    [dispatch]
  );

  const setDraftMessage = (value: string) => {
    dispatch(setMessage(value));
  };

  const openChat = () => {
    dispatch(setChatOpen(true));
  };

  const closeChat = () => {
    dispatch(setChatOpen(false));
  };

  const openChatWithMessage = (value: string) => {
    dispatch(setChatOpen(true));
    dispatch(setMessage(value));
  };

  const requestRecallResponse = useCallback(async () => {
    const payload = studyID ? { studyID, recallFlag: 1 } : { recallFlag: 1 };
    const res = await apiRequest(
      url.studyChatbot.method,
      url.studyChatbot.endpoint,
      payload
    );
    return res?.response;
  }, [studyID]);

  const shouldRequestRecall = (data: any) => data?.recallFlag === 1;
  const syncMasterDataFromResponse = (data: any) => {
    updateMasterDataProcess(data?.process);
  };

  const refreshQuestionnaireList = async () => {
    if (!studyID) return;

    await queryClient.refetchQueries({
      queryKey: questionnaireKeys.questionList(studyID),
      type: "all",
    });
  };

  const refreshPublishSurveyData = (targetStudyID?: string) => {
    if (!targetStudyID) return;

    window.setTimeout(() => {
      void queryClient.refetchQueries({
        queryKey: publishSurveyKeys.studyInfo(targetStudyID),
        type: "active",
      });
      void queryClient.refetchQueries({
        queryKey: publishSurveyKeys.quotaReport(targetStudyID),
        type: "active",
      });
      void queryClient.refetchQueries({
        queryKey: publishSurveyKeys.quota(targetStudyID),
        type: "active",
      });
    }, 1000);
  };

  const refreshHomeStudyList = async () => {
    if (pathname !== "/") return;

    await new Promise<void>((resolve) => {
      window.dispatchEvent(
        new CustomEvent(REFRESH_STUDY_LIST_EVENT, {
          detail: {
            selection: "myactive",
            resolve,
          },
        })
      );
    });

    await queryClient.invalidateQueries({
      queryKey: homepageKeys.studyList(),
      exact: false,
    });
    await queryClient.refetchQueries({
      queryKey: homepageKeys.studyList(),
      exact: false,
      type: "active",
    });
  };

  const { mutate: submitQuestionById } = mutationStructure({
    mutationKey: [url.questionView.mutationKey, studyID, "chat"],
    mutationFn: async (questionId: string) => {
      const res = await apiRequest(
        url.questionView.method,
        url.questionView.endpoint.replace(":qId", questionId),
        { studyID }
      );
      return res.response;
    },
    onSuccess: (data: Question) => {
      dispatch(setSubmitItems(data));
    },
  });

  const processChatResponse = useCallback(
    async (data: any) => {
      if (!data) return;

      if (data.showGraph) {
        if (hasCompleteSuggestionContent(data.suggestion)) {
          dispatch(incrementPendingSuggestion());
        }

        const aiMessage = createAiChatMessageFromResponse(data);
        if (aiMessage) {
          appendChatMessage(aiMessage);
        }
        return;
      }

      if (!hasVisibleChatContent(data)) {
        dispatch(setFollowUp(data.followUp ?? ""));
        return;
      }

      if (hasCompleteSuggestionContent(data.suggestion)) {
        dispatch(incrementPendingSuggestion());
      }

      const aiMessage = createAiChatMessageFromResponse(data);
      if (aiMessage) {
        appendChatMessage(aiMessage);
      }

      if (data.opt === true && data.qid) {
        submitQuestionById(data.qid);
      }

      if (data.active && data.route) {
        // Backend payload field is `studyID` (as used at lines below); the
        // previous `data?.studyId` was undefined, so AI-driven navigation lost
        // its study context.
        navigate(data.route, { state: { studyID: data?.studyID } });
      }

      if (pageName === "qnr" && data.add) {
        await refreshQuestionnaireList();
      }

      if (data.add && data.liveLink && studyID) {
        const currentStudyState = store.getState().study;
        await queryClient.cancelQueries({
          queryKey: publishSurveyKeys.studyInfo(studyID),
        });
        queryClient.setQueryData(
          publishSurveyKeys.studyInfo(studyID),
          (previous: any) => ({
            ...(previous ?? {}),
            studyID: data.studyID ?? studyID,
            livelink: data.liveLink,
            link: data.liveLink,
            launch: 0,
          })
        );
        dispatch(
          setStudyInfo({
            studyID: data.studyID ?? studyID,
            hasQuestionnaire: currentStudyState.hasQuestionnaire,
            launch: 0,
            name: currentStudyState.name,
            output: currentStudyState.output,
            link: 1,
            closed: 0,
          })
        );
        refreshPublishSurveyData(studyID);
      }

      if (data.type === "activated" && data.liveLink) {
        await refreshHomeStudyList();
      }

      dispatch(setFollowUp(data.followUp));

      if (data.download === true && data?.pid) {
        processDownload({ studyID: data.studyID, pid: data.pid });
      }
    },
    [
      appendChatMessage,
      dispatch,
      navigate,
      pageName,
      processDownload,
      studyID,
      submitQuestionById,
    ]
  );

  const processChatResponseChain = useCallback(
    async (data: any) => {
      let currentResponse = data;
      let totalCallsCompleted = 0;

      while (currentResponse && totalCallsCompleted < MAX_RECALL_CHAIN_CALLS) {
        totalCallsCompleted += 1;
        syncMasterDataFromResponse(currentResponse);
        await processChatResponse(currentResponse);

        if (!shouldRequestRecall(currentResponse)) {
          break;
        }

        const recallResponse = await requestRecallResponse();
        if (!recallResponse) {
          break;
        }

        currentResponse = recallResponse;
      }

      return currentResponse;
    },
    [processChatResponse, requestRecallResponse]
  );

  const handleChatError = useCallback(() => {
    clearMasterDataProcess();
    dispatch(clearPendingSuggestions());
    appendChatMessage({
      text: "AI failed to respond. Please try again.",
      sender: "ai",
    });
  }, [appendChatMessage, dispatch]);

  const runStoredProcessLoop = useCallback(
    async (startMode: "immediate" | "delayed") => {
      const {
        apiToken: currentApiToken,
        contextKey: currentContextKey,
        isCurrentHistoryContext: isCurrentContext,
      } = latestStateRef.current;

      if (
        !currentApiToken ||
        !currentContextKey ||
        (!isCurrentContext && !isContextStillCurrent(currentContextKey))
      ) {
        return false;
      }

      if (activeProcessLoopContextKey === currentContextKey) {
        return false;
      }

      if (!hasActiveStoredProcess()) {
        return false;
      }

      activeProcessLoopContextKey = currentContextKey;
      processLoopOwnerRef.current = true;
      dispatch(setIsTyping(true));

      try {
        let shouldCallImmediately = startMode === "immediate";

        while (true) {
          const latestState = latestStateRef.current;
          if (
            !isMountedRef.current ||
            activeProcessLoopContextKey !== currentContextKey ||
            latestState.contextKey !== currentContextKey ||
            !isContextStillCurrent(currentContextKey)
          ) {
            break;
          }

          const masterData = getMasterData();
          if (!hasStoredProcessData(masterData)) {
            break;
          }

          if (!shouldCallImmediately) {
            await delay(PROCESS_LOOP_DELAY_MS);

            const refreshedState = latestStateRef.current;
            const refreshedMasterData = getMasterData();
            if (
              !isMountedRef.current ||
              activeProcessLoopContextKey !== currentContextKey ||
              refreshedState.contextKey !== currentContextKey ||
              !isContextStillCurrent(currentContextKey) ||
              !hasStoredProcessData(refreshedMasterData)
            ) {
              break;
            }
          }

          shouldCallImmediately = false;

          const currentMasterData = getMasterData();
          const res = await apiRequest(
            url.studyChatbot.method,
            url.studyChatbot.endpoint,
            {
              process_id: currentMasterData.process_id,
              order: currentMasterData.order,
              apiToken: currentApiToken,
            }
          );

          if (!res?.response) {
            throw new Error("Empty response from chat study API");
          }

          await processChatResponseChain(res.response);

          if (!hasActiveStoredProcess()) {
            break;
          }
        }

        return true;
      } catch {
        handleChatError();
        return false;
      } finally {
        if (activeProcessLoopContextKey === currentContextKey) {
          activeProcessLoopContextKey = null;
        }
        processLoopOwnerRef.current = false;

        const latestState = latestStateRef.current;
        if (
          isMountedRef.current &&
          latestState.contextKey === currentContextKey &&
          !hasActiveStoredProcess()
        ) {
          dispatch(setIsTyping(false));
        }
      }
    },
    [dispatch, handleChatError, processChatResponseChain]
  );

  const {
    mutate: requestChatResponse,
    isPending: isChatPending,
    data: chatResponse,
  } = mutationStructure({
    mutationKey: [url.studyChatbot.mutationKey, pageName, studyID],
    mutationFn: async (payload: { prompt: string }) => {
      const res = await apiRequest(
        url.studyChatbot.method,
        url.studyChatbot.endpoint,
        { prompt: payload.prompt, pageName, followUp, studyID }
      );
      return res.response;
    },
    onSuccess: async (data) => {
      await processChatResponseChain(data);

      if (hasActiveStoredProcess()) {
        await runStoredProcessLoop("delayed");
      } else {
        dispatch(setIsTyping(false));
      }
    },
    onError: () => {
      handleChatError();
      dispatch(setIsTyping(false));
    },
  });

  const sendMessage = (rawPrompt?: string) => {
    const prompt = (rawPrompt ?? message).trim();
    const pendingSuggestionCount =
      store.getState().chat.pendingSuggestionCount;

    if (
      !prompt ||
      isTyping ||
      pending ||
      !isCurrentHistoryContext ||
      !hasLoadedHistory ||
      isHistoryLoading ||
      pendingSuggestionCount > 0
    ) {
      return false;
    }

    dispatch(clearPendingSuggestions());
    const userMessage = createUserChatMessage(prompt);
    if (userMessage) {
      appendChatMessage(userMessage);
    }
    dispatch(setIsTyping(true));
    requestChatResponse({ prompt });

    if (rawPrompt === undefined) {
      dispatch(setMessage(""));
    }

    return true;
  };

  useEffect(() => {
    if (!followUp) return;

    if (followUp !== "" && chatResponse && chatResponse.active) {
      dispatch(setFollowUp(""));
      window.setTimeout(() => {
        sendMessage(followUp);
      }, 1000);
    }
  }, [chatResponse, dispatch, followUp]);

  useEffect(() => {
    dispatch(setPending(isChatPending));
  }, [dispatch, isChatPending]);

  useEffect(() => {
    const handleHistoryReady = async (event: Event) => {
      const customEvent = event as CustomEvent<{ contextKey?: string }>;
      if (customEvent.detail?.contextKey !== contextKey) {
        return;
      }

      if (!hasStoredProcessData(getMasterData())) {
        return;
      }

      await runStoredProcessLoop("immediate");
    };

    window.addEventListener(
      CHAT_HISTORY_READY_EVENT,
      handleHistoryReady as EventListener
    );

    return () => {
      window.removeEventListener(
        CHAT_HISTORY_READY_EVENT,
        handleHistoryReady as EventListener
      );
    };
  }, [contextKey, runStoredProcessLoop]);

  return {
    closeChat,
    isChatOpen,
    isChatPending,
    isTyping,
    message,
    messages,
    openChat,
    openChatWithMessage,
    pending,
    sendMessage,
    setDraftMessage,
  };
};

export default useChat;
