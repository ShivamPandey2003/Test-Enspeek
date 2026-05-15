import { LuDownload, LuLoaderCircle, LuPencilLine, LuRefreshCw } from "react-icons/lu";
import { useDispatch } from "react-redux";
import {
  setIsEditModal,
  setSelectedQid,
  setSelectedTable,
} from "../../../store/CrosstabSlice";
import { useLocation } from "react-router";
import IconActionButton from "../../ui/IconActionButton";
import { useReportProcessDownload } from "../../../api-network/report/mutation";
import { useDownloadtable } from "../../../api-network/crosstab/tablelist/mutation";
import {
  useBannerPointerList,
} from "../../../api-network/crosstab/query";
import { useTableOutput } from "../../../api-network/crosstab/tablelist/query";

interface TableListProp {
  Id: string;
  qID: string;
  Title: string;
  Description: string;
  tableIDList: string[];
  tableID: string;
  sdata?: any;
}

export default function TableList({
  Id,
  Title,
  Description,
  qID,
  tableID,
  sdata
}: TableListProp) {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { bannerPointerListData } = useBannerPointerList(
    state.bannerID,
    state.studyID
  );
  const {
  tableOutputData,
  TableOutputData,
  isTableOutputRefetching,
} = useTableOutput(
  Id,
  state?.bannerID,
  state?.studyID
);

const isStatic = !!sdata;
const dataSource = isStatic ? sdata : tableOutputData;
const bannerPoints = Array.isArray(bannerPointerListData)
  ? bannerPointerListData
  : [];
const baseData = dataSource?.base ?? {};
const rowOrder = Array.isArray(dataSource?._row_order)
  ? dataSource._row_order
  : [];
const rowsData = dataSource?._rows ?? {};
const tableData = dataSource?.data ?? {};
const isTableReady =
  bannerPoints.length > 0 &&
  !!dataSource &&
  typeof dataSource === "object" &&
  !isTableOutputRefetching;

  const { processDownload } = useReportProcessDownload();
  const { downloadTableMutate } = useDownloadtable({
    studyID: state.studyID,
    cb: ({ studyID, pid }) => {
      if (studyID && pid) {
        processDownload({ studyID, pid });
      }
    },
  });

  const onEditHandle = () => {
    dispatch(setSelectedTable(Id));
    dispatch(setSelectedQid(qID));
    dispatch(setIsEditModal(true));
  };

  return (
    <div className="mt-4" data-test-id={`TABLE_${qID}`}>
      <div className="report-card p-3">
        <div className="flex flex-col justify-between gap-3 bg-white px-3 py-1 md:flex-row md:items-center">
          <div>
            <h2 className="crosstab-title font-semibold">{Title}</h2>
            <p className="crosstab-muted text-sm">{Description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!isStatic && (
            <IconActionButton
              aria-label="Refresh"
              onClick={() => TableOutputData()}
            >
              <LuRefreshCw size={18} />
            </IconActionButton>
             )}
            <IconActionButton
              tone="warning"
              aria-label="Download"
              onClick={() =>
                downloadTableMutate({
                  bannerID: state.bannerID,
                  tableID: [tableID],
                })
              }
            >
              <LuDownload size={18} />
            </IconActionButton>
             {!isStatic && (
            <IconActionButton
              tone="primary"
              aria-label="Edit"
              onClick={onEditHandle}
            >
              <LuPencilLine size={18} />
            </IconActionButton>
             )}
          </div>
        </div>
        <div className="crosstab-soft-panel my-4 overflow-x-auto mx-auto">
          {!isTableReady ? (
            <div className="flex p-4 justify-center">
              <LuLoaderCircle size={34} className="animate-spin text-action" />
            </div>
          ) : (
            <table className="w-full table-fixed divide-y home-border-soft">
              <colgroup>
                <col className="w-[48%]" />
                {bannerPoints.map((header: BannerPoint) => (
                  <col
                    key={header.pointID}
                    style={{ width: `${52 / Math.max(bannerPoints.length, 1)}%` }}
                  />
                ))}
              </colgroup>
              <thead>
                <tr className="home-panel-soft-bg">
                  <th className="px-6 py-3 text-left crosstab-muted"></th>
                  {bannerPoints.map((header: BannerPoint) => (
                    <th
                      key={header.pointID}
                      className="px-6 py-3 text-center crosstab-muted border-l home-border-soft"
                    >
                      <div>{header.title}</div>
                      <div className="text-[var(--color-questionnaire-stop)]">{header.alpha}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y home-border-soft">
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold crosstab-title">
                    Base
                  </td>
                  {bannerPoints.map((seq: BannerPoint) => (
                    <td
                      key={seq.pointID}
                      className="px-6 py-4 text-center text-sm font-bold crosstab-title border-l home-border-soft"
                    >
                      {baseData[seq.pointID as keyof typeof baseData] ?? 0}
                    </td>
                  ))}
                </tr>
                {rowOrder.map((seq: any) => (
                  <tr key={seq}>
                    <td className="px-6 py-4 text-sm crosstab-title">
                      {rowsData[seq as keyof typeof rowsData] ?? ""}
                    </td>
                    {bannerPoints.map((seqData: BannerPoint) => {
                      const value =
                        tableData[
                          seq as keyof typeof tableData
                        ] ?? {};
                      return (
                        <td
                          key={seqData.pointID}
                          className="px-6 py-4 text-center text-sm home-text border-l home-border-soft"
                        >
                          {value[seqData.pointID as keyof typeof value]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
