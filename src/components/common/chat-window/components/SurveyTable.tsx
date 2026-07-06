import TableForm from "../../Report/TableForm";
import type { SurveyView } from "../types";

type SurveyTableProps = {
  view: SurveyView;
  studyID?: string;
};

/** Table view of a survey message. */
const SurveyTable = ({ view, studyID }: SurveyTableProps) => {
  const { qid, questionData, headers, baseRow, rows, baseText } = view;

  return (
    <TableForm
      questionId={qid}
      title={questionData.label}
      baseText={baseText}
      questionText={questionData.text || ""}
      headers={headers}
      baseRow={baseRow}
      rows={rows}
      studyID={studyID}
    />
  );
};

export default SurveyTable;
