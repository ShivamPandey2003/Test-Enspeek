import React from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { LuChevronDown, LuGripVertical, LuSave } from "react-icons/lu";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import RowOptions from "./RowOptions";
import { createNullQuestionObject } from "../../../utils/payloadBuilder";
import type { AppDispatch, RootState } from "../../../store/store";
import { cn } from "../../../utils";
import { setQType } from "../../../store/TriggerSlice";
import { setChatOpen } from "../../../store/ChatSlice";
import { setEditingQuestion } from "../../../store/QuestionSlice";
import { useQuestionnaireRI } from "../../../api-network/questionnaire/query";
import {
  useCreateQuestionMutation,
  useEditQuestionMutation,
} from "../../../api-network/questionnaire/mutation";

interface QuestionnaireFormProps {
  onClose: () => void;
}

const QuestionnaireForm: React.FC<QuestionnaireFormProps> = ({ onClose }) => {
  const location = useLocation();
  const studyID = location.state?.studyID;
  const dispatch = useDispatch<AppDispatch>();
  const { qType, qTypeList } = useSelector((state: RootState) => state.trigger);
  const { editingQuestion: data } = useSelector(
    (state: RootState) => state.question
  );

  const [id, setId] = React.useState<string>(data?.qID ? data.qID : "");
  const [maxSelection, setMaxSelection] = React.useState<number>(1);
  const [minSelection, setMinSelection] = React.useState<number>(1);
  const [label, setLabel] = React.useState<string>(data?.qLabel ?? "");
  const [qtext, setQtext] = React.useState<string>(data?.qText ?? "");
  const [qtext2, setQtext2] = React.useState<string>(data?.qText2 ?? "");
  const [qInstruction, setQinstruction] = React.useState<string>(
    data?.qNote3 ?? ""
  );
  const [optionCount, setOptionCount] = React.useState<number>(0);
  const [options, setOptions] = React.useState<Option[]>(
    data?.rowOptionList ?? []
  );
  const [errors, setErrors] = React.useState({
    id: false,
    label: false,
    qtext: false,
  });
  const [optionErrors, setOptionErrors] = React.useState<boolean[]>([]);

  useQuestionnaireRI(studyID);

  const displayEditLabel =
    data?.qLabel?.replace(/^[A-Za-z0-9_-]+\s*:\s*/, "").trim() || data?.qLabel;
  const isSelectableType = data?.qType ? data.qType : qType;
  const show =
    isSelectableType !== "open-end-medium" &&
    isSelectableType !== "text-only" &&
    isSelectableType !== "stop";

  const { mutate: createQuestion, isPending: isCreatePending } =
    useCreateQuestionMutation(studyID);
  const { mutate: editQuestion, isPending: isEditPending } =
    useEditQuestionMutation(studyID);
  const isSaving = data ? isEditPending : isCreatePending;

  const closeForm = () => {
    dispatch(setEditingQuestion(null));
    onClose();
  };

  const createOption = () => {
    if (options.length + optionCount > 50) {
      toast.error("You can only add up to 50 options.");
      return;
    }

    setOptions((prev) => {
      const newOptions = [...prev];
      for (let i = 1; i <= optionCount; i += 1) {
        newOptions.push({
          exclusive: 0,
          optionCode: i,
          optionID: `CQ${id}-r${i + options.length}`,
          optionLogic: "",
          optionNote: "",
          optionText: "",
          optionTextSpanish: "",
          optionType: qType
            ? (qType as "single-select" | "multiple-select")
            : (data?.qType as "single-select" | "multiple-select"),
          other: false,
          skip_to: "",
          terminate: 0,
        });
      }
      setMaxSelection(newOptions.length);
      return newOptions;
    });
    setOptionCount(0);
  };

  const optionsValueChange = (index: number, value: string) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, optionText: value } : opt))
    );
  };

  const updateSpecify = (index: number, value: boolean) => {
    setOptions((prev) =>
      prev.map((opt, i) => (i === index ? { ...opt, other: value } : opt))
    );
  };

  const deleteRow = (spot: number) => {
    setOptions((prev) => {
      const updated = prev.filter((_, index) => index !== spot);
      setMaxSelection(updated.length);
      return updated;
    });
  };

  const checkMin = (value: number) => {
    if (value > maxSelection) {
      setMinSelection(1);
      toast.warning("min is always small than Max value");
      return;
    }
    setMinSelection(value);
  };

  const checkMax = (value: number) => {
    if (value > options.length) {
      setMaxSelection(options.length);
      toast.warning("max is always small than Options counts");
      return;
    }
    setMaxSelection(value);
  };

  const validateForm = () => {
    const hasMainError =
      (!data && id.trim() === "") || (!data && label.trim() === "") || qtext.trim() === "";

    setErrors({
      id: !data && id.trim() === "",
      label: !data && label.trim() === "",
      qtext: qtext.trim() === "",
    });

    if (show) {
      if (options.length < 1) {
        toast.error("At least one option is required.");
        return false;
      }

      const emptyTexts = options.map((opt) => opt.optionText.trim() === "");
      const hasEmpty = emptyTexts.includes(true);
      setOptionErrors(emptyTexts);

      if (hasEmpty) {
        toast.error("Option text is required.");
        return false;
      }
    }

    return !hasMainError;
  };

  const handleCreate = () => {
    if (!validateForm()) return;

    const payload = createNullQuestionObject(
      studyID,
      `CQ${id}`,
      qType,
      qtext,
      label,
      qtext2,
      options,
      minSelection,
      maxSelection
    );

    createQuestion(payload, {
      onSuccess: () => {
        dispatch(setChatOpen(true));
        closeForm();
      },
    });
  };

  const handleUpdate = () => {
    if (!data || !validateForm()) return;

    const updatedQuestion: Question = {
      ...data,
      qText: qtext,
      qText2: qtext2,
      rowOptionList: options,
    };

    editQuestion(updatedQuestion, {
      onSuccess: () => {
        dispatch(setChatOpen(true));
        closeForm();
      },
    });
  };

  return (
    <div className="questionnaire-page-bg z-50 mb-4 w-full p-2 md:p-6">
      <div className="w-full">
        <div className="questionnaire-card questionnaire-card-edit questionnaire-edit-frame overflow-hidden rounded-[26px]">
          <div className="border-b questionnaire-border px-4 py-4 md:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4 lg:flex-nowrap">
              <div className="flex min-w-0 items-center gap-3">
                <span className="questionnaire-muted hidden md:inline-flex">
                  <LuGripVertical className="h-5 w-5" />
                </span>
                <span className="question-type-default rounded-full px-4 py-1.5 text-sm font-semibold">
                  {data?.qID || `CQ${id || ""}`}
                </span>
                <div className="min-w-0">
                  <h2 className="questionnaire-heading truncate text-lg font-semibold md:text-[22px]">
                    {data
                      ? displayEditLabel || qtext || data?.qText || "Question"
                      : qtext || label || "Question"}
                  </h2>
                </div>
              </div>

              <div className="flex w-full flex-wrap items-center justify-end gap-3 lg:w-auto">
                <Button
                  varinat="success"
                  className="capitalize"
                  onClick={data ? handleUpdate : handleCreate}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                      <span>
                        Saving
                        <span className="copying-dots ml-0.5 inline-flex w-[1.5em] justify-start">
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </span>
                      </span>
                    </>
                  ) : (
                    <>
                      <LuSave className="h-4 w-4" />
                      {data ? "Save" : "Submit"}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  varinat="cancel"
                  className="border-gray-300 px-5 text-[var(--color-text-strong)] hover:bg-gray-50"
                  onClick={closeForm}
                  disabled={isSaving}
                >
                  Close
                </Button>
                <Button
                  type="button"
                  aria-label="Close edit question"
                  varinat="secondary"
                  size="icon"
                  tooltip="Collapse"
                  className="questionnaire-muted shadow-none"
                  onClick={closeForm}
                >
                  <LuChevronDown className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 pr-2 md:px-6 md:pr-3">
            {!data && (
              <div className="mb-6 grid gap-4 md:grid-cols-[1fr_2fr_1fr]">
                <div className="w-full">
                  <label className="questionnaire-label mb-3 block text-[15px]">
                    QID <span className="text-[var(--color-core-danger)]">*</span>
                  </label>
                  <Input
                    variant="questionnaire"
                    className={cn(
                      errors.id
                        ? "border-[var(--color-core-danger)] pr-10"
                        : "questionnaire-border border"
                    )}
                    value={id}
                    onChange={(e) => {
                      setId(e.target.value);
                      if (errors.id && e.target.value.trim() !== "") {
                        setErrors((prev) => ({ ...prev, id: false }));
                      }
                    }}
                    min={0}
                    placeholder="Enter QID"
                  />
                </div>

                <div className="w-full">
                  <label className="questionnaire-label mb-3 block text-[15px]">
                    Question label <span className="text-[var(--color-core-danger)]">*</span>
                  </label>
                  <Input
                    variant="questionnaire"
                    className={cn(
                      errors.label
                        ? "border-[var(--color-core-danger)] pr-10"
                        : "questionnaire-border border"
                    )}
                    value={label}
                    onChange={(e) => {
                      setLabel(e.target.value);
                      if (errors.label && e.target.value.trim() !== "") {
                        setErrors((prev) => ({ ...prev, label: false }));
                      }
                    }}
                    placeholder="Enter question label ..."
                  />
                </div>
                <div className="flex w-full flex-col">
                  <label htmlFor="qType" className="questionnaire-label mb-2 text-sm font-medium">
                    Question Type
                  </label>
                  <Select
                    variant="questionnaire"
                    id="qType"
                    value={qType}
                    onChange={(e) => dispatch(setQType(e.target.value))}
                  >
                    {qTypeList
                      .filter((item) => item.code !== "stop")
                      .map((item) => (
                        <option key={item.code} value={item.code}>
                          {item.show}
                        </option>
                      ))}
                  </Select>
                </div>
              </div>
            )}

            <div className="mb-5 w-full">
              <label className="questionnaire-label mb-3 block text-[15px]">
                Question Text <span className="text-[var(--color-core-danger)]">*</span>
              </label>
              <Input
                variant="questionnaire"
                className={cn(
                  errors.qtext
                    ? "border-[var(--color-core-danger)] pr-10"
                    : "questionnaire-border border"
                )}
                value={qtext}
                onChange={(e) => {
                  setQtext(e.target.value);
                  if (errors.qtext && e.target.value.trim() !== "") {
                    setErrors((prev) => ({ ...prev, qtext: false }));
                  }
                }}
                placeholder="Enter your question"
              />
            </div>
            <div className="mb-5 w-full">
              <label className="questionnaire-label mb-3 block text-[15px]">
                Question Text 2 (Optional)
              </label>
              <Input
                variant="questionnaire"
                className="questionnaire-border border"
                value={qtext2}
                onChange={(e) => setQtext2(e.target.value)}
                placeholder="Additional context..."
              />
            </div>
            <div className="mb-5">
              <label className="questionnaire-label mb-3 block text-[15px]">
                Respondent Instruction
              </label>
              <Input
                variant="questionnaire"
                className="questionnaire-border border"
                value={qInstruction}
                onChange={(e) => setQinstruction(e.target.value)}
                placeholder={
                  isSelectableType === "stop" ? "Stop the survey" : "(Please select one.)"
                }
              />
            </div>
            {isSelectableType === "stop" && (
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
                <label className="questionnaire-label">Select stop condition</label>
                <Select variant="questionnaire" className="max-w-[220px] py-2">
                  <option>Terminated</option>
                  <option>Completed</option>
                </Select>
              </div>
            )}
            {show && (
              <>
                <div className="mb-5 flex flex-wrap items-end gap-3 lg:gap-4">
                  <div className="flex flex-wrap items-end gap-3">
                    <span className="questionnaire-label pb-3 text-base font-medium">
                      Add options:
                    </span>
                    <Input
                      variant="questionnaire"
                      type="number"
                      min={0}
                      max={50}
                      value={optionCount || options.length}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val > 50 - options.length) {
                          toast.error("You can add maximum 50 options.");
                          setOptionCount(50 - options.length);
                        } else {
                          setOptionCount(val);
                        }
                      }}
                      placeholder="0"
                      className="h-[46px] w-[82px] rounded-lg border px-4 text-center text-base"
                    />
                    <Button
                      varinat="theme"
                      size="default"
                      onClick={createOption}
                      disabled={isSaving}
                    >
                      Create
                    </Button>
                  </div>
                  {isSelectableType === "multiple-select" && (
                    <div className="flex flex-wrap items-end gap-3">
                      <div className="w-full md:w-32">
                        <label className="questionnaire-label mb-3 block text-[15px]">
                          Min Selection
                        </label>
                        <Input
                          variant="questionnaire"
                          className="questionnaire-border border"
                          type="number"
                          min={1}
                          value={minSelection}
                          onChange={(e) => checkMin(Number(e.target.value))}
                          placeholder="Minimum"
                        />
                      </div>
                      <div className="w-full md:w-32">
                        <label className="questionnaire-label mb-3 block text-[15px]">
                          Max Selection
                        </label>
                        <Input
                          variant="questionnaire"
                          className="questionnaire-border border"
                          type="number"
                          min={1}
                          value={maxSelection}
                          onChange={(e) => checkMax(Number(e.target.value))}
                          placeholder="Maximum"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="questionnaire-label mb-3 text-base font-medium">
                    Answer Options
                  </h3>
                  <div className="space-y-3">
                    {options.map((option, index) => (
                      <RowOptions
                        key={index}
                        optionKey={`${index + 1}`}
                        Value={option.optionText}
                        onChange={(e) => optionsValueChange(index, e)}
                        onDelete={() => deleteRow(index)}
                        select={option.other}
                        onSelect={(val) => updateSpecify(index, val)}
                        error={optionErrors[index]}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionnaireForm;
