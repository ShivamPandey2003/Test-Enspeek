import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import type { AppDispatch, RootState } from "../../store/store";
import mutationStructure from "../mutation-template";
import { apiRequest } from "../../services/apiService";
import url from "../url";
import questionnaireKeys from "./keys";
import { queryClient } from "../../App";
import { setAllSubmitItems, setEditingQuestion, setLogic2Skip, setSubmitItems } from "../../store/QuestionSlice";
import { setOptsData } from "../../store/CrossTabDataSlice";
import { setIsAddingQuestion } from "../../store/TriggerSlice";

const mapLogic2Skip = (data: Question) => {
  const logicMap: Record<string, string> = {};

  data.logic2?.forEach((entry: Record<string, string>) => {
    const logicType = Object.keys(entry)[0];
    const logicValue = entry[logicType];
    logicMap[logicType] = logicValue;
  });

  return logicMap;
};

const refreshQuestionnaireQueries = async (studyID?: string) => {
  if (!studyID) return;

  await queryClient.refetchQueries({
    queryKey: questionnaireKeys.questionList(studyID),
    type: "active",
  });
};

export const useQuestionViewMutation = (studyID?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  return mutationStructure({
    mutationKey: [url.questionView.mutationKey, studyID],
    mutationFn: async (questionID: string) => {
      const res = await apiRequest(
        url.questionView.method,
        url.questionView.endpoint.replace(":qId", questionID),
        {
          studyID,
        }
      );

      return res.response as Question;
    },
    onSuccess: (data: Question) => {
      dispatch(setSubmitItems({ ...data, isLoaded: true }));
      dispatch(setLogic2Skip({ qID: data.qID, message: mapLogic2Skip(data) }));
    },
  });
};

export const useHydrateQuestionnaireSubmitItems = (
  studyID?: string,
  questionList?: { qID: string }[]
) => {
  const dispatch = useDispatch<AppDispatch>();
  const submitItems = useSelector((state: RootState) => state.question.submitItems);
  const { mutate: fetchQuestionById } = useQuestionViewMutation(studyID);
  const lastHydratedKeyRef = useRef("");
  const submitItemsRef = useRef(submitItems);
  const fetchQuestionByIdRef = useRef(fetchQuestionById);
  const questionIdsKey = useMemo(
    () => (questionList?.length ? questionList.map((item) => item.qID).join("|") : ""),
    [questionList]
  );

  useEffect(() => {
    submitItemsRef.current = submitItems;
  }, [submitItems]);

  useEffect(() => {
    fetchQuestionByIdRef.current = fetchQuestionById;
  }, [fetchQuestionById]);

  useEffect(() => {
    if (questionList?.length) {
      if (lastHydratedKeyRef.current === questionIdsKey) {
        return;
      }

      lastHydratedKeyRef.current = questionIdsKey;
      const existingItemsMap = new Map(
        submitItemsRef.current.map((item) => [item.qID, item])
      );
      const mergedItems: any[] = questionList.map((item) => {
        const existingItem = existingItemsMap.get(item.qID);
        return existingItem
          ? existingItem
          : {
              ...item,
              isLoaded: false,
            };
      });

      dispatch(
        setAllSubmitItems(mergedItems)
      );

      mergedItems.forEach((item) => {
        if (item?.qID && item.isLoaded === false) {
          fetchQuestionByIdRef.current(item.qID);
        }
      });
      return;
    }

    lastHydratedKeyRef.current = "";
    dispatch(setAllSubmitItems([]));
  }, [dispatch, questionIdsKey, questionList]);
};

export const useCreateQuestionMutation = (studyID?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  return mutationStructure({
    mutationKey: [url.questionnaireAdd.mutationKey, studyID],
    mutationFn: async (payload: QuestionPayload) => {
      const res = await apiRequest(
        url.questionnaireAdd.method,
        url.questionnaireAdd.endpoint,
        payload
      );
      return { response: res.response, payload };
    },
    onSuccess: async () => {
      await refreshQuestionnaireQueries(studyID);
      dispatch(setIsAddingQuestion(false));
      dispatch(setEditingQuestion(null));
      toast.success("Question saved successfully");
    },
  });
};

export const useEditQuestionMutation = (studyID?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const { mutateAsync: refreshQuestion } = useQuestionViewMutation(studyID);

  return mutationStructure({
    mutationKey: [url.questionnaireEdit.mutationKey, studyID],
    mutationFn: async (data: Question) => {
      const res = await apiRequest(
        url.questionnaireEdit.method,
        url.questionnaireEdit.endpoint,
        {
          studyID,
          QID: data.qID,
          ...data,
        }
      );
      return { response: res.response, question: data };
    },
    onSuccess: async (_, variables) => {
      if (variables.qID) {
        await refreshQuestion(variables.qID);
      }
      await refreshQuestionnaireQueries(studyID);
      dispatch(setIsAddingQuestion(false));
      dispatch(setEditingQuestion(null));
      toast.success("Question saved successfully");
    },
  });
};

