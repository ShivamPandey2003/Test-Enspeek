import { useMemo, useRef } from "react";
import { LuDownload, LuEllipsisVertical, LuLoaderCircle, LuPencilLine, LuRefreshCw } from "react-icons/lu";
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
import { TABLE_CARD_ACTION_PRIORITY } from "../../../utils/crosstabResponsive";
import { useOverflowMenu } from "../../../utils/useOverflowMenu";
import { useProgressiveOverflow } from "../../../utils/useProgressiveOverflow";
import OverflowActionsMenu, { type OverflowActionMenuItem } from "../../ui/OverflowActionsMenu";

interface TableListProp {
  Id: string;
  qID: string;
  Title: string;
  Description: string;
  tableIDList: string[];
  tableID: string;
  sdata?: StaticTableData;
}

type TableActionId = (typeof TABLE_CARD_ACTION_PRIORITY)[number];

type StaticTableData = {
  base?: Record<string, number>;
  _row_order?: string[];
  _rows?: Record<string, string>;
  data?: Record<string, Record<string, string | number>>;
};

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

  const actionIds = useMemo<readonly TableActionId[]>(
    () => (isStatic ? (["download"] as const) : TABLE_CARD_ACTION_PRIORITY),
    [isStatic]
  );
  const allVisibleFixedControlsRef = useRef<HTMLDivElement>(null);
  const { containerRef, fixedControlsRef, getItemRef, visibleIds } =
    useProgressiveOverflow(actionIds, { allVisibleFixedControlsRef });
  const tableActions = [
    ...(!isStatic
      ? [{ id: "refresh" as const, label: "Refresh table", Icon: LuRefreshCw, tone: "neutral" as const, onSelect: () => TableOutputData() }]
      : []),
    {
      id: "download" as const,
      label: "Download table",
      Icon: LuDownload,
      tone: "warning" as const,
      onSelect: () => downloadTableMutate({ bannerID: state.bannerID, tableID: [tableID] }),
    },
    ...(!isStatic
      ? [{ id: "edit" as const, label: "Edit table", Icon: LuPencilLine, tone: "primary" as const, onSelect: onEditHandle }]
      : []),
  ];
  const overflowItems: readonly OverflowActionMenuItem[] = tableActions
    .filter((action) => !visibleIds.has(action.id))
    .map(({ id, label, Icon, onSelect }) => ({ id, label, Icon, onSelect }));
  const actionMenu = useOverflowMenu(overflowItems.length > 0);

  return (
    <div className="mt-4" data-test-id={`TABLE_${qID}`}>
      <div className="report-card p-3">
        <div className="bg-white px-3 py-1">
          <div className="flex min-w-0 items-center justify-between gap-2">
            <h2 className="crosstab-title min-w-0 flex-1 truncate font-semibold" title={Title}>{Title}</h2>
            <div ref={actionMenu.boundaryRef} className="relative min-w-0 flex-1">
              <div ref={containerRef} className="flex min-h-8 min-w-0 items-center justify-end gap-2">
                {tableActions.map((action) => visibleIds.has(action.id) ? (
                  <div key={action.id} ref={getItemRef(action.id)} className="shrink-0">
                    <IconActionButton tone={action.tone} tooltip={action.label} aria-label={action.label} onClick={action.onSelect}>
                      <action.Icon size={18} />
                    </IconActionButton>
                  </div>
                ) : null)}
                <div ref={fixedControlsRef} className="flex shrink-0 items-center">
                  <div ref={allVisibleFixedControlsRef} aria-hidden="true" className="pointer-events-none absolute h-0 w-0" />
                  {overflowItems.length > 0 ? (
                    <IconActionButton
                      ref={actionMenu.triggerRef}
                      tone="success"
                      tooltip="More table actions"
                      aria-label="More table actions"
                      aria-haspopup="menu"
                      aria-expanded={actionMenu.isOpen}
                      onClick={() => actionMenu.setIsOpen((current) => !current)}
                    >
                      <LuEllipsisVertical size={18} />
                    </IconActionButton>
                  ) : null}
                </div>
              </div>
              {actionMenu.isOpen ? (
                <OverflowActionsMenu anchorRef={actionMenu.triggerRef} ariaLabel="Table actions" items={overflowItems} onClose={actionMenu.close} />
              ) : null}
            </div>
          </div>
          <p className="crosstab-muted mt-1 whitespace-normal break-words text-sm">{Description}</p>
        </div>
        <div className="crosstab-soft-panel my-4 overflow-x-auto mx-auto">
          {!isTableReady ? (
            <div className="flex p-4 justify-center">
              <LuLoaderCircle size={34} className="animate-spin text-action" />
            </div>
          ) : (
            <table className="w-full table-fixed">
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
                      className="px-6 py-3 text-center crosstab-muted"
                    >
                      <div>{header.title}</div>
                      <div className="text-[var(--color-questionnaire-stop)]">{header.alpha}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr>
                  <td className="px-6 py-4 text-sm font-semibold crosstab-title">
                    Base
                  </td>
                  {bannerPoints.map((seq: BannerPoint) => (
                    <td
                      key={seq.pointID}
                      className="px-6 py-4 text-center text-sm font-bold crosstab-title"
                    >
                      {baseData[seq.pointID as keyof typeof baseData] ?? 0}
                    </td>
                  ))}
                </tr>
                {rowOrder.map((seq: string) => (
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
                          className="px-6 py-4 text-center text-sm home-text"
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
