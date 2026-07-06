import { PRIMARY_CHART_COLOR } from "../../../../utils/chartColors";
import type { ChatMessage, SurveyView } from "../types";
import { toArray, toChartNumber, toDisplayText, toRecord } from "./valueCoercion";

/**
 * Pure parser for a `surveydata` chat message. Returns the fully-derived
 * chart/table view model, or `null` when the message has no renderable survey.
 *
 * The logic is a faithful, behaviour-preserving extraction of the inline IIFE
 * that previously lived in ChatWindow's render loop.
 */
export const buildSurveyView = (msg: ChatMessage): SurveyView | null => {
  // `sdata` is a dynamic API payload; keep it loosely typed to preserve the
  // exact runtime behaviour of the original (untyped) render logic.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sdata = msg.sdata as any;
  if (!sdata || !Array.isArray(sdata.seq) || sdata.seq.length === 0) {
    return null;
  }

  const qid = sdata.seq[0];
  const questionData = {
    ...sdata[qid],
    base: sdata.BASE,
    base_text: sdata.BASE_TEXT,
  };
  if (!qid || !questionData) return null;

  const dataValues = toRecord(questionData.data);
  const firstDataValue = Object.values(dataValues)[0];
  const rawRowOptions = toRecord(
    questionData._rowoptions ?? questionData._rows
  );
  const rawColOptions = toRecord(
    questionData._coloptions ?? questionData._cols
  );
  const rawColOrder = toArray<string>(
    questionData._colorder ?? questionData._col_order
  );
  const colOrder =
    rawColOrder.length > 0 ? rawColOrder : Object.keys(dataValues);
  const rawRowOrder = toArray<string>(
    questionData._roworder ?? questionData._row_order
  );
  const firstColumnData = toRecord(firstDataValue);
  const rowOrder =
    rawRowOrder.length > 0
      ? rawRowOrder
      : Object.keys(
          firstColumnData && Object.keys(firstColumnData).length > 0
            ? firstColumnData
            : dataValues
        );

  const isCrosstab =
    colOrder.length > 0 &&
    firstDataValue !== null &&
    typeof firstDataValue === "object";

  const chartData = isCrosstab
    ? colOrder.map((colId: string) => ({
        name: toDisplayText(rawColOptions[colId], colId),
        color: PRIMARY_CHART_COLOR,
        data: rowOrder.map((rowId: string) => {
          const columnData = toRecord(dataValues[colId]);
          return {
            name: toDisplayText(rawRowOptions[rowId], rowId),
            y: toChartNumber(columnData[rowId]),
          };
        }),
      }))
    : [
        {
          name: "Responses",
          color: PRIMARY_CHART_COLOR,
          data: rowOrder.map((rowId: string) => ({
            name: toDisplayText(rawRowOptions[rowId], rowId),
            y: toChartNumber(dataValues[rowId]),
          })),
        },
      ];

  const categories = rowOrder.map((rowId: string) =>
    toDisplayText(rawRowOptions[rowId], rowId)
  );

  const headers = !isCrosstab
    ? ["Total"]
    : colOrder.map((colId: string) =>
        toDisplayText(rawColOptions[colId], colId)
      );

  const rows = rowOrder.map((rowId: string) => {
    const rowLabel = toDisplayText(rawRowOptions[rowId], rowId);
    const values = !isCrosstab
      ? [`${toDisplayText(dataValues[rowId], "0")}%`]
      : colOrder.map((colId: string) => {
          const columnData = toRecord(dataValues[colId]);
          return `${toDisplayText(columnData[rowId], "0")}%`;
        });
    return {
      rowLabel,
      values,
    };
  });

  const baseRow = !isCrosstab
    ? [questionData.base ?? 0]
    : colOrder.map((colId: string) => {
        const val =
          questionData.base?.[colId] ??
          questionData.responding_base?.[colId]?.[rowOrder[0]];
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
        (acc: number, val: unknown) =>
          acc + (typeof val === "number" ? val : 0),
        0
      );
      return `Base: (n = ${total})`;
    }

    return "Base: (n = 0)";
  })();

  const isExternalImage =
    questionData.external === 1 && Boolean(questionData.external_link);

  return {
    qid,
    questionData,
    isCrosstab,
    isExternalImage,
    chartData,
    categories,
    headers,
    rows,
    baseRow,
    baseText,
  };
};
