import React, { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import {
  LuArrowRight,
  LuChartColumnBig,
  LuDownload,
  LuEllipsis,
  LuFileSpreadsheet,
  LuFilter,
  LuFiles,
  LuHand,
  LuListFilter,
  LuPresentation,
  LuTable2,
  LuToggleLeft,
  LuToggleRight,
} from "react-icons/lu";
import {
  useReportExcelDownload,
  useReportPptDownload,
  useReportProcessDownload,
  useReportSpssDownload,
  useReportTableDownload,
} from "../../../api-network/report/mutation";
import { useReportSideBySideVariables } from "../../../api-network/report/query";
import reportKeys from "../../../api-network/report/keys";
import { setSubgroupOn } from "../../../store/CrosstabSlice";
import {
  setFliterReportData,
  setSelected,
  setSide_by_side,
} from "../../../store/FiltersSlice";
import type { RootState } from "../../../store/store";
import { useProgressiveOverflow } from "../../../utils/useProgressiveOverflow";
import DropDown from "../../global/DropDown";
import LoaderSpinner from "../../global/LoaderSpinner";
import Button from "../../ui/Button";
import OverflowActionsMenu, {
  type OverflowActionMenuItem,
} from "../../ui/OverflowActionsMenu";
import FilterModal from "./FilterModal";
import HistoryModal from "./HistoryModal";
import ReportFilter from "./ReportFilter";
import SetSubgroupModal from "./SetSubGroupModal";

type ActionButtonProps = {
  onMinimumWidthChange: (width: number) => void;
  showTableView: boolean;
  setShowTableView: React.Dispatch<React.SetStateAction<boolean>>;
};

type InlineActionId =
  | "subgroups"
  | "configure-subgroups"
  | "select-questions"
  | "view-mode"
  | "filters";

export default function ActionButton({
  onMinimumWidthChange,
  showTableView,
  setShowTableView,
}: ActionButtonProps) {
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showPointerDropdown, setShowPointerDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [showSubgroupModal, setShowSubgroupModal] = useState(false);
  const interactionRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const subgroupOn = useSelector(
    (state: RootState) => state.crosstab.subgroupOn
  );
  const { tableQList, fliterReportData } = useSelector(
    (state: RootState) => state.filter
  );
  const { state } = useLocation();
  const studyID = state?.studyID;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const actionIds = useMemo<readonly InlineActionId[]>(
    () => [
      "subgroups",
      ...(subgroupOn ? (["configure-subgroups"] as const) : []),
      "select-questions",
      "view-mode",
      "filters",
    ],
    [subgroupOn]
  );
  const {
    containerRef,
    fixedControlsRef,
    getItemRef,
    minimumWidth,
    visibleIds,
  } = useProgressiveOverflow(actionIds);

  React.useLayoutEffect(() => {
    onMinimumWidthChange(minimumWidth);
  }, [minimumWidth, onMinimumWidthChange]);

  const { processDownload } = useReportProcessDownload();
  const { downloadExcel, isDownloadExcelPending } = useReportExcelDownload({
    studyID: studyID ?? "",
    cb: ({ studyID: callbackStudyID, pid }) => {
      processDownload({ studyID: callbackStudyID, pid });
    },
  });
  const { downloadSpss, isDownloadSpssPending } = useReportSpssDownload({
    studyID: studyID ?? "",
    cb: ({ studyID: callbackStudyID, pid }) => {
      processDownload({ studyID: callbackStudyID, pid });
    },
  });
  const { downloadTable, isDownloadTablePending } = useReportTableDownload({
    studyID: studyID ?? "",
    cb: ({ studyID: callbackStudyID, pid }) => {
      processDownload({ studyID: callbackStudyID, pid });
    },
  });
  const { downloadPpt, isDownloadPptPending } = useReportPptDownload({
    studyID: studyID ?? "",
    cb: ({ studyID: callbackStudyID, pid }) => {
      processDownload({ studyID: callbackStudyID, pid });
    },
  });
  const { sideBySideVariables } = useReportSideBySideVariables(studyID);

  const closeMoreDropdown = () => {
    setShowMoreDropdown(false);
    window.requestAnimationFrame(() => moreButtonRef.current?.focus());
  };

  const subGroupToggle = () => {
    if (subgroupOn) {
      dispatch(setSide_by_side("0"));
    } else {
      dispatch(setSelected(sideBySideVariables?.[0]?.qID ?? ""));
      dispatch(setSide_by_side("1"));
    }
    dispatch(setSubgroupOn(!subgroupOn));
  };

  const handleSubgroupSave = async (selectedValue: string) => {
    dispatch(setSelected(selectedValue));
    await queryClient.refetchQueries({
      queryKey: reportKeys.viewByIdRoot(studyID),
      type: "active",
    });
    setShowSubgroupModal(false);
  };

  const pointerDropdownData = [
    {
      Title: "Select All",
      checked:
        tableQList.length > 0 &&
        tableQList.every((item) => fliterReportData.includes(item)),
      onClick: () => {
        const allSelected =
          tableQList.length > 0 &&
          tableQList.every((item) => fliterReportData.includes(item));
        dispatch(
          setFliterReportData(allSelected ? [] : [...tableQList])
        );
      },
    },
    ...tableQList.map((item) => ({
      Title: item,
      checked: fliterReportData.includes(item),
      onClick: () =>
        dispatch(
          setFliterReportData(
            fliterReportData.includes(item)
              ? fliterReportData.filter((previous) => previous !== item)
              : [...fliterReportData, item]
          )
        ),
    })),
  ];

  const overflowMenuItem = (
    actionId: InlineActionId
  ): OverflowActionMenuItem => {
    switch (actionId) {
      case "subgroups":
        return {
          id: actionId,
          label: subgroupOn ? "Turn Subgroups Off" : "Turn Subgroups On",
          Icon: subgroupOn ? LuToggleRight : LuToggleLeft,
          checked: subgroupOn,
          disabled: !studyID,
          onSelect: subGroupToggle,
        };
      case "configure-subgroups":
        return {
          id: actionId,
          label: "Configure Subgroups",
          Icon: LuListFilter,
          disabled: !studyID,
          onSelect: () => setShowSubgroupModal(true),
        };
      case "select-questions":
        return {
          id: actionId,
          label: "Select Report Questions",
          Icon: LuHand,
          disabled: !studyID,
          onSelect: () => setShowPointerDropdown(true),
        };
      case "view-mode":
        return {
          id: actionId,
          label: showTableView ? "View Chart" : "View Table",
          Icon: showTableView ? LuChartColumnBig : LuTable2,
          onSelect: () => setShowTableView((previous) => !previous),
        };
      case "filters":
        return {
          id: actionId,
          label: "Filters",
          Icon: LuFilter,
          disabled: true,
          onSelect: () => setShowFiltersPanel(true),
        };
    }
  };

  const overflowItems = actionIds
    .filter((actionId) => !visibleIds.has(actionId))
    .map(overflowMenuItem);
  const permanentMenuItems: readonly OverflowActionMenuItem[] = [
    {
      id: "add-filters",
      label: "Add New Filters",
      Icon: LuFilter,
      disabled: true,
      onSelect: () => setShowFilterModal(true),
    },
    {
      id: "download-excel",
      label: "Download Excel Raw Data",
      Icon: LuFileSpreadsheet,
      disabled: !studyID || isDownloadExcelPending,
      onSelect: downloadExcel,
    },
    {
      id: "download-spss",
      label: "Download SPSS Raw Data",
      Icon: LuFiles,
      disabled: !studyID || isDownloadSpssPending,
      onSelect: downloadSpss,
    },
    {
      id: "download-table",
      label: "Download Table Raw Data",
      Icon: LuTable2,
      disabled: !studyID || isDownloadTablePending,
      onSelect: downloadTable,
    },
    {
      id: "download-ppt",
      label: "Download PPT",
      Icon: LuPresentation,
      disabled: !studyID || isDownloadPptPending,
      onSelect: downloadPpt,
    },
    {
      id: "download-history",
      label: "Download History",
      Icon: LuDownload,
      disabled: !studyID,
      onSelect: () => setShowHistory(true),
    },
  ];
  const menuItems = [...overflowItems, ...permanentMenuItems];
  const selectorIsInline = visibleIds.has("select-questions");

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!interactionRef.current?.contains(event.target as Node)) {
        setShowMoreDropdown(false);
        setShowPointerDropdown(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (showMoreDropdown || showPointerDropdown) {
        event.preventDefault();
        setShowMoreDropdown(false);
        setShowPointerDropdown(false);
        moreButtonRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showMoreDropdown, showPointerDropdown]);

  const renderInlineAction = (actionId: InlineActionId) => {
    switch (actionId) {
      case "subgroups":
        return (
          <Button
            data-test-id="GROUP_TOGGLE"
            disabled={!studyID}
            className="report-toolbar-btn report-title border home-border-soft bg-white hover:bg-white hover:text-[var(--color-text-strong)] [&_svg]:size-5"
            onClick={subGroupToggle}
          >
            {subgroupOn ? (
              <LuToggleRight className="mr-1 text-login-primary" />
            ) : (
              <LuToggleLeft className="mr-1 report-muted" />
            )}
            Subgroups
          </Button>
        );
      case "configure-subgroups":
        return (
          <Button
            data-test-id="GROUP_TOGGLE_ON"
            size="default"
            tooltip="Configure subgroups"
            disabled={!studyID}
            className="report-toolbar-btn bg-[var(--color-study-progress)] text-white hover:bg-[var(--color-study-progress)] hover:text-white hover:opacity-90"
            onClick={() => setShowSubgroupModal(true)}
          >
            <LuListFilter />
          </Button>
        );
      case "select-questions":
        return (
          <Button
            data-test-id="SELECTOR"
            tooltip="Select report questions"
            disabled={!studyID}
            onClick={() => setShowPointerDropdown((previous) => !previous)}
            size="default"
            className="report-toolbar-btn bg-[var(--color-brand-primary-soft)] text-white hover:bg-login-primary"
          >
            <LuHand />
          </Button>
        );
      case "view-mode":
        return (
          <Button
            data-test-id="TABLE"
            size="default"
            tooltip={showTableView ? "View chart mode" : "View table mode"}
            className="report-toolbar-btn report-title border home-border-soft bg-white hover:bg-white hover:text-[var(--color-text-strong)]"
            onClick={() => setShowTableView((previous) => !previous)}
          >
            {showTableView ? <LuChartColumnBig /> : <LuTable2 />}
          </Button>
        );
      case "filters":
        return (
          <Button
            size="default"
            tooltip="Filters"
            className="report-toolbar-btn bg-[var(--color-brand-info)] text-white hover:opacity-90"
            onClick={() => setShowFiltersPanel(true)}
            disabled
          >
            <LuFilter />
          </Button>
        );
    }
  };

  return (
    <div ref={interactionRef} className="relative min-w-0 w-full">
      <div
        ref={containerRef}
        className="flex min-h-8 min-w-0 w-full flex-nowrap items-center justify-end gap-2"
      >
        {actionIds.map((actionId) =>
          visibleIds.has(actionId) ? (
            <div
              key={actionId}
              ref={getItemRef(actionId)}
              className="relative shrink-0"
            >
              {renderInlineAction(actionId)}
              {actionId === "select-questions" && showPointerDropdown ? (
                <DropDown
                  showCheckbox
                  Data={pointerDropdownData}
                  className="top-full max-h-[min(70vh,32rem)] max-w-[calc(100vw-2rem)] overflow-auto"
                />
              ) : null}
            </div>
          ) : null
        )}

        <div
          ref={fixedControlsRef}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="relative">
            <Button
              ref={moreButtonRef}
              type="button"
              data-test-id="MORE_ACTIONS"
              size="default"
              tooltip="More report actions"
              aria-haspopup="menu"
              aria-expanded={showMoreDropdown}
              disabled={!studyID}
              className="report-toolbar-btn bg-[var(--color-questionnaire-multi)] text-white hover:bg-[var(--color-questionnaire-multi)] hover:text-white hover:opacity-90"
              onClick={() => {
                setShowPointerDropdown(false);
                setShowMoreDropdown((previous) => !previous);
              }}
            >
              <LuEllipsis />
            </Button>
            {showMoreDropdown ? (
              <OverflowActionsMenu
                anchorRef={moreButtonRef}
                ariaLabel="Report actions"
                items={menuItems}
                onClose={closeMoreDropdown}
              />
            ) : null}
            {!selectorIsInline && showPointerDropdown ? (
              <DropDown
                showCheckbox
                Data={pointerDropdownData}
                className="top-full max-h-[min(70vh,32rem)] max-w-[calc(100vw-2rem)] overflow-auto"
              />
            ) : null}
          </div>
          <Button
            data-test-id="NEXT_TO_CROSSTAB"
            variant="theme"
            disabled={!studyID}
            onClick={() => navigate("/crosstab", { state: { studyID } })}
          >
            Next <LuArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFiltersPanel ? (
        <ReportFilter
          onClose={() => setShowFiltersPanel(false)}
          onClear={() => {}}
        />
      ) : null}
      {showSubgroupModal ? (
        <SetSubgroupModal
          options={sideBySideVariables}
          onSave={handleSubgroupSave}
          onClose={() => setShowSubgroupModal(false)}
        />
      ) : null}
      <FilterModal
        isOpen={showFilterModal}
        setIsOpen={() => setShowFilterModal(false)}
      />
      <HistoryModal open={showHistory} onOpenChange={setShowHistory} />
      {isDownloadExcelPending ||
      isDownloadSpssPending ||
      isDownloadTablePending ||
      isDownloadPptPending ? (
        <LoaderSpinner />
      ) : null}
    </div>
  );
}
