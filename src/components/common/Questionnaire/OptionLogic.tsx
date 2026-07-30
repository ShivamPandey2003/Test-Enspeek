import { useState, type ChangeEvent, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useLocation } from "react-router";
import { LuBan, LuChevronDown, LuEllipsisVertical, LuGitBranch, LuRotateCcw, LuTrash2 } from "react-icons/lu";
import Select from "../../ui/Select";
import { useUpdateOptionLogicMutation } from "../../../api-network/questionnaire/mutation";
import NewDropdown from "../../global/NewDropDown";

type RowLogic = {
  value: string;
  terminate: boolean;
};

interface OptionLogicProps {
  qID: string;
  rowIndex: string;
  optionText: string;
  onDelete: () => void;
  deleteDisabled?: boolean;
}

export default function OptionLogic({
  qID,
  rowIndex,
  optionText,
  onDelete,
  deleteDisabled = false,
}: OptionLogicProps) {
  const location = useLocation();
  const studyID = location.state?.studyID;
  const [logic, setLogic] = useState<RowLogic>({
    value: "",
    terminate: false,
  });
  const submitItems = useSelector(
    (state: RootState) => state.question.submitItems
  );
  const questionList = useSelector((state: RootState) => state.question.qList);
  const { mutate: updateOptionLogic, isPending } = useUpdateOptionLogicMutation(
    studyID,
    qID,
    rowIndex,
    optionText
  );
  const hasLogicApplied = Boolean(logic.value?.trim() || logic.terminate);

  const handleLogicChange = (value: string) => {
    const wasSkipApplied = !!logic.value?.trim();
    const isRemoving = wasSkipApplied && value === "";

    setLogic({
      value,
      terminate: false,
    });

    updateOptionLogic({
      terminate: false,
      skipTo: value,
      isRemoveSkip: isRemoving,
    });
  };

  const toggleTerminate = () => {
    const isRemoving = logic.terminate;

    setLogic((current) => ({
      ...current,
      terminate: !current.terminate,
      value: "",
    }));

    updateOptionLogic({
      terminate: !logic.terminate,
      skipTo: "",
      isRemoveTerminate: isRemoving,
    });
  };

  const resetLogic = () => {
    setLogic({
      value: "",
      terminate: false,
    });

    updateOptionLogic({
      terminate: false,
      skipTo: "",
      isReset: true,
    });
  };

  console.log(questionList)

  useEffect(() => {
    const question = submitItems.find((item) => item.qID === qID);
    if (!question?.rowOptionList) return;

    const row = question.rowOptionList?.find((item) => item.optionID === rowIndex);
    if (!row) return;

    setLogic((current) => {
      const apiValue = row.skip_to ?? "";
      const apiTerminate = row.terminate === 1;

      if (current.value !== apiValue || current.terminate !== apiTerminate) {
        return {
          value: apiValue,
          terminate: apiTerminate,
        };
      }

      return current;
    });
  }, [submitItems, qID, rowIndex]);

  return (
    <div className="min-w-0">
        <div className="flex items-center gap-1">
          {hasLogicApplied ? (
            <span
              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary md:hidden"
              title="Logic applied"
              role="img"
              aria-label="Logic applied"
            >
              <LuGitBranch className="h-4 w-4" />
            </span>
          ) : null}
          <div className="hidden items-center gap-1 md:flex">
            {hasLogicApplied ? (
              <button
                type="button"
                onClick={resetLogic}
                disabled={isPending}
                className="questionnaire-muted inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-brand-primary-softest)] hover:text-login-primary disabled:cursor-not-allowed disabled:opacity-50"
                title="Reset logic"
                aria-label="Reset logic"
              >
                <LuRotateCcw className="h-3.5 w-3.5" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={toggleTerminate}
              disabled={!!logic.value || isPending}
              className={`inline-flex h-7 items-center gap-1.5 rounded-full px-2 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                logic.terminate
                  ? "border border-red-200 bg-red-50 text-red-500"
                  : "questionnaire-muted hover:bg-[var(--color-brand-primary-softest)] hover:text-login-primary"
              }`}
              title="Termination"
              aria-label="Termination"
            >
              <LuBan className="h-3.5 w-3.5" />
              <span>{logic.terminate ? "Terminated" : "Termination"}</span>
            </button>
            <div className="relative">
              <Select
                variant="questionnaire"
                hideIcon
                aria-label="Skip to question"
                className={`min-h-7 w-28 rounded-full py-1 pl-2 pr-7 text-xs font-semibold ${
                  logic.value?.trim() ? "questionnaire-logic-select-active" : ""
                } ${logic.terminate ? "cursor-not-allowed opacity-50" : ""}`}
                value={logic.value}
                onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                  handleLogicChange(event.target.value);
                }}
                disabled={logic.terminate || isPending}
                title="Skip to question"
              >
                <option value="">Skip to</option>
                {questionList?.filter((_, i)=> i> questionList.findIndex((pre:any)=> pre.qID === qID))?.map((option) => (
                  <option key={option.qID} value={option.qID}>
                    SKIP TO {option.qID}
                  </option>
                ))}
              </Select>
              <LuChevronDown className="questionnaire-muted pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
            </div>
            <button
              type="button"
              onClick={onDelete}
              disabled={deleteDisabled || isPending}
              className="inline-flex h-7 items-center gap-1.5 rounded-full px-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              title="Delete option"
              aria-label="Delete option"
            >
              <LuTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <NewDropdown
            className="md:hidden"
            position="bottom-right"
            searchable={false}
            trigger={
              <button
                type="button"
                aria-label="Answer option actions"
                title="Answer option actions"
                className="questionnaire-muted inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-brand-primary-softest)] hover:text-login-primary"
              >
                <LuEllipsisVertical className="h-5 w-5" />
              </button>
            }
            renderContent={({ close }) => (
              <div className="space-y-1">
                {hasLogicApplied ? (
                  <button
                    type="button"
                    onClick={() => {
                      resetLogic();
                      close();
                    }}
                    disabled={isPending}
                    className="home-dropdown-item flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="home-dropdown-icon-wrap flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      <LuRotateCcw className="h-3.5 w-3.5" />
                    </span>
                    <span>Reset Logic</span>
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    toggleTerminate();
                    close();
                  }}
                  disabled={!!logic.value || isPending}
                  className="home-dropdown-item flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="home-dropdown-icon-wrap flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    <LuBan className="h-3.5 w-3.5" />
                  </span>
                  <span>{logic.terminate ? "Remove Termination" : "Termination"}</span>
                </button>
                <div className="px-2.5 py-1.5">
                  <div className="relative">
                    <Select
                      variant="questionnaire"
                      hideIcon
                      aria-label="Skip to question"
                      className={`min-h-8 w-full rounded-xl py-1 pl-2 pr-7 text-xs font-semibold ${
                        logic.value?.trim() ? "questionnaire-logic-select-active" : ""
                      } ${logic.terminate ? "cursor-not-allowed opacity-50" : ""}`}
                      value={logic.value}
                      onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                        handleLogicChange(event.target.value);
                        close();
                      }}
                      disabled={logic.terminate || isPending}
                    >
                      <option value="">Skip to</option>
                      {questionList?.map((option) => (
                        <option key={option.qID} value={option.qID}>
                          SKIP TO {option.qID}
                        </option>
                      ))}
                    </Select>
                    <LuChevronDown className="questionnaire-muted pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    onDelete();
                  }}
                  disabled={deleteDisabled || isPending}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-50">
                    <LuTrash2 className="h-3.5 w-3.5" />
                  </span>
                  <span>Delete Option</span>
                </button>
              </div>
            )}
          />
        </div>
    </div>
  );
}
