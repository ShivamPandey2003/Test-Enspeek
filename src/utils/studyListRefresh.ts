export type StudyListSelection = "myactive" | "allactive" | "isarchived";

export type RefreshStudyListOptions = {
  selection?: StudyListSelection;
  resetSearch?: boolean;
};

export type RefreshStudyListEventDetail = RefreshStudyListOptions & {
  resolve?: () => void;
};

export const REFRESH_STUDY_LIST_EVENT = "refresh-study-list";