export const useDeleteQuestionMutation = (studyID?: string) => {
  return mutationStructure({
    mutationKey: [url.deleteQuestion.mutationKey, studyID],
    mutationFn: async (questionID: string) => {
      const res = await apiRequest(
        url.deleteQuestion.method,
        url.deleteQuestion.endpoint,
        {
          studyID,
          QID: questionID,
        }
      );
      return { response: res.response, questionID };
    },
    onSuccess: async () => {
      await refreshQuestionnaireQueries(studyID);
    },
  });
};

export const useCopyQuestionMutation = (studyID?: string) => {
  return mutationStructure({
    mutationKey: [url.questionCopy.mutationKey, studyID],
    mutationFn: async (data: {
      questionID: string;
      newId: string;
      label: string;
    }) => {
      const res = await apiRequest(url.questionCopy.method, url.questionCopy.endpoint, {
        studyID,
        oldQID: data.questionID,
        newQID: data.newId,
        qLabel: data.label,
      });
      return { response: res.response, payload: data };
    },
    onSuccess: async (_, variables) => {
      await refreshQuestionnaireQueries(studyID);
      toast.success(`${variables.questionID} question copied successfully`);
    },
  });
};

export const useRearrangeQuestionMutation = (studyID?: string) => {
  return mutationStructure({
    mutationKey: [url.questionRearrange.mutationKey, studyID],
    mutationFn: async (sequence: Record<number, string>) => {
      const res = await apiRequest(
        url.questionRearrange.method,
        url.questionRearrange.endpoint,
        {
          studyID,
          seq: sequence,
        }
      );
      return res.response;
    },
  });
};

export const useQuestionLogicOptionsMutation = (studyID?: string) => {
  const dispatch = useDispatch<AppDispatch>();

  return mutationStructure({
    mutationKey: [url.questionLogicOptions.mutationKey, studyID],
    mutationFn: async (questionID: string) => {
      const res = await apiRequest(
        url.questionLogicOptions.method,
        url.questionLogicOptions.endpoint,
        {
          studyID,
          qID: questionID,
        }
      );

      return { response: res.response, questionID };
    },
    onSuccess: (data) => {
      dispatch(setOptsData({ key: data.questionID, data: data.response }));
    },
  });
};

export const useSaveQuestionLogicMutation = (
  studyID?: string,
  questionID?: string | null
) => {
  const { mutateAsync: refreshQuestion } = useQuestionViewMutation(studyID);

  return mutationStructure({
    mutationKey: [url.questionEditLogic.mutationKey, studyID, questionID],
    mutationFn: async ({
      payload,
      isResetting,
    }: {
      payload: QuesLogicPayload;
      isResetting?: boolean;
    }) => {
      const response = await apiRequest(
        url.questionEditLogic.method,
        url.questionEditLogic.endpoint.replace(":qId", questionID as string),
        {
          studyID,
          ...payload,
        }
      );

      return {
        response: response.response,
        isResetting,
      };
    },
    onSuccess: async ({ isResetting }) => {
      if (questionID) {
        await refreshQuestion(questionID);
      }

      toast.success(isResetting ? "Logic reset successfully" : "Logic saved successfully");
    },
  });
};

export const useUpdateOptionLogicMutation = (
  studyID?: string,
  questionID?: string,
  optionID?: string,
  optionText?: string
) => {
  const { mutateAsync: refreshQuestion } = useQuestionViewMutation(studyID);

  return mutationStructure({
    mutationKey: [url.questionnaireEdit.mutationKey, studyID, questionID, optionID],
    mutationFn: async ({
      terminate,
      skipTo,
      isReset,
      isRemoveTerminate,
      isRemoveSkip,
    }: {
      terminate: boolean;
      skipTo: string;
      isReset?: boolean;
      isRemoveTerminate?: boolean;
      isRemoveSkip?: boolean;
    }) => {
      const res = await apiRequest(
        url.questionnaireEdit.method,
        `/questionnaire/edit/logic/${optionID}`,
        {
          studyID,
          option_terminate: terminate ? 1 : 0,
          option_skip: terminate ? "" : skipTo,
        }
      );

      return {
        response: res.response,
        terminate,
        isReset,
        isRemoveTerminate,
        isRemoveSkip,
      };
    },
    onSuccess: async ({ terminate, isReset, isRemoveTerminate, isRemoveSkip }) => {
      if (isReset) {
        toast.success(`Logic reset successfully for -> ${questionID} ${optionText}`);
      } else if (isRemoveTerminate) {
        toast.success(`Remove terminate successfully for -> ${questionID} ${optionText}`);
      } else if (isRemoveSkip) {
        toast.success(`Remove skip logic successfully for -> ${questionID} ${optionText}`);
      } else {
        toast.success(`${terminate ? "Terminate" : "Skip logic"} applied in -> ${questionID} ${optionText}`);
      }

      if (questionID) {
        await refreshQuestion(questionID);
      }
    },
  });
};
