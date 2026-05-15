import { toast } from "sonner";
import { apiRequest } from "../../../services/apiService";
import { queryClient } from "../../../App";
import mutationStructure from "../../mutation-template";
import url from "../../url";
import reportKeys from "../../report/keys";
import crosstabKeys from "../keys";

interface CustomHooks {
  studyID?: string;
  cb?: ({ studyID, pid }: { studyID?: string; pid?: string }) => void;
}

export const useAddCustomTable = (studyID: string) => {
  const mutation = mutationStructure({
    mutationKey: [url.crosstabCustomTableAdd.mutationKey, studyID],
    mutationFn: async (payload: AddCustomTablePayload) => {
      const res = await apiRequest(
        url.crosstabCustomTableAdd.method,
        url.crosstabCustomTableAdd.endpoint,
        {
          studyID,
          ...payload,
        }
      );
      return res.response;
    },
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: crosstabKeys.tableList(variables.bannerID, studyID),
      });
      toast.success("Custom Table Added Successfully");
    },
  });

  return {
    addCustomTableMutate: mutation.mutate,
    isAddCustomTablePending: mutation.isPending,
  };
};

export const useEditTableListQuestion = ({
  qId,
  studyID,
  cb,
}: {
  qId: string;
  studyID?: string;
  cb?: () => void;
}) => {
  const mutation = mutationStructure({
    mutationKey: [url.crosstabTableEditByQuestionId.mutationKey, qId, studyID],
    mutationFn: async (data: EditTableListQuestionPayload) => {
      const res = await apiRequest(
        url.crosstabTableEditByQuestionId.method,
        url.crosstabTableEditByQuestionId.endpoint.replace(":qId", qId),
        {
          studyID,
          ...data,
        }
      );
      return res.response;
    },
    onSuccess: async (_, variables) => {
      await queryClient.refetchQueries({
        queryKey: crosstabKeys.tableList(variables.bannerID, studyID),
        type: "active",
      });
      await queryClient.refetchQueries({
        queryKey: crosstabKeys.tableOutput(
          variables.bannerID,
          variables.tableID,
          studyID
        ),
        type: "active",
      });
      cb?.();
    },
  });

  return {
    editTableListQuestionMutate: mutation.mutate,
    isEditTableListQuestionPending: mutation.isPending,
  };
};

export const useDownloadtable = ({ studyID, cb }: CustomHooks) => {
  const mutation = mutationStructure({
    mutationKey: [url.crosstabTableDownload.mutationKey, studyID],
    mutationFn: async ({
      bannerID,
      tableID,
    }: {
      bannerID: string;
      tableID: string[];
    }) => {
      const res = await apiRequest(
        url.crosstabTableDownload.method,
        url.crosstabTableDownload.endpoint,
        {
          studyID,
          bannerID,
          tableID,
        }
      );
      return res.response;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: reportKeys.processList(studyID),
      });
      toast.info(
        "Please wait. Your file is being prepared for download, kindly visit download history"
      );
      cb?.({ studyID, pid: data?.pid });
    },
  });

  return {
    downloadTableMutate: mutation.mutate,
    isdownloadTablePending: mutation.isPending,
  };
};
