import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { apiRequest } from "../../services/apiService";
import queryStructure from "../query-template";
import url from "../url";
import reportKeys from "./keys";
import { setStudyInfo } from "../../store/CrosstabStudySlice";
import { setFilterList, setFliterReportData, setReportFilterList, setTableQList } from "../../store/FiltersSlice";

const mapFilterList = (filterListResponse: any) => (filterListResponse?.seq ?? []).map((seq: string) => {
  const value = filterListResponse[seq];
  const { rowOptionList, ...rest } = value;
  return { id: seq, ...rest };
});

const mapReportFilterList = (reportFilterResponse: any) => (reportFilterResponse?.seq ?? []).filter((seq: string) => {
  const value = reportFilterResponse[seq];
  return value && Object.keys(value).length > 0;
}).map((seq: string) => {
  const value = reportFilterResponse[seq];
  return { id: seq, ...value };
});

const normalizeReportViewResponse = (response: any) => {
  if (Array.isArray(response)) {
    return response[0] ?? null;
  }

  if (response?.response && typeof response.response === "object") {
    return response.response;
  }

  return response ?? null;
};

const buildReportViewData = (response: any) => {
  if (!response?.seq?.length) {
    return {
      rawData: null,
      tableData: null,
      chartData: null,
    };
  }

  const qID = response.seq[0];
  const questionData = response?.[qID];

  if (!qID || !questionData) {
    return {
      rawData: null,
      tableData: null,
      chartData: null,
    };
  }

  const resolvedQuestionData = {
    ...questionData,
    base: response.BASE,
    base_text: response.BASE_TEXT,
  };

  const isCrosstab =
    typeof Object.values(resolvedQuestionData.data || {})[0] === "object";

  const chartData = resolvedQuestionData.external === 1
    ? {
        external: resolvedQuestionData.external,
        Image: resolvedQuestionData.external_link,
        title: resolvedQuestionData.label,
        chartData: [],
        categories: [],
        baseText:
          typeof resolvedQuestionData.base_text === "string" &&
          resolvedQuestionData.base_text.trim()
            ? resolvedQuestionData.base_text
            : `Base: (n = ${resolvedQuestionData.base ?? 0})`,
        questionText: resolvedQuestionData.text || "",
        totalRespondents: resolvedQuestionData.base ?? 0,
      }
    : {
        external: resolvedQuestionData.external,
        title: resolvedQuestionData.label,
        chartData: isCrosstab
          ? (resolvedQuestionData._colorder || []).map((colId: string) => ({
              name: resolvedQuestionData._coloptions?.[colId] ?? colId,
              color: "var(--color-chart-series-primary)",
              data: (resolvedQuestionData._roworder || []).map((rowId: string) => {
                return resolvedQuestionData.data?.[colId]?.[rowId] ?? 0;
              }),
            }))
          : [
              {
                name: "Responses",
                color: "var(--color-chart-series-primary)",
                data: (resolvedQuestionData._roworder || []).map(
                  (rowId: string) => resolvedQuestionData.data?.[rowId] ?? 0
                ),
              },
            ],
        categories: (resolvedQuestionData._roworder || []).map(
          (rowId: string) => resolvedQuestionData._rowoptions?.[rowId]
        ),
        baseText:
          typeof resolvedQuestionData.base_text === "string" &&
          resolvedQuestionData.base_text.trim()
            ? resolvedQuestionData.base_text
            : `Base: (n = ${resolvedQuestionData.base ?? 0})`,
        questionText: resolvedQuestionData.text || "",
        totalRespondents: resolvedQuestionData.base ?? 0,
      };

  const tableData = {
    questionId: qID,
    title: resolvedQuestionData.label,
    baseText:
      typeof resolvedQuestionData.base_text === "string" &&
      resolvedQuestionData.base_text.trim()
        ? resolvedQuestionData.base_text
        : `Base: (n = ${resolvedQuestionData.base ?? 0})`,
    questionText: resolvedQuestionData.text || "",
    headers: !isCrosstab
      ? ["Total"]
      : (resolvedQuestionData._colorder || []).map(
          (colId: string) => resolvedQuestionData._coloptions?.[colId] ?? colId
        ),
    baseRow: !isCrosstab
      ? [resolvedQuestionData.base ?? 0]
      : (resolvedQuestionData._colorder || []).map((colId: string) => {
          const val =
            resolvedQuestionData.base?.[colId] ??
            resolvedQuestionData.responding_base?.[colId]?.[
              resolvedQuestionData._roworder?.[0]
            ];
          return val ?? 0;
        }),
    rows: (resolvedQuestionData._roworder || []).map((rowId: string) => {
      const rowLabel = resolvedQuestionData._rowoptions?.[rowId] || rowId;
      const values = !isCrosstab
        ? [`${resolvedQuestionData.data?.[rowId] ?? 0}%`]
        : (resolvedQuestionData._colorder || []).map(
            (colId: string) =>
              `${resolvedQuestionData.data?.[colId]?.[rowId] ?? 0}%`
          );

      return {
        rowLabel,
        values,
      };
    }),
  };

  return {
    rawData: response,
    tableData,
    chartData,
  };
};

