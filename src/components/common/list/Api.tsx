import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { toast } from "sonner";
import { queryClient } from "../../../App";
import homepageKeys from "../../../api-network/homepage/keys";
import { setFilterStudys } from "../../../store/CrosstabStudySlice";
import {
  REFRESH_STUDY_LIST_EVENT,
  type RefreshStudyListOptions,
} from "../../../utils/studyListRefresh";
import {
  setCopyModel,
  setDeleteModel,
  setSelectedId,
  setSelectedStudyName,
} from "../../../store/TriggerSlice";

const removeStudyFromList = (items: any[], studyId: string) =>
  items.filter((prev) => (prev.studyid ?? prev.studyID) !== studyId);

const refreshStudyList = async (options?: RefreshStudyListOptions) => {
  await new Promise<void>((resolve) => {
    window.dispatchEvent(
      new CustomEvent(REFRESH_STUDY_LIST_EVENT, {
        detail: {
          ...options,
          resolve,
        },
      })
    );
  });
  await queryClient.invalidateQueries({
    queryKey: homepageKeys.all,
    exact: false,
  });
  await queryClient.refetchQueries({
    queryKey: homepageKeys.all,
    exact: false,
    type: "active",
  });
};

export const useArchive = (onArchived?: () => void) => {
  const { FilterStudys } = useSelector((state: RootState) => state.study);
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: Archived, isPending } = useMutation({
    mutationFn: async (selectedStudies: string) => {
      return await apiRequest("post", "study/archive", {
        study_list: [selectedStudies],
      });
    },
    onMutate(variables) {
      const newData = removeStudyFromList(FilterStudys, variables);
      dispatch(setFilterStudys(newData));
    },
    onSuccess: async () => {
      await refreshStudyList();
      onArchived?.();
      toast.success("Study archived successfully");
    },
  });

  return { Archived, isPending };
};

export const useDelete = () => {
  const { FilterStudys } = useSelector((state: RootState) => state.study);
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: Delete, isPending } = useMutation({
    mutationKey: ["studyDelete"],
    mutationFn: async (selectedStudies: string) => {
      const res = await apiRequest("post", "study/delete", {
        study_list: [selectedStudies],
      });
      if (!res) {
        return null;
      }
      return res;
    },
    onMutate(variables) {
      const newData = removeStudyFromList(FilterStudys, variables);
      dispatch(setFilterStudys(newData));
    },
    onSuccess: async (data) => {
      if (!data) {
        return;
      }
      await refreshStudyList({
        selection: "myactive",
        resetSearch: true,
      });
      dispatch(setSelectedId(""));
      dispatch(setSelectedStudyName(""));
      dispatch(setDeleteModel(false));
      toast.success("Study deleted successfully");
    },
  });

  return { Delete, isPending };
};

export const useCopy = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: Copy, isPending } = useMutation({
    mutationKey: ["CopyStudy"],
    mutationFn: async ({
      studyId,
      studyName,
    }: {
      studyId: string;
      studyName: string;
    }) => {
      const res = await apiRequest("post", "study/replicate", {
        studyID: studyId,
        studyName: studyName,
      });
      if (!res) {
        return null;
      }
      return res.response;
    },
    onSuccess: async (data) => {
      if (!data) {
        return;
      }
      await refreshStudyList({
        selection: "myactive",
        resetSearch: true,
      });
      dispatch(setCopyModel(false));
      toast.success("Study copied successfully");
    },
  });
  return { Copy, isPending };
};

export const useActive = (onActivated?: () => void) => {
  const { FilterStudys } = useSelector((state: RootState) => state.study);
  const dispatch = useDispatch<AppDispatch>();
  const { mutate: Active, isPending } = useMutation({
    mutationKey: ["activeProject"],
    mutationFn: async (selectedStudies: string) => {
      return await apiRequest("post", "study/activate", {
        study_list: [selectedStudies],
      });
    },
    onMutate: (variables) => {
      const newData = removeStudyFromList(FilterStudys, variables);
      dispatch(setFilterStudys(newData));
    },
    onSuccess: async () => {
      await refreshStudyList({
        selection: "myactive",
        resetSearch: true,
      });
      onActivated?.();
      toast.success("Study activated successfully");
    },
  });

  return { Active, isPending };
};

export const useFieldReport = () => {
  const {
    mutate: fetchFieldReport,
    data,
  } = useMutation({
    mutationKey: ["fieldReport"],
    mutationFn: async (studyId: string) => {
      const res = await apiRequest("post", "crosstab/freport", {
        studyID: studyId,
      });
      return res.response;
    },
  });

  return { fetchFieldReport, data };
};
