import { useDispatch, useSelector } from "react-redux";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import type { AppDispatch, RootState } from "../../../store/store";
import { apiRequest } from "../../../services/apiService";
import url from "../../url";
import crosstabKeys from "../keys";
import { setTableData } from "../../../store/CrossTabDataSlice";

export const useTableList = (bannerID: string, studyID: string) => {
  const { apiToken } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();

  const { data: tableListData, error: tableListError, isPending } = useQuery({
    queryKey: crosstabKeys.tableList(bannerID, studyID),
    queryFn: async () => {
      const res = await apiRequest(
        url.crosstabTableList.method,
        url.crosstabTableList.endpoint,
        {
          studyID,
          bannerID,
        }
      );

      dispatch(setTableData(Array.isArray(res.response) ? res.response : []));
      return res.response;
    },
    enabled: !!apiToken && !!bannerID && !!studyID,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  return { tableListData, tableListError, isPending };
};

export const useTableOutput = (
  tableID: string,
  bannerID: string,
  studyID: string
) => {
  const {
    data: tableOutputData,
    refetch: TableOutputData,
    isRefetching: isTableOutputRefetching,
  } = useSuspenseQuery({
    queryKey: crosstabKeys.tableOutput(bannerID, tableID, studyID),
    queryFn: async () => {
      const endpoint = url.crosstabTableOutput.endpoint
        .replace(":bannerId", bannerID)
        .replace(":tableId", tableID);
      const res = await apiRequest(
        url.crosstabTableOutput.method,
        endpoint,
        {
          studyID,
        }
      );
      return res.response;
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  return { tableOutputData, TableOutputData, isTableOutputRefetching };
};

export const useTableOutputEditRows = (
  bannerID: string,
  tableID: string,
  studyID: string,
  enabled: boolean
) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const {
    data: tableOutputEditRowsData,
    isPending: isTableOutputEditRowsPending,
  } = useQuery({
    queryKey: crosstabKeys.tableOutputEditRows(bannerID, tableID, studyID),
    queryFn: async () => {
      const endpoint = url.crosstabTableOutput.endpoint
        .replace(":bannerId", bannerID)
        .replace(":tableId", tableID);
      const res = await apiRequest(
        url.crosstabTableOutput.method,
        endpoint,
        {
          studyID,
        }
      );
      return res.response;
    },
    enabled: enabled && !!apiToken && !!bannerID && !!tableID && !!studyID,
    retry: 0,
    refetchOnWindowFocus: false,
  });

  return { tableOutputEditRowsData, isTableOutputEditRowsPending };
};

export const useOpList = (
  tableID: string,
  qID: string,
  bannerID: string,
  studyID: string
) => {
  const { apiToken } = useSelector((state: RootState) => state.user);

  const { data: opListData, isPending: isOpListPending } = useQuery({
    queryKey: crosstabKeys.opList(tableID, qID, bannerID, studyID),
    queryFn: async () => {
      const endpoint = url.crosstabTableOptionList.endpoint
        .replace(":tableId", tableID)
        .replace(":qId", qID);
      const res = await apiRequest(
        url.crosstabTableOptionList.method,
        endpoint,
        {
          studyID,
          bannerID,
        }
      );
      return res.response;
    },
    enabled: !!apiToken && !!tableID && !!qID && !!bannerID && !!studyID,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { opListData, isOpListPending };
};
