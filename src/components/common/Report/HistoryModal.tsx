import DynamicModel from "../../global/DynamicModel";
import Button from "../../ui/Button";
import { FiDownload } from "react-icons/fi";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import LoaderSpinner from "../../global/LoaderSpinner";
import { cn } from "../../../utils";
import { useState } from "react";
import { useLocation } from "react-router";
import { LuEraser } from "react-icons/lu";
import { useReportProcessList } from "../../../api-network/report/query";
import {
  useReportClearHistory,
  useReportProcessDownload,
} from "../../../api-network/report/mutation";
import { modalDefinitions } from "../../../config/modalDefinitions";

export default function HistoryModal({
  open,
  onOpenChange,
}: HistoryModalProps) {
  const definition = modalDefinitions.downloadHistory;
  const { name } = useSelector((state: RootState) => state.study);
  const [pid, setPid] = useState<string[]>([]);
  const { state } = useLocation();
  const { processDownload } = useReportProcessDownload(() => setPid([]));
  const { clearHistory, isClearHistoryPending } = useReportClearHistory({
    studyID: state.studyID,
    cb: () => onOpenChange(false),
  });
  const {
    reportProcessList,
    isReportProcessListLoading,
    isReportProcessListError,
  } = useReportProcessList(state.studyID);

  const DownloadHandle = (pid: string) => {
    setPid((prev) => [pid, ...prev]);
    processDownload({ studyID: state.studyID, pid });
  };
  const hasHistory = Boolean(reportProcessList?.data?.length);

  if (isReportProcessListError) {
    return null;
  }

  return (
    <DynamicModel
      Title={`${definition.title} : ${name}`}
      description="Review recent downloads for this study, or clear the history when you no longer need it."
      ButtonText={
        hasHistory
          ? isClearHistoryPending
            ? definition.submittingLabel!
            : definition.submitLabel!
          : ""
      }
      buttonIcon={
        hasHistory
          ? isClearHistoryPending ? (
              <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
            ) : (
              <LuEraser className="h-4 w-4" />
            )
          : undefined
      }
      buttonVariant="danger"
      isOpen={open}
      onClick={() => {
        if (hasHistory) {
          clearHistory();
        }
      }}
      onClose={() => onOpenChange(false)}
      className="max-w-xl"
      disable={isClearHistoryPending}
      secondaryActionPosition={hasHistory ? "before" : "after"}
      secondaryAction={
        <Button
          type="button"
          varinat="cancel"
          onClick={() => onOpenChange(false)}
          disabled={isClearHistoryPending}
        >
          {definition.cancelLabel}
        </Button>
      }
    >
      <div className="py-1">
        {isReportProcessListLoading ? (
          <LoaderSpinner />
        ) : reportProcessList?.data?.length ? (
          reportProcessList.data.map((item: any, index: number) => (
            <div
              data-test-id={`${item.req_name}_${index + 1}`}
              key={index}
              className={cn(
                "mb-3 flex items-center justify-between rounded-[18px] border home-border-soft p-4 shadow-sm",
                item.status === 0 ? "home-panel-soft-bg" : "bg-white",
                index === reportProcessList.data.length - 1 && "pb-4"
              )}
            >
              <div className="flex-1">
                <p className="home-text text-sm font-medium">
                  {index + 1}. {item.req_name}
                </p>
                <p className="home-muted text-xs">
                  {new Date(`${item.time}`).toDateString()}
                </p>
              </div>
              <div>
                <FiDownload
                  className={cn(
                    "h-6 w-6 cursor-pointer text-[var(--color-study-progress)]",
                    pid.includes(item.pid) && "text-[var(--color-brand-primary)]"
                  )}
                  onClick={() => DownloadHandle(item.pid)}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="questionnaire-heading flex h-full w-full items-center justify-center text-lg font-semibold">
            No Data Found
          </div>
        )}
      </div>
    </DynamicModel>
  );
}
