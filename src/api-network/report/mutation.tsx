import { useSelector } from "react-redux";
import { toast } from "sonner";
import type { RootState } from "../../store/store";
import mutationStructure from "../mutation-template";
import { apiRequest } from "../../services/apiService";
import url from "../url";
import { queryClient } from "../../App";
import reportKeys from "./keys";

interface ReportDownloadHookProps {
  studyID: string;
  cb: ({ studyID, pid }: { studyID: string; pid: string }) => void;
}

const refreshReportProcessList = async (studyID?: string) => {
  if (!studyID) return;

  await queryClient.invalidateQueries({
    queryKey: reportKeys.processList(studyID),
  });
  await queryClient.refetchQueries({
    queryKey: reportKeys.processList(studyID),
    type: "active",
  });
};

const triggerBlobDownload = (blobData: BlobPart, contentDisposition?: string) => {
  let filename = "Test_works_EXCEL_1771585829.xlsx";

  if (contentDisposition?.includes("filename=")) {
    filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
  }

  const blob = new Blob([blobData]);
  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = blobUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(blobUrl);

  return blob;
};

export const useReportExcelDownload = ({ studyID, cb }: ReportDownloadHookProps) => {
  const mutation = mutationStructure({
    mutationKey: [url.reportExportExcel.mutationKey, studyID],
    mutationFn: async () => {
      const res = await apiRequest(
        url.reportExportExcel.method,
        url.reportExportExcel.endpoint,
        {
          studyID,
        }
      );
      return res.response;
    },
    onSuccess: async (pid: string) => {
      await refreshReportProcessList(studyID);
      cb({ studyID, pid });
    },
  });

  return {
    downloadExcel: mutation.mutate,
    downloadExcelData: mutation.data,
    isDownloadExcelPending: mutation.isPending,
  };
};

export const useReportProcessDownload = (cb?: () => void) => {
  const mutation = mutationStructure({
    mutationKey: [url.reportProcess.mutationKey],
    mutationFn: async ({ studyID, pid }: { studyID: string; pid: string }) => {
      const res = await apiRequest(
        url.reportProcess.method,
        url.reportProcess.endpoint,
        {
          studyID,
          pid,
        },
        "blob"
      );

      return triggerBlobDownload(
        res.response,
        res.headers["content-disposition"]
      );
    },
    onMutate: () => {
      toast.info("File is preparing for download");
    },
    onSuccess: () => {
      cb?.();
    },
  });

  return {
    processDownload: mutation.mutate,
    isProcessPending: mutation.isPending,
  };
};

export const useReportSpssDownload = ({ studyID, cb }: ReportDownloadHookProps) => {
  const mutation = mutationStructure({
    mutationKey: [url.reportExportSpss.mutationKey, studyID],
    mutationFn: async () => {
      const res = await apiRequest(
        url.reportExportSpss.method,
        url.reportExportSpss.endpoint,
        {
          studyID,
        }
      );
      return res.response;
    },
    onSuccess: async (data: { pid: string }) => {
      await refreshReportProcessList(studyID);
      cb({ studyID, pid: data.pid });
    },
  });

  return {
    downloadSpss: mutation.mutate,
    isDownloadSpssPending: mutation.isPending,
  };
};

export const useReportClearHistory = ({
  studyID,
  cb,
}: {
  studyID?: string;
  cb: () => void;
}) => {
  const mutation = mutationStructure({
    mutationKey: [url.reportProcessClear.mutationKey, studyID],
    mutationFn: async () => {
      const res = await apiRequest(
        url.reportProcessClear.method,
        url.reportProcessClear.endpoint,
        {
          studyID,
        }
      );
      return res.response;
    },
    onSuccess: async () => {
      await refreshReportProcessList(studyID);
      cb();
    },
  });

  return {
    clearHistory: mutation.mutate,
    isClearHistoryPending: mutation.isPending,
  };
};

export const useReportTableDownload = ({ studyID, cb }: ReportDownloadHookProps) => {
  const { tableQList } = useSelector((state: RootState) => state.filter);

  const mutation = mutationStructure<any, Error, string | void>({
    mutationKey: [url.reportTableReadyAll.mutationKey, studyID],
    mutationFn: async (qID: string | void) => {
      const qidList = qID ? [qID] : tableQList;

      const res = await apiRequest(
        url.reportTableReadyAll.method,
        url.reportTableReadyAll.endpoint,
        {
          studyID,
          filter_data: {},
          side_by_side: 0,
          subgroupID: "Cell",
          qidList,
          qlabel: "",
        }
      );
      return res.response;
    },
    onSuccess: async (data: { pid: string }) => {
      await refreshReportProcessList(studyID);
      cb({ studyID, pid: data.pid });
    },
  });

  return {
    downloadTable: mutation.mutate,
    downloadTableData: mutation.data,
    isDownloadTablePending: mutation.isPending,
  };
};

export const useReportPptDownload = ({ studyID, cb }: ReportDownloadHookProps) => {
  const { tableQList, selected } = useSelector((state: RootState) => state.filter);

  const mutation = mutationStructure<any, Error, string | void>({
    mutationKey: [url.reportReadyAll.mutationKey, studyID],
    mutationFn: async (qID: string | void) => {
      const qidList = qID ? [qID.toLowerCase()] : tableQList.map((questionId: string) => questionId.toLowerCase());

      const res = await apiRequest(
        url.reportReadyAll.method,
        url.reportReadyAll.endpoint,
        {
          studyID,
          filter_data: {},
          side_by_side: 0,
          subgroupID: selected,
          qidList,
        }
      );

      return res.response;
    },
    onSuccess: async (data: { pid: string }) => {
      await refreshReportProcessList(studyID);
      cb({ studyID, pid: data.pid });
    },
  });

  return {
    downloadPpt: mutation.mutate,
    isDownloadPptPending: mutation.isPending,
  };
};

export const useReportIncludeFiltersMutation = (
  studyID?: string,
  onSuccess?: () => void
) => {
  const mutation = mutationStructure({
    mutationKey: [url.reportFiltersInclude.mutationKey, studyID],
    mutationFn: async (selectedFilters: string[]) => {
      const res = await apiRequest(
        url.reportFiltersInclude.method,
        url.reportFiltersInclude.endpoint,
        {
          "question-list": selectedFilters,
          studyID,
        }
      );

      return res.response;
    },
    onSuccess: () => {
      onSuccess?.();
    },
  });

  return {
    includeReportFilters: mutation.mutate,
    isIncludeReportFiltersPending: mutation.isPending,
  };
};
