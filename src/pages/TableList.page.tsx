import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useLocation } from "react-router";
import { setIsDownloadDropdownOpen, setIsHistoryModalOpen } from "../store/CrosstabSlice";
import { LuDownload, LuFileSpreadsheet } from "react-icons/lu";
import Header from "../components/common/table-List/Header";
import CrossTabTable from "../components/common/table-List/CrossTabTable";
import PageContentShell from "../components/ui/PageContentShell";
import { useReportProcessDownload } from "../api-network/report/mutation";
import { useDownloadtable } from "../api-network/crosstab/tablelist/mutation";

const TableList_page = () => {
  const dispatch = useDispatch();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const { state } = useLocation();

   const { tableData } = useSelector(
    (state: RootState) => state.crossTabData
  );

   const { processDownload } = useReportProcessDownload();
    const { downloadTableMutate } = useDownloadtable({
      studyID: state.studyID,
      cb: ({ studyID, pid }) => {
        if (studyID && pid) {
          processDownload({ studyID, pid });
        }
      },
    });
  
    const tableIDList = tableData.map((t) => t.tableID);
    const dropDownData = [
      {
        Title: "Download All",
        Icon: LuFileSpreadsheet,
        onClick: () => {
          dispatch(setIsDownloadDropdownOpen(false));
          if (tableIDList.length) {
            downloadTableMutate({
              bannerID: state.bannerID,
              tableID: tableIDList,
            });
          }
        },
      },
      {
        Title: "Download History",
        Icon: LuDownload,
        onClick: () => {
          dispatch(setIsDownloadDropdownOpen(false));
          dispatch(setIsHistoryModalOpen(true));
        },
      },
    ];

  return (
    <div className="crosstab-page-bg flex h-full min-h-0 flex-col overflow-hidden">
      <Header dropdownRef={dropdownRef} dropDownData={dropDownData} />
      <PageContentShell>
        <div className="w-full">
          <CrossTabTable />
        </div>
      </PageContentShell>
    </div>
  );
};

export default TableList_page;
