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

const INITIAL_LOGIC: RowLogic[] = [
  { row: "row1", value: "", terminate: false },
];

export default function OptionLogic({
  qID,
  rowIndex,
  optionText,
}: OptionLogicProps) {
  const location = useLocation();
  const studyID = location.state?.studyID;
  const [logic, setLogic] = useState<RowLogic[]>(INITIAL_LOGIC);
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
            row: `row${rowIndex + 1}`,
            value: apiValue,
            terminate: apiTerminate,
          },
        ];
      }

      return prev;
    });
  }, [submitItems, qID, rowIndex]);

  return (
    <div>
      {logic.map((row, idx) => (
        <div key={row.row} className="flex items-center">
          <div className="flex flex-wrap items-center gap-3">
            {(row.value || row.terminate) && (
              <IconActionButton
                type="button"
                tone="neutral"
                tooltip="Reset logic"
                onClick={() => handleReset(idx)}
              >
                <TbRefresh className="h-4 w-4" />
              </IconActionButton>
            )}
            <Button
              type="button"
              varinat={row.terminate ? "danger" : "outline"}
              size="sm"
              tooltip={row.terminate ? "Remove termination" : "Apply termination"}
              onClick={() => toggleTerminate(idx)}
              disabled={!!row.value}
              className={
                row.terminate
                  ? "questionnaire-logic-chip-danger"
                  : "questionnaire-logic-chip-muted"
              }
            >
              <LuBan className="h-4 w-4" />
              <span>
                {row.terminate ? "Termination Applied" : "Apply Termination"}
              </span>
            </Button>

            <div
              title={row.value?.trim() ? "Update skip logic" : "Apply skip logic"}
              className="relative min-w-[144px]"
            >
              <Select
                variant="questionnaire"
                className={`w-full rounded-full py-2 pl-3 pr-9 text-sm font-semibold ${
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
