import Report from "../components/common/Report/report-charts";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { ErrorBoundary } from "react-error-boundary";
import Error from "../components/global/Error";
import { useLocation } from "react-router";
import {
  useReportAppliedFilter,
  useReportFilters,
  useReportFiltersList,
} from "../api-network/report/query";

const Report_page = () => {
  const trigger = useSelector((state: RootState) => state.trigger);
  const { state } = useLocation();

  useReportAppliedFilter(state.studyID, trigger.add);
  useReportFiltersList(state.studyID, trigger.add);
  useReportFilters(state.studyID, trigger.add);

  return (
    <ErrorBoundary fallbackRender={() => <Error showHome />}>
        <Report />
    </ErrorBoundary>
  );
};

export default Report_page;
