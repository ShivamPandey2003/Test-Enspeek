import DynamicModel from "../../global/DynamicModel";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  useEditBanner,
  useTableListAdd,
} from "../../../api-network/crosstab/mutation";
import { useQList } from "../../../api-network/crosstab/query";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import BannerLogic from "../../global/BannerLogic";
import { useLocation } from "react-router";
import { setSelectedQuestions } from "../../../store/CrosstabSlice";
import { toast } from "sonner";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Checkbox from "../../ui/Checkbox";
import { LuPanelsTopLeft, LuSave } from "react-icons/lu";
import { modalDefinitions } from "../../../config/modalDefinitions";

export default function BannerSettings({
  Id,
  isOpen,
  onClose,
}: BannerSettingsModalProps) {
  if (!isOpen) return null;
  const definition = modalDefinitions.bannerSettings;
  const [bannerLogic, setBannerLogic] = useState<{ pointLogic: string }[]>([]);
  const { BannersAll, BannerPointer, tableData } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const { selectedQuestions } = useSelector(
    (state: RootState) => state.crosstab
  );
  const dispatch = useDispatch<AppDispatch>();
  const { state } = useLocation();
  const [value, setValue] = useState<Banner>({
    bannerid: "",
    title: "",
    description: "",
    bannerList_logic: "",
    active: 0,
    seq: 0,
    statGroup: "",
    statLevel: "",
    tb_enabled: 0,
    userID: "",
    count: 0,
    percent: 0,
    default: 0,
    tableID_list: [],
  });

  useEffect(() => {
    dispatch(setSelectedQuestions(tableData.map((table) => table.qID)));
    setValue(BannersAll.find((pre) => pre.bannerid === Id) as Banner);
  }, []);

  const { QListData, isQListDataPending } = useQList(state.studyID, Id);
  const { editBannerMutation, isEditBannerPending } = useEditBanner({
    studyID: state.studyID,
    cb: () => onClose(),
  });
  const { tableListAddMutate, isTableListAddPending } = useTableListAdd(
    value.bannerid,
    state.studyID
  );
  const isSaving = isEditBannerPending || isTableListAddPending;

  const isAllSelected =
    !isQListDataPending && selectedQuestions.length === QListData.length;

  const toggleAll = () => {
    dispatch(
      setSelectedQuestions(
        isAllSelected ? [] : QListData.map((q: any) => q.qID)
      )
    );
  };

  const toggleQuestion = (question: string) => {
    dispatch(
      setSelectedQuestions(
        selectedQuestions.includes(question)
          ? selectedQuestions.filter((q) => q !== question)
          : [...selectedQuestions, question]
      )
    );
  };

  const handleClick = () => {
    if (!selectedQuestions.length) {
      toast.warning("Pelease select Atlest one question");
      return;
    }

    if (value) {
      tableListAddMutate(undefined);
      editBannerMutation({
        ...value,
        bannerID: value.bannerid,
        logic: bannerLogic,
      });
    }
  };

  return (
    <DynamicModel
      Title={`${definition.title}: ${value.title}`}
      headerIcon={
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
          <LuPanelsTopLeft className="h-5 w-5" />
        </span>
      }
      ButtonText={isSaving ? definition.submittingLabel! : definition.submitLabel!}
      buttonIcon={
        isSaving ? (
          <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
        ) : (
          <LuSave className="h-4 w-4" />
        )
      }
      buttonVariant="success"
      isOpen={isOpen}
      onClose={onClose}
      onClick={handleClick}
      disable={isSaving}
      secondaryAction={
        <Button
          type="button"
          varinat="cancel"
          className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
          onClick={onClose}
          disabled={isSaving}
        >
          {definition.cancelLabel}
        </Button>
      }
      className="max-w-4xl"
      >
      <div className="space-y-4">
        <div>
          <label className="questionnaire-label text-sm font-semibold text-[var(--color-text-strong)]">
            Banner Name
          </label>
          <Input
            variant="crosstab"
            className="mt-2"
            data-test-id="BANNER_NAME"
            placeholder="Enter label"
            value={value.title}
            onChange={(e) =>
              setValue((prev) => prev && { ...prev, title: e.target.value })
            }
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="questionnaire-label text-sm font-semibold text-[var(--color-text-strong)]">
              Banner Description
            </label>
            <Input
              variant="crosstab"
              className="mt-2"
              data-test-id="BANNER_DESCRIPTION"
              placeholder="Enter Description"
              value={value.description}
              onChange={(e) =>
                setValue(
                  (prev) => prev && { ...prev, description: e.target.value }
                )
              }
            />
          </div>
          <div>
            <label className="questionnaire-label text-sm font-semibold text-[var(--color-text-strong)]">
              Stat Testing
            </label>
            <Input
              variant="crosstab"
              className="mt-2"
              placeholder="eg. AB,C-F"
              onChange={() => {}}
            />
          </div>
        </div>
        <div>
          <label className="crosstab-title mb-2 block text-sm font-semibold">Select View Type</label>
          <div className="flex items-center gap-4">
            <label className="home-text inline-flex items-center">
              <Checkbox
                checked={Boolean(value.percent)}
                onChange={(e) =>
                  setValue((prev) => ({
                    ...prev,
                    percent: e.target.checked ? 1 : 0,
                  }))
                }
              />
              <span className="ml-2">Percentage</span>
            </label>
          </div>
        </div>
        <div>
          <label className="crosstab-title mb-2 block text-sm font-semibold">
            Overall Banner Filter (optional)
          </label>
          <BannerLogic setLogicFunc={setBannerLogic} />
        </div>
        <div className="crosstab-surface p-4">
          <label className="crosstab-title mb-2 block text-sm font-semibold">Banner Preview</label>
          <div className="flex">
            {BannerPointer.map((info) => (
              <div
                key={info.pointID}
                className="crosstab-soft-panel crosstab-title w-full px-3 py-2 text-sm"
              >
                {info.title}
              </div>
            ))}
          </div>
        </div>
        <div className="crosstab-surface p-4">
          <h3 className="crosstab-title mb-3 text-base font-semibold">Question list</h3>
          <div>
            <div
              className="theme-selection-border rounded-lg border mb-2 flex cursor-pointer items-center px-4 py-3"
              role="button"
              tabIndex={0}
              onClick={toggleAll}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleAll();
                }
              }}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  className="mr-3"
                  checked={isAllSelected}
                  onChange={toggleAll}
                />
              </div>
              <span className="crosstab-title font-medium">Select All Questions</span>
            </div>

            {isQListDataPending ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              QListData.map((question: any, idx: number) => (
                <div
                  key={idx}
                  className="theme-selection-border rounded-lg border mb-2 flex cursor-pointer items-center px-4 py-3 last:mb-0"
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleQuestion(question.qID)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      toggleQuestion(question.qID);
                    }
                  }}
                >
                  <div onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      data-test-id={`Q_${idx}`}
                      className="mr-3"
                      checked={selectedQuestions.includes(question.qID)}
                      onChange={() => toggleQuestion(question.qID)}
                    />
                  </div>
                  <span className="home-text">{question.qLabel}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DynamicModel>
  );
}
