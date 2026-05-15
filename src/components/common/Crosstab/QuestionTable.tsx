import { useDispatch, useSelector } from "react-redux";
import { useQList } from "../../../api-network/crosstab/query";
import type { AppDispatch, RootState } from "../../../store/store";
import { setSelectedQuestions } from "../../../store/CrosstabSlice";
import { useLocation } from "react-router";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "../../../utils";
import Checkbox from "../../ui/Checkbox";

export default function QuestionsList() {
  const { state } = useLocation();
  const { QListData, isQListDataPending } = useQList(
    state.studyID,
    state.BannerID
  );
  const { selectedQuestions } = useSelector(
    (state: RootState) => state.crosstab
  );
  const dispatch = useDispatch<AppDispatch>();
  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      dispatch(setSelectedQuestions(QListData.map((q: any) => q.qID)));
    } else {
      dispatch(setSelectedQuestions([]));
    }
  };

  const toggleSelect = (id: string) => {
    dispatch(
      setSelectedQuestions(
        selectedQuestions.includes(id)
          ? selectedQuestions.filter((i) => i !== id)
          : [...selectedQuestions, id]
      )
    );
  };

  if (isQListDataPending) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <AiOutlineLoading3Quarters
          size={34}
          className={cn("animate-spin text-action")}
        />
      </div>
    );
  }
  const allSelected = selectedQuestions.length === QListData.length;

  return (
    <div>
      <p className="crosstab-title mb-3 text-base font-semibold">
        Please add questions to table list
      </p>
      <div className="crosstab-surface px-3 py-3">
        <div
          className="border border-[var(--color-text-strong)]/25 flex cursor-pointer items-center px-4 py-3 font-semibold mb-2 rounded-lg"
          role="button"
          tabIndex={0}
          onClick={() => toggleSelectAll(!allSelected)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleSelectAll(!allSelected);
            }
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Checkbox
              data-test-id="CHECKBOX"
              checked={allSelected}
              onChange={(e) => toggleSelectAll(e.target.checked)}
            />
          </div>
          <div className="crosstab-title ml-4">Select All Questions</div>
        </div>

        {QListData.map((question: any, i: number) => (
          <div
            key={i}
            className="border border-[var(--color-text-strong)]/25 mb-2 flex cursor-pointer items-center px-4 py-3 rounded-lg"
            role="button"
            tabIndex={0}
            onClick={() => toggleSelect(question.qID)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleSelect(question.qID);
              }
            }}
          >
            <div className="mr-8" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedQuestions.includes(question.qID)}
                onChange={() => toggleSelect(question.qID)}
              />
            </div>
            <div className="home-text">{question.qLabel}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
