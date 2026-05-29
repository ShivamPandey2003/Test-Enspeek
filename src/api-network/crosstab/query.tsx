import { useDispatch, useSelector } from "react-redux";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { AppDispatch, RootState } from "../../store/store";
import { apiRequest } from "../../services/apiService";
import queryStructure from "../query-template";
import url from "../url";
import crosstabKeys from "./keys";
import {
  setBannerPointer,
  setBanners,
  setBannersAll,
  setVarsData,
} from "../../store/CrossTabDataSlice";
import { setStudyInfo } from "../../store/CrosstabStudySlice";

export const useCrosstabStudyInfo = (studyID: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const { data: StudyInfo } = useSuspenseQuery({
    queryKey: crosstabKeys.studyInfo(studyID),
    queryFn: async () => {
      const res = await apiRequest(url.studyInfo.method, url.studyInfo.endpoint, {
        studyID,
      });

      dispatch(
        setStudyInfo({
          studyID,
          hasQuestionnaire: res.response.hasquestionnaire,
          launch: res.response.launch,
          name: res.response.studyname,
          output: res.response.output,
          link: res.response.link,
          closed: res.response.closed,
        })
      );

      return res.response;
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { StudyInfo };
};

export const useBannerList = (studyID: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const bannerListQuery = queryStructure({
    queryKey: crosstabKeys.bannerList(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.crosstabBannerList.method,
        url.crosstabBannerList.endpoint,
        {
          studyID,
        }
      );
      dispatch(setBannersAll(res.response));
      dispatch(setBanners(res.response));
      localStorage.setItem("BannerPoniterList", JSON.stringify(res.response));
      return res.response;
    },
    enable: !!apiToken && !!studyID,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    BannerListData: bannerListQuery.data,
    isBannerListLoading: bannerListQuery.isLoading,
    isBannerListError: bannerListQuery.isError,
  };
};

export const useQList = (studyID: string, bannerID: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const qListQuery = queryStructure({
    queryKey: crosstabKeys.qList(studyID, bannerID),
    queryFn: async () => {
      const res = await apiRequest(
        url.crosstabQuestionList.method,
        url.crosstabQuestionList.endpoint,
        {
          studyID,
          bannerID,
        }
      );
      return res.response;
    },
    enable: !!apiToken && !!studyID,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    QListData: qListQuery.data ?? [],
    isQListDataPending: qListQuery.isPending,
  };
};

export const useQuesLogicVar = (studyID: string, questionID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const quesLogicVarQuery = queryStructure({
    queryKey: crosstabKeys.questionnaireLogicVars(studyID, questionID),
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
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    quesLogicVarData: quesLogicVarQuery.data,
    isQuesLogicVarPending: quesLogicVarQuery.isPending,
  };
};

export const useLogicVar = (studyID: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const logicVarQuery = queryStructure({
    queryKey: crosstabKeys.crosstabLogicVars(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.crosstabLogicVars.method,
        url.crosstabLogicVars.endpoint,
        {
          studyID,
        }
      );
      dispatch(setVarsData(res.response));
      return res.response;
    },
    enable: !!apiToken && !!studyID,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    logicVarData: logicVarQuery.data,
    isLogicVarPending: logicVarQuery.isPending,
  };
};

export const useBannerPointerList = (
  bannerID: string = "HBUipTq7IZOwA",
  studyID: string = "CS_FWypI6XEdjwl9U"
) => {
  const dispatch = useDispatch<AppDispatch>();

  const bannerPointerQuery = useQuery({
    queryKey: crosstabKeys.bannerPointerList(bannerID, studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.crosstabBannerPointList.method,
        url.crosstabBannerPointList.endpoint,
        {
          studyID,
          bannerID,
        }
      );
      dispatch(
        setBannerPointer(
          Array.isArray(res.response)
            ? res.response
            : [
                {
                  bannerGroup: "",
                  logic: [],
                  pointID: "",
                  seq: 1,
                  statLevel: null,
                  title: "Banner point 1",
                  active: 0,
                  alpha: "",
                },
              ]
        )
      );
      return res.response;
    },
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  return {
    bannerPointerListData: bannerPointerQuery.data,
    isBannerPointerListPending: bannerPointerQuery.isFetching,
    isBannerPointerError: bannerPointerQuery.isError,
  };
};
