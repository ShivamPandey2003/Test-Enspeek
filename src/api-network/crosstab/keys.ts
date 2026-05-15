import url from "../url";

export const crosstabKeys = {
  all: ["crosstab"] as const,

  studyInfo: (studyID?: string) =>
    [...crosstabKeys.all, url.studyInfo.queryKey, studyID] as const,

  bannerList: (studyID?: string) =>
    [...crosstabKeys.all, url.crosstabBannerList.queryKey, studyID] as const,

  tableList: (bannerID?: string, studyID?: string) =>
    [...crosstabKeys.all, url.crosstabTableList.queryKey, bannerID, studyID] as const,

  qList: (studyID?: string, bannerID?: string) =>
    [...crosstabKeys.all, url.crosstabQuestionList.queryKey, studyID, bannerID] as const,

  tableOutput: (bannerID?: string, tableID?: string, studyID?: string) =>
    [...crosstabKeys.all, url.crosstabTableOutput.queryKey, bannerID, tableID, studyID] as const,

  tableOutputEditRows: (bannerID?: string, tableID?: string, studyID?: string) =>
    [...crosstabKeys.all, "tableOutputEditRows", bannerID, tableID, studyID] as const,

  questionnaireLogicVars: (studyID?: string, questionID?: string) =>
    [...crosstabKeys.all, url.questionLogicVars.queryKey, studyID, questionID] as const,

  crosstabLogicVars: (studyID?: string) =>
    [...crosstabKeys.all, url.crosstabLogicVars.queryKey, studyID] as const,

  opList: (tableID?: string, qID?: string, bannerID?: string, studyID?: string) =>
    [...crosstabKeys.all, url.crosstabTableOptionList.queryKey, tableID, qID, bannerID, studyID] as const,

  bannerPointerList: (bannerID?: string, studyID?: string) =>
    [...crosstabKeys.all, url.crosstabBannerPointList.queryKey, bannerID, studyID] as const,
};

export default crosstabKeys;
