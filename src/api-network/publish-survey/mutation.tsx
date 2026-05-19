import { toast } from "sonner";
import mutationStructure from "../mutation-template";
import { apiRequest } from "../../services/apiService";
import url from "../url";
import { queryClient } from "../../App";
import publishSurveyKeys from "./keys";
import { store } from "../../store/store";
import { setStudyInfo } from "../../store/CrosstabStudySlice";

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const refetchPublishSurveyStudyInfo = async (studyID?: string) => {
  if (!studyID) return;

  await queryClient.invalidateQueries({
    queryKey: publishSurveyKeys.studyInfo(studyID),
  });
  await queryClient.refetchQueries({
    queryKey: publishSurveyKeys.studyInfo(studyID),
    type: "active",
  });
};

const waitForPublishSurveyStudyInfo = async (
  studyID: string | undefined,
  predicate: (data: any) => boolean,
  attempts = 6,
  delayMs = 700
) => {
  if (!studyID) return;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    await refetchPublishSurveyStudyInfo(studyID);
    const studyInfo = queryClient.getQueryData(
      publishSurveyKeys.studyInfo(studyID)
    );

    if (predicate(studyInfo)) {
      return studyInfo;
    }

    if (attempt < attempts - 1) {
      await wait(delayMs);
    }
  }
};

const refetchPublishSurveyQuotaReport = async (studyID?: string) => {
  if (!studyID) return;

  await queryClient.invalidateQueries({
    queryKey: publishSurveyKeys.quotaReport(studyID),
  });
  await queryClient.refetchQueries({
    queryKey: publishSurveyKeys.quotaReport(studyID),
    type: "active",
  });
};

const refetchPublishSurveyQuota = async (studyID?: string) => {
  if (!studyID) return;

  await queryClient.invalidateQueries({
    queryKey: publishSurveyKeys.quota(studyID),
  });
  await queryClient.refetchQueries({
    queryKey: publishSurveyKeys.quota(studyID),
    type: "active",
  });
};

export const useGenerateGlobalLinkMutation = (studyID?: string, studyName?: string) => {
  return mutationStructure({
    mutationKey: [url.generateGlobalLink.mutationKey, studyID],
    mutationFn: async () => {
      const res = await apiRequest(
        url.generateGlobalLink.method,
        url.generateGlobalLink.endpoint,
        {
          studyID,
        }
      );
      return res.response;
    },
    onSuccess: async (data: any) => {
      if (studyID && (data?.liveLink || data?.livelink)) {
        const liveLink = data.liveLink ?? data.livelink;
        const currentStudyState = store.getState().study;

        await queryClient.cancelQueries({
          queryKey: publishSurveyKeys.studyInfo(studyID),
        });

        queryClient.setQueryData(
          publishSurveyKeys.studyInfo(studyID),
          (previous: any) => ({
            ...(previous ?? {}),
            studyID: data.studyID ?? studyID,
            livelink: liveLink,
            liveLink,
            link: liveLink,
            launch: 1,
            closed: 0,
          })
        );

        store.dispatch(
          setStudyInfo({
            studyID: data.studyID ?? studyID,
            hasQuestionnaire: currentStudyState.hasQuestionnaire,
            launch: 1,
            name: currentStudyState.name,
            output: currentStudyState.output,
            link: 1,
            closed: 0,
          })
        );
      }

      await waitForPublishSurveyStudyInfo(
        studyID,
        (studyInfo) => Boolean(studyInfo?.livelink || studyInfo?.liveLink)
      );
      await refetchPublishSurveyQuotaReport(studyID);
      await refetchPublishSurveyQuota(studyID);
      toast.success(`${studyName ?? "Study"} activated, data collection enabled`);
    },
  });
};

export const useSetQuotaMutation = (studyID?: string) => {
  return mutationStructure({
    mutationKey: [url.setQuota.mutationKey, studyID],
    mutationFn: async (quota: number) => {
      const res = await apiRequest(url.setQuota.method, url.setQuota.endpoint, {
        studyID,
        quota_limit: quota,
      });
      return res.response;
    },
    onSuccess: async () => {
      await refetchPublishSurveyQuota(studyID);
      await refetchPublishSurveyQuotaReport(studyID);
      toast.success("Quota updated successfully!");
    },
  });
};

export const useInitiateSampleCollectionMutation = (studyID?: string) => {
  return mutationStructure({
    mutationKey: [url.setLaunch.mutationKey, studyID],
    mutationFn: async () => {
      const res = await apiRequest(url.setLaunch.method, url.setLaunch.endpoint, {
        studyID,
      });
      return res.response;
    },
    onSuccess: async () => {
      await waitForPublishSurveyStudyInfo(
        studyID,
        (studyInfo) => Number(studyInfo?.launch) === 1
      );
      await refetchPublishSurveyQuotaReport(studyID);
      await refetchPublishSurveyQuota(studyID);
      toast.success("Study set for sample collection");
    },
  });
};
