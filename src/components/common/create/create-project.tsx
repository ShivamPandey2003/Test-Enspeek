import type React from "react";
import { useState } from "react";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";
import { useLocation, useNavigate } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../services/apiService";
import type { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import LoaderSpinner from "../../global/LoaderSpinner";
import { setStudyInfo } from "../../../store/CrosstabStudySlice";

export default function CreationProject() {
  const { state } = useLocation();
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    panelProvider: "",
    metaDescription: "",
  });

  const [errors, setErrors] = useState({
    projectName: "",
  });

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);
  const {
    mutate: create,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      const payload = {
        studyName: formData.projectName,
        projectDescription: formData.projectDescription,
        panel: formData.panelProvider,
        meta: formData.metaDescription || "",
      };

      const res = await apiRequest("post", "study/create", payload);

      return res.response;
    },
    onSuccess: (data) => {
      const studyID = data.studyID;
      if (!studyID) {
        toast.error("Study ID not returned");
        return;
      }

      navigate("/questionnaire", {
        state: {
          studyID: data.studyID,
          studyFlags: {
            hasQuestionnaire: data.hasQuestionnaire,
            launch: data.launch,
            output: data.output,
          },
        },
      });

      toast.success("Study Created Successfully");
    },
  });


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "projectName" && value.trim() !== "") {
      setErrors((prev) => ({ ...prev, projectName: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;
    if (!formData.projectName.trim()) {
      setErrors((prev) => ({
        ...prev,
        projectName: "Project name is required.",
      }));
      hasError = true;
    }
    if (!formData.panelProvider) {
      toast.error("Please select a Panel Provider.");
      hasError = true;
    }
    if (!formData.projectDescription.trim()) {
      toast.error("Please enter the Project Description.");
      hasError = true;
    }
    if (hasError) return;
    create();
  };

  const {} = useQuery({
    queryKey: ["CateAndSpec"],
    queryFn: async () => {
      const [categories, specs] = await Promise.all([
        apiRequest("post", "/specification/getCategories", {
          survey: "CS",
        }),
        apiRequest("post", "/specification/getSpecs", {
          survey: "CS",
        }),
      ]);
      return { categories, specs };
    },
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const studyID = state?.studyID;
  const dispatch = useDispatch();
  const { data: StudyInfo, isLoading: isInfoLoading } = useQuery({
    queryKey: [studyID],
    queryFn: async () => {
      const res = await apiRequest("post", "study/info", {
        studyID: studyID,
      });
      dispatch(
        setStudyInfo({
          studyID: studyID,
          hasQuestionnaire: res.response.hasQuestionnaire,
          launch: res.response.launch,
          name: res.response.studyName,
          output: res.response.output,
          link: res.response.link,
          closed: res.response.closed
        })
      );
      return res.response;
    },
    enabled: !!user.apiToken && !!studyID,
    refetchOnWindowFocus: false,
  });

  if (isInfoLoading) {
    return <LoaderSpinner />;
  }

  return (
    <div className="w-full h-full mx-auto bg-white rounded-md">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-medium text-gray-600">
          {StudyInfo ? StudyInfo.studyName : "PROJECT CREATION"}
        </h1>
        {state?.studyID ? (
          <Button
            className="bg-primary hover:bg-primary-700 px-3 py-1 rounded text-white"
            onClick={() => {
              navigate("/questionnaire", { state: { studyID: state.studyID } });
            }}
            disabled={isPending}
          >
            {isPending ? "Next..." : "Next"}
          </Button>
        ) : (
          <Button
            className="bg-primary hover:bg-primary-700 px-3 py-1 rounded text-white"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create Project"}
          </Button>
        )}
      </div>
      <hr className="text-gray-300"></hr>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-8 mb-8">
          <div>
            <label htmlFor="projectName" className="block mb-2 font-medium">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              variant="default"
              id="projectName"
              name="projectName"
              value={StudyInfo ? StudyInfo.studyName : formData.projectName}
              onChange={handleChange}
              className={`${
                errors.projectName ? "border-[var(--color-core-danger)]" : ""
              }`}
            />
            {errors.projectName && (
              <p className="mt-1 text-sm text-[var(--color-core-danger)]">{errors.projectName}</p>
            )}
          </div>
          <div>
            <label htmlFor="panelProvider" className="block mb-2 font-medium">
              Panel Provider <span className="text-red-500">*</span>
            </label>
            <Select
              variant="default"
              id="panelProvider"
              name="panelProvider"
              value={StudyInfo ? StudyInfo.panel : formData.panelProvider}
              onChange={handleChange}
            >
              <option value="">Choose Panel</option>
              <option value="Dynata">Dynata</option>
              <option value="DISQO">DISQO</option>
              <option value="None (Multi-use Link)">None (Multi-use Link)</option>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label
              htmlFor="projectDescription"
              className="block mb-2 font-medium"
            >
              Project Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              variant="default"
              id="projectDescription"
              name="projectDescription"
              value={
                StudyInfo
                  ? StudyInfo.projectDescription
                  : formData.projectDescription
              }
              onChange={handleChange}
              className="h-32"
            />
          </div>
          <div>
            <label htmlFor="metaDescription" className="block mb-2 font-medium">
              Meta Description
            </label>
            <Textarea
              variant="default"
              id="metaDescription"
              name="metaDescription"
              value={formData.metaDescription}
              onChange={handleChange}
              className="h-32"
            />
            <p className="mt-1 text-sm theme-text-muted">
              Use comma to separate keywords.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
