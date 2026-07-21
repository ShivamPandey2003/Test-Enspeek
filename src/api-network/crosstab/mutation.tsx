import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import type { AppDispatch, RootState } from "../../store/store";
import { apiRequest } from "../../services/apiService";
import { queryClient } from "../../App";
import mutationStructure from "../mutation-template";
import url from "../url";
import crosstabKeys from "./keys";
import { setOptsData } from "../../store/CrossTabDataSlice";
import { setSelectedQuestions } from "../../store/CrosstabSlice";

interface CustomHooks {
  studyID?: string;
  cb?: ({ studyID, pid }: { studyID?: string; pid?: string }) => void;
}

export const useAddBanner = ({ studyID, cb = () => {} }: CustomHooks) => {
  const navigate = useNavigate();

  const mutation = mutationStructure({
    mutationKey: [url.crosstabBannerAdd.mutationKey, studyID],
    mutationFn: async ({
      title,
      description,
      logic,
      count,
      percent,
    }: AddBannerPayload) => {
      const res = await apiRequest(
        url.crosstabBannerAdd.method,
        url.crosstabBannerAdd.endpoint,
        {
          studyID,
          title,
          description,
          logic,
          count,
          percent,
        }
      );
      return res.response;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: crosstabKeys.bannerList(studyID),
      });
      toast.success("Banner added successfully");
      cb({});
      navigate("/crosstab/edit-banner", {
        state: { studyID, bannerID: data.bannerID },
      });
    },
  });

  return {
    addBannerMutation: mutation.mutate,
    addBannerData: mutation.data,
    isAddBannerPending: mutation.isPending,
  };
};

export const useEditBanner = ({ studyID, cb = () => {} }: CustomHooks) => {
  const mutation = mutationStructure({
    mutationKey: [url.crosstabBannerEdit.mutationKey, studyID],
    mutationFn: async ({
      bannerID,
      title,
      description,
      logic,
      count,
      percent,
      statGroup,
    }: EditBannerPayload) => {
      const res = await apiRequest(
        url.crosstabBannerEdit.method,
        url.crosstabBannerEdit.endpoint,
        {
          studyID,
          bannerID,
          title,
          description,
          logic,
          count,
          percent,
          statGroup,
        }
      );
      return res.response;
    },
    onSuccess: () => {
      cb({});
    },
  });

  return {
    editBannerMutation: mutation.mutate,
    editBannerData: mutation.data,
    isEditBannerPending: mutation.isPending,
  };
};

export const useDeleteBanner = ({ studyID, cb = () => {} }: CustomHooks) => {
  const mutation = mutationStructure({
    mutationKey: [url.crosstabBannerDelete.mutationKey, studyID],
    mutationFn: async (bannerID: string) => {
      const res = await apiRequest(
        url.crosstabBannerDelete.method,
        url.crosstabBannerDelete.endpoint,
        {
          studyID,
          bannerID,
        }
      );
      return res.response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: crosstabKeys.bannerList(studyID),
      });
      await queryClient.refetchQueries({
        queryKey: crosstabKeys.bannerList(studyID),
        type: "active",
      });
      toast.success("Banner delete successfully");
      cb({});
    },
  });

  return {
    deleteBannerMutation: mutation.mutate,
    deletebannerData: mutation.data,
    isDeleteBannerPending: mutation.isPending,
  };
};

export const useReplicateBanner = ({ studyID, cb = () => {} }: CustomHooks) => {
  const mutation = mutationStructure({
    mutationKey: [url.crosstabBannerCopy.mutationKey, studyID],
    mutationFn: async ({
      bannerID,
      title,
    }: {
      bannerID: string;
      title: string;
    }) => {
      const res = await apiRequest(
        url.crosstabBannerCopy.method,
        url.crosstabBannerCopy.endpoint,
        {
          studyID,
          bannerID,
          title,
        }
      );
      return res.response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: crosstabKeys.bannerList(studyID),
      });
      await queryClient.refetchQueries({
        queryKey: crosstabKeys.bannerList(studyID),
        type: "active",
      });
      toast.success("Banner copied successfully");
      cb({});
    },
  });

  return {
    replicateBannerMutate: mutation.mutate,
    isRelicateBannerPending: mutation.isPending,
    replicateBannerData: mutation.data,
  };
};

