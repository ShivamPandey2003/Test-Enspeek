import url from "../url";

export const questionnaireKeys = {
  all: ["questionnaire"] as const,

  studyInfo: (studyID?: string) => [...questionnaireKeys.all, url.studyInfo.queryKey, studyID] as const,

  questionTypes: (studyID?: string) => [...questionnaireKeys.all, url.questionnaireQuestionType.queryKey, studyID] as const,

  ri: (studyID?: string, qType?: string) => [...questionnaireKeys.all, url.questionnaireAddRi.queryKey, studyID, qType] as const,

  questionList: (studyID?: string) => [...questionnaireKeys.all, url.fetchQuestionList.queryKey, studyID] as const,

  questionView: (studyID?: string, qID?: string) => [...questionnaireKeys.all, url.questionView.queryKey, studyID, qID] as const,

  questionGet: (studyID?: string, questionID?: string) => [...questionnaireKeys.all, url.questionGet.queryKey, studyID, questionID] as const,

  logicVars: (studyID?: string, questionID?: string) => [...questionnaireKeys.all, url.questionLogicVars.queryKey, studyID, questionID] as const,
};

export default questionnaireKeys;
