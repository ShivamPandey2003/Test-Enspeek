import React from "react";
import DynamicModel from "../../global/DynamicModel";
import QuestionCard from "../Report/QuestionCard";
import SingleSelectChart from "../Report/Charts";
import TableForm from "../Report/TableForm";
import ModalInstruction from "../../ui/ModalInstruction";
import { PRIMARY_CHART_COLOR } from "../../../utils/chartColors";
import { modalDefinitions } from "../../../config/modalDefinitions";

const TableAndChartModal: React.FC<TableAndChartModalProps> = ({
  isOpen,
  onClose,
  message,
  type,
}) => {
  const definition =
    type === "chart"
      ? modalDefinitions.fullChartView
      : modalDefinitions.fullTableView;
  const qid = message?.sdata?.seq?.[0];
  const questionData = {
    ...message?.sdata?.[qid],
    base: message?.sdata?.BASE,
    base_text: message?.sdata?.BASE_TEXT,
  };

  if (!qid || !questionData) return null;

  const isCrosstab =
    typeof Object.values(questionData.data || {})[0] === "object";

  const chartData = isCrosstab
    ? questionData._colorder.map((colId: any) => ({
        name: questionData._coloptions?.[colId] ?? colId,
        color: PRIMARY_CHART_COLOR,
        data: questionData._roworder.map((rowId: any) => ({
          name: questionData._rowoptions?.[rowId],
          y: questionData.data?.[colId]?.[rowId] ?? 0,
        })),
      }))
    : [
        {
          name: "Responses",
          color: PRIMARY_CHART_COLOR,
          data: questionData._roworder.map((rowId: any) => ({
            name: questionData._rowoptions?.[rowId],
            y: questionData.data?.[rowId] ?? 0,
          })),
        },
      ];

  const categories = questionData._roworder?.map(
    (rowId: any) => questionData._rowoptions?.[rowId]
  );

  const headers = !isCrosstab
    ? ["Total"]
    : (questionData._colorder || []).map(
        (colId: string) => questionData._coloptions?.[colId] ?? colId
      );

  const rows = (questionData._roworder || []).map((rowId: string) => {
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
  });

  const baseRow = !isCrosstab
    ? [questionData.base ?? 0]
    : (questionData._colorder || []).map((colId: string) => {
        const val =
          questionData.base?.[colId] ??
          questionData.responding_base?.[colId]?.[
            questionData._roworder?.[0]
          ];
        return val ?? 0;
      });

  const baseText = (() => {
    if (
      typeof questionData.base_text === "string" &&
      questionData.base_text.trim()
    ) {
      return questionData.base_text;
    }
    if (typeof questionData.base === "number") {
      return `Base: (n = ${questionData.base})`;
    }
    if (typeof questionData.base === "object" && questionData.base !== null) {
      const total = Object.values(questionData.base).reduce(
        (acc: number, val: any) =>
          acc + (typeof val === "number" ? val : 0),
        0
      );
      return `Base: (n = ${total})`;
    }
    return "Base: (n = 0)";
  })();

  return (
    <DynamicModel
      className="max-w-5xl"
      isOpen={isOpen}
      onClose={onClose}
      Title={definition.title}
      ButtonText={definition.submitLabel!}
      onClick={onClose}
    >
      <ModalInstruction>
        Review the expanded {type === "chart" ? "chart" : "table"} view for this report question.
      </ModalInstruction>
      {type === "chart" ? (
        <QuestionCard title={questionData.label} qId={qid}>
           {questionData.external === 1 && questionData.external_link ? (
            <div className="w-full flex justify-center">
              <img
                src={questionData.external_link}
                alt={questionData.label}
                className="w-full max-w-2xl"
              />
            </div>
          ):(
          <SingleSelectChart
            hasData={!!questionData.data}
            chartData={chartData}
            categories={categories}
            baseText={baseText}
            questionText={questionData.text || ""}
            totalRespondents={questionData.base ?? 1}
            questionId={qid}
          />
          )}
        </QuestionCard>
      ) : (
        <TableForm
          questionId={qid}
          title={questionData.label}
          baseText={baseText}
          questionText={questionData.text || ""}
          headers={headers}
          baseRow={baseRow}
          rows={rows}
        />
      )}
    </DynamicModel>
  );
};

export default TableAndChartModal;
