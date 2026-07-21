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

  // Hooks are called unconditionally (Rules of Hooks); each is already gated by
  // `enabled: !!studyID`, so a missing studyID makes them no-op.
  useReportAppliedFilter(state?.studyID, trigger.add);
  useReportFiltersList(state?.studyID, trigger.add);
  useReportFilters(state?.studyID, trigger.add);

  // On a hard refresh / deep-link, router `state` is null. Bail cleanly instead
  // of throwing before render (the ErrorBoundary below only wraps <Report/>).
  if (!state?.studyID) {
    return <Error showHome />;
  }

  return (
    <ErrorBoundary fallbackRender={() => <Error showHome />}>
        <Report />
    </ErrorBoundary>
  );
};

export default Report_page;