export const useReportStudyInfo = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const studyInfoQuery = queryStructure({
    queryKey: reportKeys.studyInfo(studyID),
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
    reportStudyInfo: studyInfoQuery.data,
    isReportStudyInfoLoading: studyInfoQuery.isLoading,
    refetchReportStudyInfo: studyInfoQuery.refetch,
  };
};

export const useReportViewList = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const reportViewListQuery = queryStructure({
    queryKey: reportKeys.viewList(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportViewList.method,
        url.reportViewList.endpoint,
        {
          studyID,
          side_by_side: "0",
        }
      );

      return res.response;
    },
    enable: !!apiToken && !!studyID,
  });

  useEffect(() => {
    const sequence = reportViewListQuery.data?.[0]?.groupList?.seq ?? [];
    if (!sequence.length) return;

    dispatch(setTableQList(sequence));
    dispatch(setFliterReportData(sequence));
  }, [dispatch, reportViewListQuery.data, studyID]);

  return {
    reportViewList: reportViewListQuery.data,
    isReportViewListLoading: reportViewListQuery.isLoading,
    isReportViewListRefetching: reportViewListQuery.isRefetching,
    refetchReportViewList: reportViewListQuery.refetch,
  };
};

export const useReportViewById = (
  studyID?: string,
  qID?: string,
  selected?: string,
  sideBySide?: string
) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const normalizedSideBySide = sideBySide ?? "0";
  const subgroupID =
    normalizedSideBySide === "0" ? "Cell" : selected || "Cell";

  const reportViewByIdQuery = queryStructure({
    queryKey: reportKeys.viewById(studyID, qID, selected, normalizedSideBySide),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportViewById.method,
        url.reportViewById.endpoint.replace(":qId", qID as string),
        {
          studyID,
          filter_data: {},
          side_by_side: normalizedSideBySide,
          subgroupID,
        }
      );

      const normalizedResponse = normalizeReportViewResponse(res.response);

      return buildReportViewData(normalizedResponse);
    },
    enable: !!apiToken && !!studyID && !!qID,
    retry: 0,
  });

  return {
    reportViewByIdData: reportViewByIdQuery.data,
    isReportViewByIdLoading: reportViewByIdQuery.isLoading,
    isReportViewByIdError: reportViewByIdQuery.isError,
  };
};

export const useReportProcessList = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const processListQuery = queryStructure({
    queryKey: reportKeys.processList(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportProcessList.method,
        url.reportProcessList.endpoint,
        {
          studyID,
        }
      );

      return res.response;
    },
    enable: !!apiToken && !!studyID,
  });

  return {
    reportProcessList: processListQuery.data,
    isReportProcessListLoading: processListQuery.isLoading,
    isReportProcessListError: processListQuery.isError,
  };
};

export const useReportSideBySideVariables = (studyID?: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const sideBySideQuery = queryStructure({
    queryKey: reportKeys.sideBySideVariables(studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportSideBySideVariables.method,
        url.reportSideBySideVariables.endpoint,
        {
          studyID,
        }
      );
      return res.response;
    },
    enable: !!apiToken && !!studyID,
  });

  return {
    sideBySideVariables: sideBySideQuery.data ?? [],
    isSideBySideVariablesLoading: sideBySideQuery.isLoading,
  };
};

export const useReportAppliedFilter = (studyID?: string, refreshKey?: unknown) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const appliedFilterQuery = queryStructure({
    queryKey: reportKeys.appliedFilter(studyID, refreshKey),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportAppliedFilter.method,
        url.reportAppliedFilter.endpoint,
        {
          filter_data: {},
          studyID,
        }
      );

      return res.response;
    },
    enable: !!apiToken && !!studyID,
    retry: 0,
  });

  return {
    appliedFilterData: appliedFilterQuery.data,
    isAppliedFilterLoading: appliedFilterQuery.isLoading,
  };
};

export const useReportFiltersList = (studyID?: string, refreshKey?: unknown) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const reportFiltersListQuery = queryStructure({
    queryKey: reportKeys.filtersList(studyID, refreshKey),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportFiltersList.method,
        url.reportFiltersList.endpoint,
        {
          studyID,
          side_by_side: 0,
        }
      );

      dispatch(setFilterList(mapFilterList(res.response)));
      return res.response;
    },
    enable: !!apiToken && !!studyID,
    retry: 0,
  });

  return {
    reportFiltersList: reportFiltersListQuery.data,
    isReportFiltersListLoading: reportFiltersListQuery.isLoading,
  };
};

export const useReportFilters = (studyID?: string, refreshKey?: unknown) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const reportFiltersQuery = queryStructure({
    queryKey: reportKeys.filters(studyID, refreshKey),
    queryFn: async () => {
      const res = await apiRequest(
        url.reportFilters.method,
        url.reportFilters.endpoint,
        {
          side_by_side: 0,
          studyID,
          filter_data: {},
          subgroupID: "Cell",
        }
      );

      dispatch(setReportFilterList(mapReportFilterList(res.response)));
      return res.response;
    },
    enable: !!apiToken && !!studyID,
    retry: 0,
  });

  return {
    reportFilters: reportFiltersQuery.data,
    isReportFiltersLoading: reportFiltersQuery.isLoading,
  };
};
