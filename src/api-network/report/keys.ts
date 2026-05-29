import url from "../url";

export const reportKeys = {
  all: ["report"] as const,

  studyInfo: (studyID?: string) => [...reportKeys.all, url.studyInfo.queryKey, studyID] as const,

  viewList: (studyID?: string) => [...reportKeys.all, url.reportViewList.queryKey, studyID] as const,

  viewByIdRoot: (studyID?: string) => [...reportKeys.all, url.reportViewById.queryKey, studyID] as const,

  viewById: (studyID?: string, qID?: string, selected?: string, sideBySide?: string) => [...reportKeys.viewByIdRoot(studyID), qID, selected, sideBySide] as const,

  processList: (studyID?: string) => [...reportKeys.all, url.reportProcessList.queryKey, studyID] as const,

  sideBySideVariables: (studyID?: string) => [...reportKeys.all, url.reportSideBySideVariables.queryKey, studyID] as const,

  appliedFilter: (studyID?: string, refreshKey?: unknown) => [...reportKeys.all, url.reportAppliedFilter.queryKey, studyID, refreshKey] as const,

  filtersList: (studyID?: string, refreshKey?: unknown) => [...reportKeys.all, url.reportFiltersList.queryKey, studyID, refreshKey] as const,

  filters: (studyID?: string, refreshKey?: unknown) => [...reportKeys.all, url.reportFilters.queryKey, studyID, refreshKey] as const,
};

export default reportKeys;
