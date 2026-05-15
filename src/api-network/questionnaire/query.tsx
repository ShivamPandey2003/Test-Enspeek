import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { apiRequest } from "../../services/apiService";
import queryStructure from "../query-template";
import url from "../url";
import questionnaireKeys from "./keys";
import { setQTypeList } from "../../store/TriggerSlice";
import { setStudyInfo } from "../../store/CrosstabStudySlice";
import { setQuestionGroup, setQuestionList } from "../../store/QuestionSlice";
import { setVarsData } from "../../store/CrossTabDataSlice";

export const useQuestionnaireStudyInfo = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const studyInfoQuery = queryStructure({
    queryKey: questionnaireKeys.studyInfo(studyID),
    queryFn: async () => {
      const res = await apiRequest(url.studyInfo.method, url.studyInfo.endpoint, {
        studyID,
      });

      dispatch(setStudyInfo({
        studyID: studyID ?? null,
        hasQuestionnaire: res.response.hasquestionnaire,
        launch: res.response.launch,
        name: res.response.studyname,
        output: res.response.output,
        link: res.response.link,
        closed: res.response.closed,
      }));

      return res.response;
    },
    enable: !!apiToken && !!studyID,
  });

  return {
    studyInfo: studyInfoQuery.data,
    isStudyInfoLoading: studyInfoQuery.isLoading,
    refetchStudyInfo: studyInfoQuery.refetch,
  };
};

export const useQuestionnaireQuestionTypes = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const questionTypeQuery = queryStructure({
    queryKey: questionnaireKeys.questionTypes(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.questionnaireQuestionType.method,
        url.questionnaireQuestionType.endpoint,
        {
          studyID,
        }
      );

      dispatch(setQTypeList(res.response));
      return res.response;
    },
    enable: !!apiToken && !!studyID,
  });

  return {
    questionTypes: questionTypeQuery.data ?? [],
    isQuestionTypesLoading: questionTypeQuery.isLoading,
  };
};

export const useQuestionnaireRI = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const { qType } = useSelector((state: RootState) => state.trigger);

  const riQuery = queryStructure({
    queryKey: questionnaireKeys.ri(studyID, qType),
    queryFn: async () => {
      const res = await apiRequest(
        url.questionnaireAddRi.method,
        url.questionnaireAddRi.endpoint,
        {
          qtype: qType,
          studyID,
        }
      );

      return res.response;
    },
    enable: !!apiToken && !!studyID && !!qType,
    retry: 0,
  });

  return {
    riList: riQuery.data,
    isRiLoading: riQuery.isLoading,
  };
};

export const useQuestionnaireList = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const questionState = useSelector((state: RootState) => state.question);
  const dispatch = useDispatch<AppDispatch>();

  const questionListQuery = queryStructure({
    queryKey: questionnaireKeys.questionList(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.fetchQuestionList.method,
        url.fetchQuestionList.endpoint,
        {
          studyID,
        }
      );

      const apiData = Array.isArray(res.response) && res.response[0]?.qList ? res.response[0] : { groupID: "", groupText: "", groupLogic: "", qList: [] };

      dispatch(setQuestionList(apiData.qList));
      dispatch(setQuestionGroup({
        ...apiData,
        logicPayload: apiData.logicPayload ?? questionState.logicPayload ?? {},
        logic2Skip: apiData.logic2Skip ?? questionState.logic2Skip ?? {},
        getLogicRes: apiData.getLogicRes ?? questionState.getLogicRes ?? {},
        questionList: apiData.questionList ?? [],
        submitItems: questionState.submitItems,
        hydratingQuestionIds: questionState.hydratingQuestionIds ?? [],
        editingQuestion: questionState.editingQuestion,
      }));

      return apiData;
    },
    enable: !!apiToken && !!studyID,
  });

  return {
    questionnaireList: questionListQuery.data,
    isQuestionnaireListLoading: questionListQuery.isLoading,
    isQuestionnaireListRefetching: questionListQuery.isRefetching,
    refetchQuestionnaireList: questionListQuery.refetch,
  };
};

export const useQuestionnaireGetQuestion = (
  studyID?: string,
  questionID?: string | null,
  enabled = true
) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const questionGetQuery = queryStructure({
    queryKey: questionnaireKeys.questionGet(studyID, questionID ?? undefined),
    queryFn: async () => {
      const res = await apiRequest(
        url.questionGet.method,
        url.questionGet.endpoint.replace(":questionId", questionID as string),
        {
          studyID,
        }
      );

      return res.response;
    },
    enable: enabled && !!apiToken && !!studyID && !!questionID,
  });

  return {
    questionGetData: questionGetQuery.data,
    isQuestionGetLoading: questionGetQuery.isLoading,
  };
};

export const useQuestionnaireLogicVars = (studyID?: string, questionID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const logicVarQuery = queryStructure({
    queryKey: questionnaireKeys.logicVars(studyID, questionID),
    queryFn: async () => {
      const res = await apiRequest(
        url.questionLogicVars.method,
        url.questionLogicVars.endpoint,
        {
          studyID,
          qID: questionID,
        }
      );

      dispatch(setVarsData(res.response));
      return res.response;
    },
    enable: !!apiToken && !!studyID,
  });

  return {
    logicVarData: logicVarQuery.data,
    isLogicVarLoading: logicVarQuery.isLoading,
  };
};
