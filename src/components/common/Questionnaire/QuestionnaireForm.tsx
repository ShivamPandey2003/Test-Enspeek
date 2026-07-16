import React from "react";
import { useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { LuCheck, LuChevronDown, LuCirclePlus, LuGripVertical, LuSave, LuX } from "react-icons/lu";
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
  const editFieldInputClass =
    "questionnaire-heading min-h-8 border-b border-[var(--color-questionnaire-border)] px-1.5 py-0 text-[14px] focus-visible:border-[var(--color-questionnaire-border)] focus-visible:ring-0";

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
    <div className="home-surface z-50 mb-2 w-full p-2 md:p-3">
      <div className="w-full">
        <div className="questionnaire-card questionnaire-card-edit questionnaire-edit-frame overflow-hidden rounded-[22px]">
          <div className="questionnaire-border border-b px-2.5 py-1.5 md:px-3">
            <div
              className={cn(
                "flex min-h-8 items-center justify-between gap-2",
                data ? "flex-nowrap" : "flex-wrap lg:flex-nowrap"
              )}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="questionnaire-muted hidden md:inline-flex">
                  <LuGripVertical className="h-4 w-4" />
                </span>
                <div className="flex min-w-0 items-center gap-1">
                  <span className="questionnaire-heading shrink-0 text-[14px] font-semibold leading-tight">
                    {data?.qID || `CQ${id || ""}`}
                    {data ? ":" : ""}
                  </span>
                  <h2 className="questionnaire-heading min-w-0 truncate text-[14px] font-semibold leading-tight md:text-[15px]">
                    {data
                      ? displayEditLabel || qtext || data?.qText || "Question"
                      : qtext || label || "Question"}
                  </h2>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center justify-end gap-1.5",
                  data ? "w-auto flex-nowrap" : "w-full flex-wrap lg:w-auto"
                )}
              >
                {data ? (
                  <>
                    <Button
                      type="button"
                      variant="success"
                      size="default"
                      onClick={handleUpdate}
                      disabled={isSaving}
                      className="hidden md:inline-flex"
                    >
                      {isSaving ? (
                        <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                      ) : null}
                      Save
                    </Button>
                    <Button
                      type="button"
                      variant="cancel"
                      size="default"
                      onClick={closeForm}
                      disabled={isSaving}
                      className="hidden border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50 md:inline-flex"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="success"
                      size="icon"
                      aria-label="Save question"
                      tooltip="Save question"
                      onClick={handleUpdate}
                      disabled={isSaving}
                      className="h-8 w-8 rounded-full p-0 md:hidden"
                    >
                      {isSaving ? (
                        <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                      ) : (
                        <LuCheck className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      aria-label="Cancel question editing"
                      tooltip="Cancel editing"
                      onClick={closeForm}
                      disabled={isSaving}
                      className="h-8 w-8 rounded-full border-gray-300 p-0 text-[var(--color-text-muted)] shadow-none hover:bg-gray-50 md:hidden"
                    >
                      <LuX className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="success"
                      size="default"
                      className="capitalize"
                      onClick={handleCreate}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                      ) : (
                        <LuSave className="h-3.5 w-3.5" />
                      )}
                      Submit
                    </Button>
                    <Button
                      type="button"
                      variant="cancel"
                      size="default"
                      className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
                      onClick={closeForm}
                      disabled={isSaving}
                    >
                      Close
                    </Button>
                    <Button
                      type="button"
                      aria-label="Close new question"
                      variant="secondary"
                      size="icon"
                      tooltip="Collapse"
                      className="questionnaire-muted shadow-none"
                      onClick={closeForm}
                    >
                      <LuChevronDown className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="px-3 py-3 pr-2 md:px-4 md:pr-3">
            {!data && (
              <div className="mb-4 grid gap-3 md:grid-cols-[1fr_2fr_1fr]">
                <div className="w-full">
                  <label className="questionnaire-label mb-1.5 block text-sm leading-tight">
                    QID <span className="text-[var(--color-core-danger)]">*</span>
                  </label>
                  <Input
                    variant="questionnaire"
                    className={cn(
                      errors.id
                        ? "border-[var(--color-core-danger)] pr-10"
                        : ""
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
                  <label className="questionnaire-label mb-1.5 block text-sm leading-tight">
                    Question label <span className="text-[var(--color-core-danger)]">*</span>
                  </label>
                  <Input
                    variant="questionnaire"
                    className={cn(
                      errors.label
                        ? "border-[var(--color-core-danger)] pr-10"
                        : ""
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
                  <label htmlFor="qType" className="questionnaire-label mb-1.5 text-sm font-medium leading-tight">
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

            <div className="mb-3.5 w-full">
              <label className="questionnaire-label mb-1.5 block text-sm leading-tight">
                Question Text <span className="text-[var(--color-core-danger)]">*</span>
              </label>
              <Input
                variant="bare"
                className={cn(
                  editFieldInputClass,
                  errors.qtext
                    ? "border-[var(--color-core-danger)] pr-10"
                    : ""
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
            <div className="mb-3.5 w-full">
              <label className="questionnaire-label mb-1.5 block text-sm leading-tight">
                Question Text 2 (Optional)
              </label>
              <Input
                variant="bare"
                className={editFieldInputClass}
                value={qtext2}
                onChange={(e) => setQtext2(e.target.value)}
                placeholder="Additional context..."
              />
            </div>
            <div className="mb-3.5">
              <label className="questionnaire-label mb-1.5 block text-sm leading-tight">
                Respondent Instruction
              </label>
              <Input
                variant="bare"
                className={editFieldInputClass}
                value={qInstruction}
                onChange={(e) => setQinstruction(e.target.value)}
                placeholder={
                  isSelectableType === "stop" ? "Stop the research" : "(Please select one.)"
                }
              />
            </div>
            {isSelectableType === "stop" && (
              <div className="mb-3 flex flex-col gap-2.5 md:flex-row md:items-center md:gap-4">
                <label className="questionnaire-label">Select stop condition</label>
                <Select variant="questionnaire" className="max-w-[220px]">
                  <option>Terminated</option>
                  <option>Completed</option>
                </Select>
              </div>
            )}
            {show && (
              <>
                <div className="mb-4 flex flex-wrap items-center gap-2.5 lg:gap-3">
                  <div className="flex min-w-0 flex-nowrap items-center gap-2">
                    <span className="questionnaire-label whitespace-nowrap text-sm font-medium leading-none">
                      Add options:
                    </span>
                    <Input
                      variant="bare"
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
                      className={cn(editFieldInputClass, "h-8 w-[60px] text-center text-sm")}
                    />
                    <Button
                      variant="theme"
                      size="default"
                      onClick={createOption}
                      disabled={isSaving}
                    >
                      <LuCirclePlus className="h-4 w-4" />
                      Create
                    </Button>
                  </div>
                  {isSelectableType === "multiple-select" && (
                    <div className="flex w-full flex-wrap items-end gap-2.5 md:ml-auto md:w-auto md:justify-end">
                      <div className="w-[calc(50%-0.3125rem)] min-w-0 md:w-32">
                        <label className="questionnaire-label mb-1.5 block text-sm leading-tight">
                          Min Selection
                        </label>
                        <Input
                          variant="bare"
                          className={editFieldInputClass}
                          type="number"
                          min={1}
                          value={minSelection}
                          onChange={(e) => checkMin(Number(e.target.value))}
                          placeholder="Minimum"
                        />
                      </div>
                      <div className="w-[calc(50%-0.3125rem)] min-w-0 md:w-32">
                        <label className="questionnaire-label mb-1.5 block text-sm leading-tight">
                          Max Selection
                        </label>
                        <Input
                          variant="bare"
                          className={editFieldInputClass}
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

                <div className="mt-3">
                  <h3 className="questionnaire-label mb-2 text-sm font-medium leading-tight">
                    Answer Options
                  </h3>
                  <div className="space-y-1">
                    {options.map((option, index) => (
                      <RowOptions
                        key={option.optionID ?? index}
                        optionKey={`${index + 1}`}
                        Value={option.optionText}
                        onChange={(e) => optionsValueChange(index, e)}
                        onDelete={() => deleteRow(index)}
                        select={option.other}
                        onSelect={(val) => updateSpecify(index, val)}
                        error={optionErrors[index]}
                        qID={data?.qID}
                        optionID={option.optionID}
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
