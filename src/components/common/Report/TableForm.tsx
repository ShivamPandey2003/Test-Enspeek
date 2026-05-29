import { LuDownload } from "react-icons/lu";
import Button from "../../ui/Button";
import { useLocation } from "react-router";
import {
  useReportProcessDownload,
  useReportTableDownload,
} from "../../../api-network/report/mutation";
import {
  SurfaceCard,
  SurfaceCardHeader,
  SurfaceCardTitle,
} from "../../ui/SurfaceCard";

interface TableFormProps {
  questionId: string;
  studyID?: string;
  title: string;
  baseText: string;
  questionText: string;
  headers: string[];
  baseRow: (string | number)[];
  rows: {
    rowLabel: string;
    values: (string | number)[];
  }[];
}

export default function TableForm({
  questionId,
  title,
  baseText,
  questionText,
  headers,
  baseRow,
  rows,
  studyID,
}: TableFormProps) {
  const { state } = useLocation();
  const { processDownload } = useReportProcessDownload();
  const { downloadTable } = useReportTableDownload({
    studyID: studyID ? studyID : state?.studyID,
    cb: ({ studyID, pid }) => {
      processDownload({ studyID, pid });
    },
  });
  return (
    <SurfaceCard
      data-test-id={`${questionId}_TABLE`}
      key={questionId}
      className="report-card w-full overflow-hidden"
    >
      <SurfaceCardHeader>
        <SurfaceCardTitle>{title}</SurfaceCardTitle>
        <Button
          className="report-toolbar-btn bg-[var(--color-brand-primary-softest)] text-login-primary hover:bg-[var(--color-brand-primary-soft)] hover:text-white"
          onClick={() => {
            downloadTable(questionId);
          }}
        >
          <LuDownload />
        </Button>
      </SurfaceCardHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="home-panel-soft-bg report-muted text-left">
              <th className="px-6 py-3"></th>
              {headers.map((h, i) => (
                <th key={i} className="px-6 py-3 text-center font-semibold">
                  {h}
                </th>
              ))}
            </tr>
            <tr className="bg-white report-muted">
              <td className="report-title px-6 py-3 font-semibold">Base</td>
              {baseRow.map((item, idx) => (
                <td key={idx} className="report-title px-6 py-3 text-center font-semibold">
                  {item}
                </td>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={rowIndex % 2 === 0 ? "home-panel-soft-bg" : "bg-white"}
              >
                <td className="report-title px-6 py-3">{row.rowLabel}</td>
                {row.values.map((val, idx) => (
                  <td key={idx} className="home-text px-6 py-3 text-center">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="report-muted px-6 py-4 space-y-1">
        <p className="text-sm">{baseText}</p>
        <p className="text-sm">{questionText}</p>
      </div>
    </SurfaceCard>
  );
}
