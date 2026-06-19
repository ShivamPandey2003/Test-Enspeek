import { getPageName } from "./getPageName";

const STUDY_CONTEXT_PATHS = [
  "/questionnaire",
  "/publish-survey",
  "/report",
  "/crosstab",
];

const isSupportedChatHistoryPath = (pathname: string) =>
  pathname === "/" || STUDY_CONTEXT_PATHS.some((path) => pathname.startsWith(path));

export const shouldIncludeStudyIdForChatHistory = (pathname: string) =>
  STUDY_CONTEXT_PATHS.some((path) => pathname.startsWith(path));

export const getChatHistoryContext = (
  pathname: string,
  studyID?: string
) => {
  const pageName = isSupportedChatHistoryPath(pathname) ? getPageName(pathname) : "";
  const resolvedStudyID = shouldIncludeStudyIdForChatHistory(pathname)
    ? studyID
    : undefined;

  return {
    contextKey: `${pageName}:${resolvedStudyID ?? ""}`,
    pageName,
    studyID: resolvedStudyID,
  };
};

export const isChatHistoryContextCurrent = (
  activeContextKey: string,
  pathname: string,
  studyID?: string
) => activeContextKey === getChatHistoryContext(pathname, studyID).contextKey;
