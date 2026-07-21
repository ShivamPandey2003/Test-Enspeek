import SingleSelectChart from "../../Report/Charts";
import QuestionCard from "../../Report/QuestionCard";
import type { SurveyView } from "../types";

type SurveyChartProps = {
  view: SurveyView;
  studyID?: string;
};

/**
 * Chart view of a survey message: an external image when provided, otherwise a
 * Highcharts column chart. Wrapped in the shared QuestionCard.
 */
const SurveyChart = ({ view, studyID }: SurveyChartProps) => {
  const { qid, questionData, isExternalImage, chartData, categories, baseText } =
    view;

  return (
    <QuestionCard title={questionData.label} qId={qid} studyID={studyID}>
      {isExternalImage ? (
        <div className="w-full">
          <img
            src={questionData.external_link}
            alt={questionData.label}
            className="w-full max-w-xl justify-center"
          />
        </div>
      ) : (
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
  );
};

export default SurveyChart;
