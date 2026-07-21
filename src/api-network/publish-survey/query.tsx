import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { apiRequest } from "../../services/apiService";
import queryStructure from "../query-template";
import url from "../url";
import publishSurveyKeys from "./keys";
import { setStudyInfo } from "../../store/CrosstabStudySlice";

export const usePublishSurveyStudyInfo = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const studyInfoQuery = queryStructure({
    queryKey: publishSurveyKeys.studyInfo(studyID),
    queryFn: async () => {
      const res = await apiRequest(url.studyInfo.method, url.studyInfo.endpoint, {
        studyID,
      });

      dispatch(
        setStudyInfo({
          studyID: studyID ?? null,
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
    enable: !!apiToken && !!studyID,
  });

  return {
    studyInfo: studyInfoQuery.data,
    isStudyInfoLoading: studyInfoQuery.isLoading,
    refetchStudyInfo: studyInfoQuery.refetch,
  };
};

export const usePublishSurveySubgroup = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const subgroupQuery = queryStructure({
    queryKey: publishSurveyKeys.subgroup(studyID),
    queryFn: async () => {
      const res = await apiRequest(url.getSubgroup.method, url.getSubgroup.endpoint, {
        studyID,
      });
      return res.response;
    },
    enable: !!apiToken && !!studyID,
  });

  return {
    subgroupData: subgroupQuery.data,
    isSubgroupLoading: subgroupQuery.isLoading,
  };
};

export const usePublishSurveyQuotaReport = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const quotaReportQuery = queryStructure({
    queryKey: publishSurveyKeys.quotaReport(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.crosstabFinalReport.method,
        url.crosstabFinalReport.endpoint,
        {
          studyID,
        }
      );
      return res.response;
    },
    enable: !!studyID && !!apiToken,
    refetchOnWindowFocus: true,
  });

  return {
    quotaReport: quotaReportQuery.data,
    isQuotaReportLoading: quotaReportQuery.isLoading,
    refetchQuotaReport: quotaReportQuery.refetch,
  };
};

export const usePublishSurveyQuota = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const quotaQuery = queryStructure({
    queryKey: publishSurveyKeys.quota(studyID),
    queryFn: async () => {
      const res = await apiRequest(url.getQuota.method, url.getQuota.endpoint, {
        studyID,
      });
      return res.response;
    },
    enable: !!studyID && !!apiToken,
  });

  return {
    quotaData: quotaQuery.data,
    isQuotaLoading: quotaQuery.isLoading,
    refetchQuota: quotaQuery.refetch,
  };
};

export const useFacebookLink = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const facebookLinkQuery = queryStructure({
    queryKey: publishSurveyKeys.facebookLink(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.facebookLink.method,
        url.facebookLink.endpoint,
        {
          studyID,
        }
      );
      return res.response;
    },
    enable: !!studyID && !!apiToken,
  });

  return {
    facebookLinkData: facebookLinkQuery.data,
    isFacebookLinkLoading: facebookLinkQuery.isLoading,
  };
};

export const useWhatsappLink = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const whatsappLinkQuery = queryStructure({
    queryKey: publishSurveyKeys.whatsappLink(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.whatsappLink.method,
        url.whatsappLink.endpoint,
        {
          studyID,
        }
      );
      return res.response;
    },
    enable: !!studyID && !!apiToken,
  });

  return {
    whatsappLinkData: whatsappLinkQuery.data,
    isWhatsappLinkLoading: whatsappLinkQuery.isLoading,
  };
};
