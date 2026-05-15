import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { type FC } from "react";
import TableForm from "./TableForm";
import QuestionCard from "./QuestionCard";
import SingleSelectChart from "./Charts";
import { useLocation } from "react-router";
import { useReportViewById } from "../../../api-network/report/query";

interface TableAndCardScreenProp {
  qid: string;
  showTableView: boolean;
}

const TableAndCardScreen: FC<TableAndCardScreenProp> = ({
  qid,
  showTableView,
}) => {
  const { selected, side_by_side } = useSelector(
    (state: RootState) => state.filter
  );
  const { state } = useLocation();
  const {
    reportViewByIdData,
    isReportViewByIdLoading,
    isReportViewByIdError,
  } = useReportViewById(state.studyID, qid, selected, side_by_side);

  const rawData = reportViewByIdData?.rawData;
  const rawQuestionId = rawData?.seq?.[0];
  const questionData = rawQuestionId
    ? {
        ...rawData?.[rawQuestionId],
        base: rawData?.BASE,
        base_text: rawData?.BASE_TEXT,
      }
    : null;

  if (isReportViewByIdLoading) {
    return (
      <QuestionCard title="" qId={qid}>
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-action animate-spin rounded-full" />
        </div>
      </QuestionCard>
    );
  }

  if (isReportViewByIdError || !rawQuestionId || !questionData) return null;

  const isCrosstab =
    typeof Object.values(questionData.data || {})[0] === "object";

  const chartData = isCrosstab
    ? (questionData._colorder || []).map((colId: string) => ({
        name: questionData._coloptions?.[colId] ?? colId,
        color: "#3F72AF",
        data: (questionData._roworder || []).map(
          (rowId: string) => questionData.data?.[colId]?.[rowId] ?? 0
        ),
      }))
    : [
        {
          name: "Responses",
          color: "#3F72AF",
          data: (questionData._roworder || []).map(
            (rowId: string) => questionData.data?.[rowId] ?? 0
          ),
        },
      ];

  const categories = (questionData._roworder || []).map(
    (rowId: string) => questionData._rowoptions?.[rowId]
  );

  const baseText =
    typeof questionData.base_text === "string" && questionData.base_text.trim()
      ? questionData.base_text
      : `Base: (n = ${questionData.base ?? 0})`;

  const tableData = {
    questionId: rawQuestionId,
    title: questionData.label,
    baseText,
    questionText: questionData.text || "",
    headers: !isCrosstab
      ? ["Total"]
      : (questionData._colorder || []).map(
          (colId: string) => questionData._coloptions?.[colId] ?? colId
        ),
    baseRow: !isCrosstab
      ? [questionData.base ?? 0]
      : (questionData._colorder || []).map((colId: string) => {
          const val =
            questionData.base?.[colId] ??
            questionData.responding_base?.[colId]?.[
              questionData._roworder?.[0]
            ];
          return val ?? 0;
        }),
    rows: (questionData._roworder || []).map((rowId: string) => {
      const rowLabel = questionData._rowoptions?.[rowId] || rowId;
      const values = !isCrosstab
        ? [`${questionData.data?.[rowId] ?? 0}%`]
        : (questionData._colorder || []).map(
            (colId: string) => `${questionData.data?.[colId]?.[rowId] ?? 0}%`
          );

      return {
        rowLabel,
        values,
      };
    }),
  };

  if (questionData.external === 1 && questionData.external_link) {
    return (
      <QuestionCard title={questionData.label} qId={qid}>
        <img
          src={questionData.external_link}
          alt=""
          className="mx-auto max-h-[300px]"
        />
      </QuestionCard>
    );
  }

  if (showTableView) {
    return <TableForm {...tableData} />;
  }

  return (
    <QuestionCard title={questionData.label} qId={qid}>
      <SingleSelectChart
        categories={categories}
        questionId={qid}
        hasData={!!questionData.data}
        chartData={chartData}
        baseText={baseText}
        questionText={questionData.text || ""}
        totalRespondents={questionData.base ?? 0}
      />
    </QuestionCard>
  );
};

export default TableAndCardScreen;
