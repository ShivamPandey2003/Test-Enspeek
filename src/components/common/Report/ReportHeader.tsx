import React, { useCallback, useMemo, useState } from "react";
import ActionButton from "./Action-button";
import PageSubheader from "../../ui/PageSubheader";

type ReportHeaderProps = {
  showTableView: boolean;
  setShowTableView: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReportHeader: React.FC<ReportHeaderProps> = ({
  showTableView,
  setShowTableView,
}) => {
  const [minimumActionWidth, setMinimumActionWidth] = useState(0);
  const handleMinimumWidthChange = useCallback((width: number) => {
    setMinimumActionWidth(width);
  }, []);
  const rightStyle = useMemo(
    () => ({ minWidth: minimumActionWidth || undefined }),
    [minimumActionWidth]
  );

  return (
    <PageSubheader
      contentClassName="flex-row items-center justify-between gap-2"
      leftClassName="flex min-h-8 min-w-0 shrink items-center"
      rightClassName="min-w-0 flex-1 flex-nowrap"
      rightStyle={rightStyle}
      left={
        <h1 className="report-title max-w-full truncate text-[16px] font-semibold leading-none">
          Report
        </h1>
      }
      right={
        <ActionButton
          onMinimumWidthChange={handleMinimumWidthChange}
          showTableView={showTableView}
          setShowTableView={setShowTableView}
        />
      }
    />
  );
};

export default ReportHeader;
