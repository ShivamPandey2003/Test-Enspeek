import url from "../url";

export const publishSurveyKeys = {
  all: ["publishSurvey"] as const,

  studyInfo: (studyID?: string) => [...publishSurveyKeys.all, url.studyInfo.queryKey, studyID] as const,

  subgroup: (studyID?: string) => [...publishSurveyKeys.all, url.getSubgroup.queryKey, studyID] as const,

  quota: (studyID?: string) => [...publishSurveyKeys.all, url.getQuota.queryKey, studyID] as const,

  quotaReport: (studyID?: string) => [...publishSurveyKeys.all, url.crosstabFinalReport.queryKey, studyID] as const,

  facebookLink: (studyID?: string) => [...publishSurveyKeys.all, url.facebookLink.queryKey, studyID] as const,

  whatsappLink: (studyID?: string) => [...publishSurveyKeys.all, url.whatsappLink.queryKey, studyID] as const,
};

export default publishSurveyKeys;
