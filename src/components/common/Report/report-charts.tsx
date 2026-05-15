import { useState } from "react";
import ReportHeader from "./ReportHeader";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import TableAndCardScreen from "./TableAndCardScreen";
import { useLocation } from "react-router";
import PageContentShell from "../../ui/PageContentShell";
import LoaderSpinner from "../../global/LoaderSpinner";
import {
  useReportStudyInfo,
  useReportViewList,
} from "../../../api-network/report/query";

export default function Report() {
  const [showTableView, setShowTableView] = useState(false);
  const { state } = useLocation();
  const { fliterReportData } = useSelector((state: RootState) => state.filter);
  const { reportViewList, isReportViewListLoading } = useReportViewList(
    state.studyID
  );
  const { isReportStudyInfoLoading } = useReportStudyInfo(state.studyID);

  if (isReportViewListLoading || isReportStudyInfoLoading) {
    return (
      <div className="report-page-bg flex h-full min-h-0 items-center justify-center">
        <LoaderSpinner />
      </div>
    );
  }

  return (
    <div className="report-page-bg flex h-full min-h-0 flex-col overflow-hidden">
      <ReportHeader
        Title=""
        showTableView={showTableView}
        setShowTableView={setShowTableView}
      />
      <PageContentShell>
        <div className="w-full space-y-4">
          {(reportViewList?.[0]?.groupList?.seq ?? []).map((q: string) => {
            if (!fliterReportData.includes(q)) return null;
            return (
              <TableAndCardScreen
                qid={q}
                key={q}
                showTableView={showTableView}
              />
            );
          })}
        </div>
      </PageContentShell>
    </div>
  );
}

