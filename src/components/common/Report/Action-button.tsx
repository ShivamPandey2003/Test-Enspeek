import React, { useState, useRef, useEffect } from "react";
import Button from "../../ui/Button";
import { LuArrowRight, LuChartColumnBig, LuDownload, LuEllipsis, LuFileSpreadsheet, LuFilter, LuFiles, LuHand, LuListFilter, LuPresentation, LuTable2, LuToggleLeft, LuToggleRight } from "react-icons/lu";
import ReportFilter from "./ReportFilter";
import FilterModal from "./FilterModal";
import HistoryModal from "./HistoryModal";
import { useReportSideBySideVariables } from "../../../api-network/report/query";
import { useReportExcelDownload, useReportPptDownload, useReportProcessDownload, useReportSpssDownload, useReportTableDownload } from "../../../api-network/report/mutation";
import LoaderSpinner from "../../global/LoaderSpinner";
import DropDown from "../../global/DropDown";
import SetSubgroupModal from "./SetSubGroupModal";
import { useQueryClient } from "@tanstack/react-query";
import type { RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { setFliterReportData, setSelected, setSide_by_side } from "../../../store/FiltersSlice";
import { Link, useLocation } from "react-router";
import { setSubgroupOn } from "../../../store/CrosstabSlice";
import reportKeys from "../../../api-network/report/keys";

type ActionButtonProps = {
  showTableView: boolean;
  setShowTableView: React.Dispatch<React.SetStateAction<boolean>>;
};

const ActionButton: React.FC<ActionButtonProps> = ({
  showTableView,
  setShowTableView,
}) => {
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);
  const [showPointerDropdown, setShowPointerDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const subgroupOn = useSelector((state: RootState) => state.crosstab.subgroupOn);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectDropdownRef = useRef<HTMLDivElement>(null);
  const { tableQList, fliterReportData } = useSelector((state: RootState) => state.filter);
  const { state } = useLocation();
  const [showSubgroupModal, setshowSubgroupModal] = useState(false);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { processDownload } = useReportProcessDownload();
  const { downloadExcel, isDownloadExcelPending } = useReportExcelDownload({
    studyID: state.studyID,
    cb: ({ studyID, pid }) => {
      processDownload({ studyID, pid });
    },
  });
  const { downloadSpss, isDownloadSpssPending } = useReportSpssDownload({
    studyID: state.studyID,
    cb: ({ studyID, pid }) => {
      processDownload({ studyID, pid });
    },
  });
  const { downloadTable, isDownloadTablePending } = useReportTableDownload({
    studyID: state.studyID,
    cb: ({ studyID, pid }) => {
      processDownload({ studyID, pid });
    },
  });
  const { downloadPpt, isDownloadPptPending } = useReportPptDownload({
    studyID: state.studyID,
    cb: ({ studyID, pid }) => {
      processDownload({ studyID, pid });
    },
  });

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
        if (allSelected) {
          dispatch(setFliterReportData([]));
        } else {
          dispatch(setFliterReportData([...tableQList]));
        }
      },
    },
    ...tableQList.map((item) => ({
      Title: item,
      checked: fliterReportData.includes(item),
      onClick: () =>
        dispatch(
          setFliterReportData(
            fliterReportData.includes(item)
              ? fliterReportData.filter((pre) => pre !== item)
              : [...fliterReportData, item]
          )
        ),
    })),
  ];

  const MoreDropdownData = [
    {
      Title: "Add New Filters",
      Icon: LuFilter,
      onClick: () => {
        setShowModal(true);
      },
    },
    {
      Title: "Download Excel Raw Data",
      Icon: LuFileSpreadsheet,
      onClick: () => downloadExcel(),
    },
    {
      Title: "Download SPSS Raw Data",
      Icon: LuFiles,
      onClick: () => downloadSpss(),
    },
    {
      Title: "Download Table Raw Data",
      Icon: LuTable2,
      onClick: () => downloadTable(),
    },
    {
      Title: "Download PPT",
      Icon: LuPresentation,
      onClick: () => downloadPpt(),
    },
    {
      Title: "Download History",
      Icon: LuDownload,
      onClick: () => {
        setOpen(true);
      },
    },
  ];

  const { sideBySideVariables } = useReportSideBySideVariables(state.studyID);

  const handleSave = async (selectedValue: string) => {
    dispatch(setSelected(selectedValue));
    await queryClient.refetchQueries({
      queryKey: reportKeys.viewByIdRoot(state.studyID),
      type: "active",
    });
    setshowSubgroupModal(false);
  };

  const subGroupToggle = () => {
    if (!!subgroupOn) {
      dispatch(setSide_by_side("0"));
    } else {
      dispatch(setSelected(sideBySideVariables?.[0]?.qID ?? ""));
      dispatch(setSide_by_side("1"));
    }
    dispatch(setSubgroupOn(!subgroupOn));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        showMoreDropdown &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setShowMoreDropdown(false);
      }

      if (
        showPointerDropdown &&
        selectDropdownRef.current &&
        !selectDropdownRef.current.contains(target)
      ) {
        setShowPointerDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMoreDropdown, showPointerDropdown]);

  return (
    <div className="relative">
      <div className="flex min-h-[42px] flex-wrap items-center gap-2 md:justify-end">
        <div className="flex items-center gap-2">
          <Button
            data-test-id="GROUP_TOGGLE"
            className="report-toolbar-btn report-title border home-border-soft bg-white px-4 hover:bg-white hover:text-[var(--color-text-strong)] [&_svg]:size-5"
            onClick={subGroupToggle}
          >
            {subgroupOn ? (
              <LuToggleRight className="mr-1 text-login-primary" />
            ) : (
              <LuToggleLeft className="mr-1 report-muted" />
            )}
            Subgroups
          </Button>
          {subgroupOn && (
            <Button
              data-test-id="GROUP_TOGGLE_ON"
              size="icon"
              tooltip="Configure subgroups"
              className="report-toolbar-btn bg-[var(--color-study-progress)] text-white hover:bg-[var(--color-study-progress)] hover:text-white hover:opacity-90"
              onClick={() => {
                setshowSubgroupModal(true);
              }}
            >
              <LuListFilter />
            </Button>
          )}
        </div>
        <div className="relative" ref={selectDropdownRef}>
          <Button
            data-test-id="SELECTOR"
            tooltip="Select report questions"
            onClick={() => setShowPointerDropdown((prev) => !prev)}
            size="icon"
            className="report-toolbar-btn bg-[var(--color-brand-primary-soft)] text-white hover:bg-login-primary"
          >
            <LuHand />
          </Button>
          {showPointerDropdown && (
            <div className="absolute right-0 z-20 mt-2">
              <DropDown showCheckbox={true} Data={pointerDropdownData} />
            </div>
          )}
        </div>
        <Button
          data-test-id="TABLE"
          size="icon"
          tooltip={showTableView ? "View chart mode" : "View table mode"}
          className="report-toolbar-btn report-title border home-border-soft bg-white hover:bg-white hover:text-[var(--color-text-strong)]"
          onClick={() => setShowTableView((prev) => !prev)}
        >
          {showTableView ? <LuChartColumnBig /> : <LuTable2 />}
        </Button>
        <Button
          size="icon"
          tooltip="Filters"
          className="report-toolbar-btn bg-[var(--color-brand-info)] text-white hover:opacity-90"
          onClick={() => {
            setShowFilter(true);
          }}
          disabled
        >
          <LuFilter />
        </Button>
        <div className="relative" ref={dropdownRef}>
          <Button
            data-test-id="MORE_ACTIONS"
            size="icon"
            tooltip="More actions"
            className="report-toolbar-btn bg-[var(--color-questionnaire-multi)] text-white hover:bg-[var(--color-questionnaire-multi)] hover:text-white hover:opacity-90"
            onClick={() => {
              setShowMoreDropdown((prev) => !prev);
            }}
          >
            <LuEllipsis />
          </Button>
          {showMoreDropdown && (
            <div className="absolute right-0 mt-2 z-10">
              <DropDown Data={MoreDropdownData} className="w-72 z-20" />
            </div>
          )}
        </div>
        <Link
          to={"/crosstab"}
          state={{ studyID: state.studyID }}
          className="platform-btn-pill report-toolbar-btn inline-flex h-10 items-center gap-2 bg-login-primary px-5 text-sm font-bold text-white hover:bg-login-primary-hover"
        >
          Next <LuArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {showFilter && (
        <ReportFilter onClose={() => setShowFilter(false)} onClear={() => { }} />
      )}
      <div>
        {showSubgroupModal && (
          <SetSubgroupModal
            options={sideBySideVariables}
            onSave={handleSave}
            onClose={() => setshowSubgroupModal(false)}
          />
        )}
      </div>
      <FilterModal isOpen={showModal} setIsOpen={() => setShowModal(false)} />
      <HistoryModal open={open} onOpenChange={setOpen} />
      {(isDownloadExcelPending ||
        isDownloadSpssPending ||
        isDownloadTablePending ||
        isDownloadPptPending) && <LoaderSpinner />}
    </div>
  );
};

export default ActionButton;