export const useTableListAdd = (bannerID: string, studyID: string) => {
  const { selectedQuestions } = useSelector((state: RootState) => state.crosstab);
  const dispatch = useDispatch<AppDispatch>();

  const mutation = mutationStructure({
    mutationKey: [url.crosstabTableAdd.mutationKey, bannerID, studyID],
    mutationFn: async (questionIds?: string[]) => {
      const res = await apiRequest(
        url.crosstabTableAdd.method,
        url.crosstabTableAdd.endpoint,
        {
          studyID,
          bannerID,
          quest_info: questionIds ?? selectedQuestions,
        }
      );
      return res.response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: crosstabKeys.tableList(bannerID, studyID),
      });
      await queryClient.refetchQueries({
        queryKey: crosstabKeys.tableList(bannerID, studyID),
        type: "active",
      });
      dispatch(setSelectedQuestions([]));
      toast.success("Questions added successfully");
    },
  });

  return {
    tableListAddMutate: mutation.mutate,
    tableListAddData: mutation.data,
    isTableListAddPending: mutation.isPending,
  };
};

export const useLogicOpts = (studyID: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const mutation = mutationStructure({
    mutationKey: [url.crosstabLogicOptions.mutationKey, studyID],
    mutationFn: async (qID: string) => {
      const res = await apiRequest(
        url.crosstabLogicOptions.method,
        url.crosstabLogicOptions.endpoint,
        {
          studyID,
          qID,
        }
      );
      return res.response;
    },
    onSuccess: (data, variable) => {
      dispatch(setOptsData({ key: variable, data }));
    },
  });

  return {
    logicOptsMutate: mutation.mutate,
    logicOptsData: mutation.data,
    isLogicOptsPending: mutation.isPending,
  };
};

export const useQuesLogicOpts = (studyID: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const mutation = mutationStructure({
    mutationKey: [url.questionLogicOptions.mutationKey, studyID],
    mutationFn: async (qID: string) => {
      const res = await apiRequest(
        url.questionLogicOptions.method,
        url.questionLogicOptions.endpoint,
        {
          studyID,
          qID,
        }
      );
      return res.response;
    },
    onSuccess: (data, variable) => {
      dispatch(setOptsData({ key: variable, data }));
    },
  });

  return {
    quesLogicOptsMutate: mutation.mutate,
    quesLogicOptsData: mutation.data,
    isQuesLogicOptsPending: mutation.isPending,
  };
};

export const useAddBannerPointer = (studyID: string = "CS_FWypI6XEdjwl9U") => {
  const navigate = useNavigate();

  const mutation = mutationStructure({
    mutationKey: [url.crosstabBannerPointAdd.mutationKey, studyID],
    mutationFn: async ({
      bannerID,
      allSegment,
    }: {
      bannerID: string;
      allSegment: pointerSegment[];
    }) => {
      const res = await apiRequest(
        url.crosstabBannerPointAdd.method,
        url.crosstabBannerPointAdd.endpoint,
        {
          studyID,
          bannerID,
          allSegment,
        }
      );
      return res.response;
    },
    onSuccess: async (_, variable) => {
      await queryClient.invalidateQueries({
        queryKey: crosstabKeys.bannerPointerList(variable.bannerID, studyID),
      });
      navigate("/crosstab/table-list", {
        state: { bannerID: variable.bannerID, studyID },
      });
    },
  });

  return {
    addBannerPointerMutate: mutation.mutate,
    isAddBannerPointerPending: mutation.isPending,
  };
};
