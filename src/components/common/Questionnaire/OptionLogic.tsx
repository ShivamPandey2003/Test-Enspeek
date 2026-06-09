import { useState, type ChangeEvent, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { useLocation } from "react-router";
import { TbRefresh } from "react-icons/tb";
import { LuBan, LuChevronDown } from "react-icons/lu";
import Button from "../../ui/Button";
import IconActionButton from "../../ui/IconActionButton";
import Select from "../../ui/Select";
import { useUpdateOptionLogicMutation } from "../../../api-network/questionnaire/mutation";

type RowLogic = {
  row: string;
  value: string;
  terminate: boolean;
};

interface OptionLogicProps {
  qID: string;
  rowIndex: string;
  optionText: string;
}

export default function OptionLogic({
  qID,
  rowIndex,
  optionText,
}: OptionLogicProps) {
  const location = useLocation();
  const studyID = location.state?.studyID;
  const [logic, setLogic] = useState<RowLogic[]>(() => [
    { row: rowIndex, value: "", terminate: false },
  ]);
  const submitItems = useSelector(
    (state: RootState) => state.question.submitItems
  );
  const questionList = useSelector((state: RootState) => state.question.qList);
  const { mutate: updateOptionLogic } = useUpdateOptionLogicMutation(
    studyID,
    qID,
    rowIndex,
    optionText
  );

  const handleLogicChange = (idx: number, value: string) => {
    const wasSkipApplied = !!logic[idx].value?.trim();
    const isRemoving = wasSkipApplied && value === "";

    setLogic((prev) =>
      prev.map((row, rowIndexValue) =>
        rowIndexValue === idx ? { ...row, value, terminate: false } : row
      )
    );

    updateOptionLogic({
      terminate: false,
      skipTo: value,
      isRemoveSkip: isRemoving,
    });
  };

  const toggleTerminate = (idx: number) => {
    const isRemoving = logic[idx].terminate;

    setLogic((prev) =>
      prev.map((row, rowIndexValue) =>
        rowIndexValue === idx
          ? { ...row, terminate: !row.terminate, value: "" }
          : row
      )
    );

    updateOptionLogic({
      terminate: !logic[idx].terminate,
      skipTo: "",
      isRemoveTerminate: isRemoving,
    });
  };

  const handleReset = (idx: number) => {
    setLogic((prev) =>
      prev.map((row, rowIndexValue) =>
        rowIndexValue === idx ? { ...row, value: "", terminate: false } : row
      )
    );

    updateOptionLogic({ terminate: false, skipTo: "", isReset: true });
  };

  useEffect(() => {
    const question = submitItems.find((item) => item.qID === qID);
    if (!question?.rowOptionList) return;

    const row = question.rowOptionList.find((item) => item.optionID === rowIndex);
    if (!row) return;

    setLogic((prev) => {
      const apiValue = row.skip_to ?? "";
      const apiTerminate = row.terminate === 1;

      if (prev[0]?.value !== apiValue || prev[0]?.terminate !== apiTerminate) {
        return [
          {
            row: rowIndex,
            value: apiValue,
            terminate: apiTerminate,
          },
        ];
      }

      return prev;
    });
  }, [submitItems, qID, rowIndex]);

  return (
    <div className="min-w-0">
      {logic.map((row, idx) => (
        <div key={row.row} className="flex items-center">
          <div className="flex min-w-0 items-center gap-1">
            {(row.value || row.terminate) && (
              <IconActionButton
                type="button"
                tone="neutral"
                tooltip="Reset logic"
                onClick={() => handleReset(idx)}
                className="h-7 w-7 p-1"
              >
                <TbRefresh className="h-4 w-4" />
              </IconActionButton>
            )}
            <Button
              type="button"
              variant={row.terminate ? "danger" : "outline"}
              size="default"
              tooltip={row.terminate ? "Remove termination" : "Apply termination"}
              onClick={() => toggleTerminate(idx)}
              disabled={!!row.value}
              className={
                row.terminate
                  ? "questionnaire-logic-chip-danger min-h-7 rounded-full px-1.5 py-0.5 text-[11px] font-semibold"
                  : "questionnaire-logic-chip-muted min-h-7 rounded-full px-1.5 py-0.5 text-[11px] font-semibold"
              }
            >
              <LuBan className="h-4 w-4" />
              <span>
                {row.terminate ? "Terminated" : "Termination"}
              </span>
            </Button>

            <div
              title={row.value?.trim() ? "Update skip logic" : "Apply skip logic"}
              className="relative min-w-[96px]"
            >
              <Select
                variant="questionnaire"
                hideIcon
                className={`min-h-7 w-full rounded-full py-0.5 pl-2 pr-6 text-[11px] font-semibold ${
                  row.value?.trim() ? "questionnaire-logic-select-active" : ""
                } ${row.terminate ? "opacity-50 cursor-not-allowed" : ""}`}
                value={row.value}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  handleLogicChange(idx, e.target.value)
                }
                disabled={row.terminate}
              >
                <option value="">Skip to</option>
                {questionList?.map((opt) => (
                  <option key={opt.qID} value={opt.qID}>
                    SKIP TO {opt.qID}
                  </option>
                ))}
              </Select>
              <LuChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 questionnaire-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
